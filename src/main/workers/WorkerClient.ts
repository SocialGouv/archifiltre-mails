import { WORKER_CONFIG_TOKEN, workerConfig } from "@common/config";
import type {
    Any,
    Nothing,
    SimpleObject,
    StringKeyOf,
    VoidArgsFunction,
} from "@common/utils/type";

import { TSWorker } from "../worker";
import type {
    Ack,
    DefaultWorkerMessageType,
    WorkerAppConfig,
    WorkerCommands,
    WorkerConfig,
    WorkerEventListeners,
    WorkerQueries,
} from "./type";

type CommandFunction<TCommands extends WorkerCommands> = <
    TCommandName extends StringKeyOf<TCommands>
>(
    ...args: TCommands[TCommandName]["param"] extends Nothing
        ? [name: TCommandName]
        : [name: TCommandName, param: TCommands[TCommandName]["param"]]
) => Promise<Ack>;

type QueryFunction<TQueries extends WorkerQueries> = <
    TQueryName extends StringKeyOf<TQueries>
>(
    ...args: TQueries[TQueryName]["param"] extends Nothing
        ? [name: TQueryName]
        : [name: TQueryName, param: TQueries[TQueryName]["param"]]
) => Promise<TQueries[TQueryName]["returnType"]>;

type EventListenerFunction<TEventListeners extends WorkerEventListeners> = <
    TEventName extends StringKeyOf<TEventListeners>
>(
    name: TEventName,
    listener: (
        value: TEventListeners[TEventName]["returnType"]
    ) => Promise<void> | void
) => void;

type WorkerClientArgs<TWorkerConfig extends WorkerConfig> =
    TWorkerConfig["data"] extends infer R
        ? R extends SimpleObject<Any>
            ? [workerPath: string, workerData: R]
            : [workerPath: string]
        : never;

export class WorkerClient<TWorkerConfig extends WorkerConfig> {
    public readonly workerData: TWorkerConfig["data"] & WorkerAppConfig;

    private readonly worker: TSWorker<
        DefaultWorkerMessageType,
        DefaultWorkerMessageType
    >;

    private readonly messageListenerPool = new Map<number, VoidArgsFunction>();

    private readonly eventMessageListenerPool = new Map<
        string,
        VoidArgsFunction[]
    >();

    private readonly workerPath: string;

    private _requestId = 0;

    /**
     * @param workerPath the path
     * @param workerData the data
     */
    public constructor(...args: WorkerClientArgs<TWorkerConfig>) {
        const [workerPath, workerData] = args as unknown as [
            string,
            TWorkerConfig["data"]
        ];
        this.workerPath = workerPath;
        this.workerData = {
            ...(workerData ?? {}),
            [WORKER_CONFIG_TOKEN]: workerConfig,
        };
        this.worker = new TSWorker(workerPath, {
            stderr: true,
            workerData: this.workerData,
        });

        this.worker.on(
            "message",
            ({
                event,
                data: { _requestId: messageReturnId, type, ...messageData },
            }) => {
                if (type === "event") {
                    this.eventMessageListenerPool
                        .get(event)
                        ?.forEach((listener) => {
                            listener(messageData);
                        });
                } else {
                    this.messageListenerPool.get(messageReturnId)?.(
                        messageData
                    );
                    this.messageListenerPool.delete(messageReturnId);
                }
            }
        );

        // TODO: handle errors
        // TODO: handle exit
    }

    public command: CommandFunction<NonNullable<TWorkerConfig["commands"]>> =
        async (name, param = {}) => {
            const _requestId = this._requestId++;
            return new Promise((resolve) => {
                this.messageListenerPool.set(_requestId, () => {
                    resolve({ ok: true });
                });
                this.worker.postMessage({
                    data: {
                        ...param,
                        _requestId,
                        type: "command",
                    },
                    event: name,
                });
            });
        };

    public query: QueryFunction<NonNullable<TWorkerConfig["queries"]>> = async (
        name,
        param = {}
    ) => {
        const _requestId = this._requestId++;
        return new Promise((resolve) => {
            this.messageListenerPool.set(_requestId, resolve);
            this.worker.postMessage({
                data: {
                    ...param,
                    _requestId,
                    type: "query",
                },
                event: name,
            });
        });
    };

    public addEventListener: EventListenerFunction<
        NonNullable<TWorkerConfig["eventListeners"]>
    > = (name, listener) => {
        const listeners = this.eventMessageListenerPool.get(name) ?? [];
        listeners.push(listener);
        this.eventMessageListenerPool.set(name, listeners);
    };

    public async terminate(): Promise<void> {
        await this.worker.terminate();
    }
}

// EXAMPLE
// type TestWorkerClientCommands = WorkerCommandsBuilder<{
//     cmdaze: {
//         param: { tatata: number; tototo: boolean };
//     };
//     maCommande: {
//         param: never;
//     };
// }>;

// type TestWorkerClientQueries = WorkerQueriesBuilder<{
//     queryNoParam: {
//         param: never;
//         returnType: string;
//     };
//     queryParamBool: {
//         param: { bool: boolean };
//         returnType: 4;
//     };
// }>;

// type TestWorkerClientEvents = WorkerEventListenersBuilder<{
//     monEvent: {
//         returnType: number;
//     };
// }>;

// // call client
// const client = new WorkerClient<typeof server>("");
// void client.command("maCommande");
// client.addEventListener("monEvent", (v) => {
//     console.log(v);
// });

// const server = new WorkerServer<
//     never,
//     TestWorkerClientCommands,
//     TestWorkerClientQueries,
//     TestWorkerClientEvents
// >();

// server.onCommand("maCommande", async () => {
//     return Promise.resolve({ ok: true });
// });

// server.onQuery("queryParamBool", async () => {
//     return Promise.resolve(4);
// });
// server.trigger("monEvent", 3);
