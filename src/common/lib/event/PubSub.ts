import { noop } from "lodash";
import { v4 as randomUuid } from "uuid";

import { IS_MAIN } from "../../config";
import { logger } from "../../logger";
import { IsomorphicService } from "../../modules/ContainerModule";
import { ipcMain, ipcRenderer } from "../ipc";
import type {
    EventKeyType,
    EventListener,
    EventType,
    Unsubscriber,
} from "./type";

const PUBSUB_SUBSCRIBE_EVENT = "pubsub.event.subscribe";
const PUBSUB_UNSUBSCRIBE_EVENT = "pubsub.event.unsubscribe";
const PUBSUB_TRIGGER_EVENT = "pubsub.event.trigger";

type EventKey = Exclude<keyof EventKeyType, "_">;
declare module "../ipc/event" {
    interface DualAsyncIpcMapping {
        [PUBSUB_SUBSCRIBE_EVENT]: DualIpcConfig<
            typeof PUBSUB_TRIGGER_EVENT,
            [id: EventKey, uuid: string],
            [id: EventKey, event: EventType<EventKey>]
        >;
    }

    interface SyncIpcMapping {
        [PUBSUB_UNSUBSCRIBE_EVENT]: IpcConfig<[uuid: string], boolean>;
    }
}

/**
 * PubSub - as Publisher/Subscriber - is an isomorphic service that
 * provide a way to send and receive events through all processes.
 *
 * See pubsub doc for more infos.
 */
export class PubSub extends IsomorphicService {
    private static INSTANCE: PubSub | null = null;

    private readonly eventMap = new Map<string, Set<EventListener>>();

    private readonly unsubscribersInRenderer = new Map<string, Unsubscriber>();

    private constructor() {
        super();
        if (IS_MAIN) {
            // on main, when the renderer asks for a subscribe to any id,
            // subscribe *in main* as wrapped listener that will call back
            // the trigger with an ipc event (PUBSUB_TRIGGER_EVENT)
            // also save the "unsubscriber" returned function for later usage
            ipcMain.on(PUBSUB_SUBSCRIBE_EVENT, (ipcEvent, id, uuid) => {
                logger.log("[pubsub] renderer asks for subscribe", {
                    id,
                    uuid,
                });
                const unsub = this.subscribe(id, (event) => {
                    ipcEvent.reply(PUBSUB_TRIGGER_EVENT, id, {
                        ...event,
                        uuid,
                    } as never);
                });

                this.unsubscribersInRenderer.set(uuid, unsub);
            });
            // on main, when the renderer asks for an unsubscribe,
            // get and trigger "unsubscriber" functions (which call the
            // PUBSUB_UNSUBSCRIBE_EVENT back to ipc) and delete them
            ipcMain.on(PUBSUB_UNSUBSCRIBE_EVENT, (event, uuid) => {
                logger.log("[pubsub] renderer asks for unsub", { uuid });
                this.unsubscribersInRenderer.get(uuid)?.();
                event.returnValue = this.unsubscribersInRenderer.delete(uuid);
            });
        } else {
            // on renderer, when the main calls back a trigger event
            // - basically when a publish is done on main - propagate the
            // trigger to registered renderer listeners
            ipcRenderer.on(PUBSUB_TRIGGER_EVENT, (_, id, event) => {
                logger.log("[pubsub] main triggered an event", {
                    event,
                    id,
                });
                this.publish(id, event);
            });
        }
    }

    /**
     * Return one and only one instance of PubSub.
     */
    public static getInstance(): PubSub {
        return PubSub.INSTANCE ?? (PubSub.INSTANCE = new PubSub());
    }

    /**
     * @override
     */
    public async uninit(): pvoid {
        this.unsubscribersInRenderer.forEach((unsubscribe, uuid) => {
            logger.log("[pubsub] call unsubscribe for ", uuid);
            unsubscribe();
        });
        this.unsubscribersInRenderer.clear();
        this.eventMap.clear();
        return Promise.resolve();
    }

    /**
     * Subscribe to an event with a given listener.
     *
     * - From main to main, will localy saves the listener for later trigger.
     * - From renderer to renderer, acts the same.
     * - From renderer to main, will saves the listener but also send an ipc event
     * to main for it be able to calls back a trigger from main to renderer.
     */
    public subscribe<TKey extends EventKey>(
        id: EventKey | TKey,
        listener: EventListener<TKey>
    ): Unsubscriber {
        let unsubscribe = noop;
        if (this.eventMap.has(id)) {
            this.eventMap.get(id)?.add(listener);
        } else {
            this.eventMap.set(id, new Set([listener]));
        }

        unsubscribe = () => {
            this.eventMap.get(id)?.delete(listener);
        };

        // in renderer, notif main with ipc that we subscribe to this event
        // and return a wrapped "unsubscriber" that will send a PUBSUB_UNSUBSCRIBE_EVENT
        // ipc event to main
        if (!IS_MAIN) {
            const uuid = randomUuid();
            ipcRenderer.send(PUBSUB_SUBSCRIBE_EVENT, id, uuid);
            unsubscribe = () => {
                this.eventMap.get(id)?.delete(listener);
                const done = ipcRenderer.sendSync(
                    PUBSUB_UNSUBSCRIBE_EVENT,
                    uuid
                );
                logger.log("[pubsub] unsubscribe in main !", { done });
            };
            this.unsubscribersInRenderer.set(uuid, unsubscribe);
        }
        return unsubscribe;
    }

    /**
     * Publish an event with the given mandatory event object.
     */
    public publish<TKey extends EventKey>(
        id: TKey,
        event?: EventType<TKey>
    ): void {
        this.eventMap.get(id)?.forEach((listener) => {
            listener(event);
        });
    }

    // TODO: listen subscribe stream (for await)
    // TODO: unsubscribe namespaces (e.g. event.*)
}
