import type {
    Nothing,
    SimpleObject,
    StringKeyOf,
    VoidArgsFunction,
} from "@common/utils/type";
import { isMainThread, parentPort } from "worker_threads";

import { TSWorker } from "./worker";

interface WorkerCommand<TParam extends SimpleObject = SimpleObject> {
    param: TParam;
}

interface WorkerQuery<
    TReturn = unknown,
    TParam extends SimpleObject = SimpleObject
> {
    param: TParam;
    returnType: TReturn;
}

interface WorkerEventListener<TReturn = unknown> {
    returnType: TReturn;
}

type WorkerCommands = SimpleObject<WorkerCommand>;
type WorkerQueries = SimpleObject<WorkerQuery>;
type WorkerEventListeners = SimpleObject<WorkerEventListener>;

type WorkerCommandsBuilder<T extends WorkerCommands> = T;
type WorkerQueriesBuilder<T extends WorkerQueries> = T;
type WorkerEventListenersBuilder<T extends WorkerEventListeners> = T;

type CommandFunction<TCommands extends WorkerCommands> = <
    TCommandName extends StringKeyOf<TCommands>
>(
    ...args: TCommands[TCommandName]["param"] extends Nothing
        ? [name: TCommandName]
        : [name: TCommandName, param: TCommands[TCommandName]["param"]]
) => Promise<void>;

type QueryFunction<TQueries extends WorkerQueries> = <
    TQueryName extends StringKeyOf<TQueries>
>(
    ...args: TQueries[TQueryName]["param"] extends Nothing
        ? [name: TQueryName]
        : [name: TQueryName, param: TQueries[TQueryName]["param"]]
) => Promise<TQueries[TQueryName]["returnType"]>;

type EventListenerFunction<TEvents extends WorkerEventListeners> = <
    TEventName extends keyof TEvents
>(
    name: TEventName,
    listener: (value: TEvents[TEventName]["returnType"]) => Promise<void> | void
) => void;

export type PostMessageWorkerArgs<
    TCommands extends WorkerCommands,
    TQueries extends WorkerQueries,
    TInputEvent extends StringKeyOf<TCommands | TQueries> = StringKeyOf<
        TCommands | TQueries
    >
> = TInputEvent extends keyof TCommands
    ? TCommands[TInputEvent]["param"] extends Nothing
        ? [event: TInputEvent]
        : [event: TInputEvent, data: TCommands[TInputEvent]["param"]]
    : TInputEvent extends keyof TQueries
    ? TQueries[TInputEvent]["param"] extends Nothing
        ? [event: TInputEvent]
        : [event: TInputEvent, data: TQueries[TInputEvent]["param"]]
    : [event: TInputEvent];

export type PostMessageParentArgs<
    TEventListeners extends WorkerEventListeners,
    TQueries extends WorkerQueries,
    TOutputEvent extends StringKeyOf<TEventListeners | TQueries> = StringKeyOf<
        TEventListeners | TQueries
    >
> = TOutputEvent extends keyof TEventListeners
    ? TEventListeners[TOutputEvent]["returnType"] extends Nothing
        ? [event: TOutputEvent]
        : [
              event: TOutputEvent,
              data: TEventListeners[TOutputEvent]["returnType"]
          ]
    : TOutputEvent extends keyof TQueries
    ? TQueries[TOutputEvent]["returnType"] extends Nothing
        ? [event: TOutputEvent]
        : [event: TOutputEvent, data: TQueries[TOutputEvent]["returnType"]]
    : [event: TOutputEvent];

type OnWorkerMessageArgs<
    TEventListeners extends WorkerEventListeners,
    TQueries extends WorkerQueries,
    TOutputEvent extends StringKeyOf<TEventListeners | TQueries> = StringKeyOf<
        TEventListeners | TQueries
    >
> = TOutputEvent extends keyof TEventListeners
    ? [
          event: TOutputEvent,
          listener: TEventListeners[TOutputEvent]["returnType"] extends Nothing
              ? () => void
              : (value: TEventListeners[TOutputEvent]["returnType"]) => void
      ]
    : TOutputEvent extends keyof TQueries
    ? [
          event: TOutputEvent,
          listener: TQueries[TOutputEvent]["returnType"] extends Nothing
              ? () => void
              : (value: TQueries[TOutputEvent]["returnType"]) => void
      ]
    : [event: TOutputEvent, listener: (value?: unknown) => void];

type OnParentMessageArgs<
    TCommands extends WorkerCommands,
    TQueries extends WorkerQueries,
    TInputEvent extends StringKeyOf<TCommands> | StringKeyOf<TQueries> =
        | StringKeyOf<TCommands>
        | StringKeyOf<TQueries>
> = TInputEvent extends keyof TCommands
    ? [
          event: TInputEvent,
          listener: TCommands[TInputEvent]["param"] extends Nothing
              ? () => void
              : (value: TCommands[TInputEvent]["param"]) => void
      ]
    : TInputEvent extends keyof TQueries
    ? [
          event: TInputEvent,
          listener: TQueries[TInputEvent]["param"] extends Nothing
              ? () => void
              : (value: TQueries[TInputEvent]["param"]) => void
      ]
    : [event: TInputEvent, listener: (value?: unknown) => void];

