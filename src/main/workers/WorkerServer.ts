import "@common/utils/overload";

import type {
    EveryFunction,
    StringKeyOf,
    VoidArgsFunction,
} from "@common/utils/type";
import { isMainThread, parentPort, workerData } from "worker_threads";

import type {
    Ack,
    DefaultWorkerMessageType,
    WorkerAppConfig,
    WorkerCommands,
    WorkerConfig,
    WorkerEventListeners,
    WorkerQueries,
} from "./type";

type OnCommandFunction<TCommands extends WorkerCommands> = <
    TCommandName extends StringKeyOf<TCommands>
>(
    ...args: [
        name: TCommandName,
        callback: TCommands[TCommandName]["param"] extends nothing
            ? () => Promise<Ack>
            : (param: TCommands[TCommandName]["param"]) => Promise<Ack>
    ]
) => void;

type OnQueryFunction<TQueries extends WorkerQueries> = <
    TQueryName extends StringKeyOf<TQueries>
>(
    ...args: [
        name: TQueryName,
        callback: TQueries[TQueryName]["param"] extends nothing
            ? () => Promise<TQueries[TQueryName]["returnType"]>
            : (
                  param: TQueries[TQueryName]["param"]
              ) => Promise<TQueries[TQueryName]["returnType"]>
    ]
) => void;

type TriggerFunction<TEventListeners extends WorkerEventListeners> = <
    TEventName extends StringKeyOf<TEventListeners>
>(
    event: TEventName,
    data: TEventListeners[TEventName]["returnType"]
) => void;

export class WorkerServer<TWorkerConfig extends WorkerConfig> {
    private static INSTANCE: WorkerServer<WorkerConfig> | null = null;

    public workerData = workerData as TWorkerConfig["data"] & WorkerAppConfig;

    private readonly callbackPool = new Map<string, EveryFunction>();

    private readonly subscribersPool = new Map<string, VoidArgsFunction[]>();

    private constructor() {
        if (isMainThread) {
            throw new Error("Worker server should not be in main thread.");
        }

        parentPort?.on(
            "message",
            async ({
                event,
                metadata: { _requestId, type },
                data: messageData,
            }: DefaultWorkerMessageType) => {
                if (type === "event") {
                    const list = this.subscribersPool.get(event) ?? [];
                    list.push((eventData) => {
                        parentPort?.postMessage({
                            data: eventData,
                            event,
                            metadata: {
                                _requestId,
                                type,
                            },
                        });
                    });
                    this.subscribersPool.set(event, list);
                } else {
                    const reply = this.callbackPool.get(event);
                    if (!reply) {
                        throw new Error(
                            `No ${type} configured for worker message "${event}".`
                        );
                    }
                    try {
                        parentPort?.postMessage({
                            data: await reply(messageData),
                            event,
                            metadata: {
                                _requestId,
                                type,
                            },
                        });
                    } catch (error: unknown) {
                        // eslint-disable-next-line no-console
                        console.log(`[WorkerServer] Error in ${type}`, {
                            data: error,
                            event: "error",
                            metadata: {
                                _requestId,
                                type,
                            },
                        });
                        // eslint-disable-next-line no-console
                        console.error(error);
                        parentPort?.postMessage({
                            data: error,
                            event: "error",
                            metadata: {
                                _requestId,
                                type,
                            },
                        });
                    }
                }
            }
        );
    }

    /**
     * Get a single server instance per worker.
     */
    public static getInstance<
        TWorkerConfig extends WorkerConfig
    >(): WorkerServer<TWorkerConfig> {
        if (!this.INSTANCE) {
            this.INSTANCE = new WorkerServer();
        }

        return this.INSTANCE as unknown as WorkerServer<TWorkerConfig>;
    }

    public onCommand: OnCommandFunction<
        NonNullable<TWorkerConfig["commands"]>
    > = (name, callback) => {
        this.callbackPool.set(name, callback);
    };

    public onQuery: OnQueryFunction<NonNullable<TWorkerConfig["queries"]>> = (
        name,
        callback
    ) => {
        this.callbackPool.set(name, callback);
    };

    public trigger: TriggerFunction<
        NonNullable<TWorkerConfig["eventListeners"]>
    > = (event, data) => {
        (this.subscribersPool.get(event) ?? []).forEach((subscriber) => {
            subscriber(data);
        });
    };
}
