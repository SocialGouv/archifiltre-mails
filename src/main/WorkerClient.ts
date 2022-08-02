import type { Nothing, SimpleObject } from "@common/utils/type";
import { parentPort } from "worker_threads";

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

type WorkerCommands = Record<string, WorkerCommand>;
type WorkerQueries = Record<string, WorkerQuery>;
type WorkerEventListeners = Record<string, WorkerEventListener>;

type WorkerCommandsBuilder<T extends WorkerCommands> = T;
type WorkerQueriesBuilder<T extends WorkerQueries> = T;
type WorkerEventListenersBuilder<T extends WorkerEventListeners> = T;

type CommandFunction<TCommands extends WorkerCommands> = <
    TCommandName extends keyof TCommands
>(
    ...args: TCommands[TCommandName]["param"] extends Nothing
        ? [name: TCommandName]
        : [name: TCommandName, param: TCommands[TCommandName]["param"]]
) => Promise<void>;

type QueryFunction<TQueries extends WorkerQueries> = <
    TQueryName extends keyof TQueries
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
    TInputEvent extends keyof TCommands | keyof TQueries =
        | keyof TCommands
        | keyof TQueries
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
    TOutputEvent extends keyof TEventListeners | keyof TQueries =
        | keyof TEventListeners
        | keyof TQueries
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

export abstract class WorkerClient<
    TData extends SimpleObject,
    TCommands extends WorkerCommands,
    TQueries extends WorkerQueries = never,
    TEvents extends WorkerEventListeners = never
> {
    protected readonly worker!: TSWorker;

    public abstract command: CommandFunction<TCommands>;

    public abstract query: QueryFunction<TQueries>;

    public abstract addEventListener?: EventListenerFunction<TEvents>;

    public constructor(
        protected workerPath: string,
        protected workerData: TData = {} as TData
    ) {
        if (WorkerClient.isWorker()) {
            // in worker
            this.init();
        } else {
            this.worker = new TSWorker(workerPath, {
                stderr: true,
                workerData,
            });
        }
    }

    protected static isWorker(): boolean {
        return !!parentPort;
    }

    public postMessageWorker<
        TInputEvent extends keyof TCommands | keyof TQueries
    >(...args: PostMessageWorkerArgs<TCommands, TQueries, TInputEvent>): void {
        if (!WorkerClient.isWorker()) {
            this.worker.postMessage({
                data: args[1],
                event: args[0],
            });
        }
    }

    public postMessageParent<
        TInputEvent extends keyof TCommands | keyof TQueries
    >(...args: PostMessageWorkerArgs<TCommands, TQueries, TInputEvent>): void {
        if (WorkerClient.isWorker()) {
            parentPort!.postMessage({
                data: args[1],
                event: args[0],
            });
        }
    }

    protected init() {}
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
    maQ: {
        param: never;
        returnType: string;
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
    TestWorkerClientQueries
> {
    public addEventListener?: EventListenerFunction<never>;

    public command: CommandFunction<TestWorkerClientCommands> = async (
        name,
        ...param
    ) => {
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

    protected init() {
        this.postMessageWorker("maQ");
    }
}

// call client
const client = new TestWC("");
void client.command("maCmmande");
