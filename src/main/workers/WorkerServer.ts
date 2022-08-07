import type {
    EveryFunction,
    Nothing,
    StringKeyOf,
    VoidArgsFunction,
} from "@common/utils/type";
import { isMainThread, parentPort, workerData } from "worker_threads";

import type {
    Ack,
    DefaultWorkerMessageType,
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
        callback: TCommands[TCommandName]["param"] extends Nothing
            ? () => Promise<Ack>
            : (param: TCommands[TCommandName]["param"]) => Promise<Ack>
    ]
) => void;

type OnQueryFunction<TQueries extends WorkerQueries> = <
    TQueryName extends StringKeyOf<TQueries>
>(
    ...args: [
        name: TQueryName,
        callback: TQueries[TQueryName]["param"] extends Nothing
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

export class WorkerServer<
    // TData = Any,
    // TCommands extends WorkerCommands = WorkerCommands,
    // TQueries extends WorkerQueries = WorkerQueries,
    // TEventListeners extends WorkerEventListeners = WorkerEventListeners
    TWorkerConfig extends WorkerConfig
    // TCommands extends WorkerCommands = TWorkerConfig["commands"] extends WorkerCommands
    //     ? TWorkerConfig["commands"]
    //     : WorkerCommands,
    // TQueries extends WorkerQueries = TWorkerConfig["queries"] extends WorkerQueries
    //     ? TWorkerConfig["queries"]
    //     : WorkerQueries,
    // TEventListeners extends WorkerEventListeners = TWorkerConfig["eventListeners"] extends WorkerEventListeners
    //     ? TWorkerConfig["eventListeners"]
    //     : WorkerEventListeners
> {
    public workerData = workerData as TWorkerConfig["data"];

    private readonly callbackPool = new Map<string, EveryFunction>();

    private readonly subscribersPool = new Map<string, VoidArgsFunction[]>();

    constructor() {
        if (isMainThread) {
            throw new Error("Worker server should not be in main thread.");
        }

        parentPort?.on(
            "message",
            async ({
                event,
                data: { _requestId, type, ...messageData },
            }: DefaultWorkerMessageType) => {
                if (type === "event") {
                    const list = this.subscribersPool.get(event) ?? [];
                    list.push((eventData) => {
                        parentPort?.postMessage({
                            data: {
                                ...eventData,
                                _requestId,
                                type,
                            },
                            event,
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
                    parentPort?.postMessage({
                        data: {
                            ...(await reply(messageData)),
                            _requestId,
                            type,
                        },
                        event,
                    });
                }
            }
        );
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