interface DefaultWorkerMessageType {
    data: unknown;
    event: string;
}

export abstract class WorkerClient<
    TData extends SimpleObject,
    TCommands extends WorkerCommands,
    TQueries extends WorkerQueries = never,
    TEventListeners extends WorkerEventListeners = never
> {
    protected readonly worker!: TSWorker<
        DefaultWorkerMessageType,
        DefaultWorkerMessageType
    >;

    private readonly parentMessageListenerPool = new Map<
        string,
        VoidArgsFunction[]
    >();

    private readonly workerMessageListenerPool = new Map<
        string,
        VoidArgsFunction[]
    >();

    public abstract command: CommandFunction<TCommands>;

    public abstract query: QueryFunction<TQueries>;

    public abstract addEventListener?: EventListenerFunction<TEventListeners>;

    public constructor(
        protected workerPath: string,
        protected workerData: TData = {} as TData
    ) {
        if (WorkerClient.isWorker()) {
            parentPort?.on(
                "message",
                ({ event, data }: DefaultWorkerMessageType) => {
                    this.workerMessageListenerPool
                        .get(event)
                        ?.forEach((listener) => {
                            listener(data);
                        });
                }
            );
        } else {
            this.worker = new TSWorker(workerPath, {
                stderr: true,
                workerData,
            });

            this.worker.on("message", ({ event, data }) => {
                this.parentMessageListenerPool
                    .get(event)
                    ?.forEach((listener) => {
                        listener(data);
                    });
            });
        }
    }

    protected static isWorker(): boolean {
        return !isMainThread;
    }

    public async terminate(): Promise<void> {
        if (WorkerClient.isWorker()) {
            process.exit();
        }
        await this.worker.terminate();
    }

    protected postMessageWorker<
        TInputEvent extends StringKeyOf<TCommands | TQueries>
    >(
        ...[event, data]: PostMessageWorkerArgs<
            TCommands,
            TQueries,
            TInputEvent
        >
    ): void {
        if (!WorkerClient.isWorker()) {
            this.worker.postMessage({
                data,
                event,
            });
        }
    }

    protected postMessageParent<
        TOutputEvent extends StringKeyOf<TEventListeners | TQueries>
    >(
        ...[event, data]: PostMessageParentArgs<
            TEventListeners,
            TQueries,
            TOutputEvent
        >
    ): void {
        if (WorkerClient.isWorker()) {
            parentPort!.postMessage({
                data,
                event,
            });
        }
    }

    protected onWorkerMessage<
        TOutputEvent extends StringKeyOf<TEventListeners | TQueries>
    >(
        ...[event, listener]: OnWorkerMessageArgs<
            TEventListeners,
            TQueries,
            TOutputEvent
        >
    ): this {
        if (!WorkerClient.isWorker()) {
            const listeners = this.parentMessageListenerPool.get(event) ?? [];
            listeners.push(listener);
            this.parentMessageListenerPool.set(event, listeners);
        }

        return this;
    }

    protected onParentMessage<
        TInputEvent extends StringKeyOf<TCommands | TQueries>
    >(
        ...[event, listener]: OnParentMessageArgs<
            TCommands,
            TQueries,
            TInputEvent
        >
    ): this {
        if (WorkerClient.isWorker()) {
            const listeners = this.workerMessageListenerPool.get(event) ?? [];
            listeners.push(listener);
            this.workerMessageListenerPool.set(event, listeners);
        }
        return this;
    }
}

type TestWorkerClientCommands = WorkerCommandsBuilder<{
    cmdaze: {
        param: { tatata: number; tototo: boolean };
    };
    maCommande: {
        param: never;
    };
}>;

type TestWorkerClientQueries = WorkerQueriesBuilder<{
    queryNoParam: {
        param: never;
        returnType: string;
    };
    queryParamBool: {
        param: { bool: boolean };
        returnType: 4;
    };
}>;

type TestWorkerClientEvents = WorkerEventListenersBuilder<{
    monEvent: {
        returnType: number;
    };
}>;

class TestWC extends WorkerClient<
    never,
    TestWorkerClientCommands,
    TestWorkerClientQueries,
    TestWorkerClientEvents
> {
    public addEventListener?: EventListenerFunction<TestWorkerClientEvents>;

    public command: CommandFunction<TestWorkerClientCommands> = async (
        name,
        ...param
    ) => {
        if (!WorkerClient.isWorker()) {
            this.postMessageWorker(name);
        }
        await Promise.resolve();
        throw new Error("Method not implemented.");
    };

    public query: QueryFunction<TestWorkerClientQueries> = async (
        name,
        ...param
    ) => {
        await Promise.resolve();
        throw new Error("Method not implemented.");
    };
}

// call client
const client = new TestWC("");
void client.command("maCommande");
client.addEventListener?.("moEvent");
