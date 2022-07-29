import type { AnyFunction, SimpleObject } from "@common/utils/type";
import { parentPort } from "worker_threads";

import { TSWorker } from "./worker";

interface WorkerCommand<TParam extends unknown[] = unknown[]> {
    param: TParam;
}

interface WorkerQuery<TReturn = unknown, TParam extends unknown[] = unknown[]> {
    param: TParam;
    returnType: TReturn;
}

interface WorkerEvent<TReturn = unknown> {
    returnType: TReturn;
}

type WorkerCommands = Record<string, WorkerCommand>;
type WorkerQueries = Record<string, WorkerQuery>;
type WorkerEvents = Record<string, WorkerEvent>;

type WorkerCommandsBuilder<T extends WorkerCommands> = T;
type WorkerQueriesBuilder<T extends WorkerQueries> = T;
type WorkerEventsBuilder<T extends WorkerEvents> = T;

type CommandFunction<TCommands extends WorkerCommands> = <
    TCommandName extends keyof TCommands
>(
    name: TCommandName,
    ...param: TCommands[TCommandName]["param"]
) => Promise<void>;

type QueryFunction<TQueries extends WorkerQueries> = <
    TQueryName extends keyof TQueries
>(
    name: TQueryName,
    ...param: TQueries[TQueryName]["param"]
) => Promise<TQueries[TQueryName]["returnType"]>;

type EventFunction<TEvents extends WorkerEvents> = <
    TEventName extends keyof TEvents
>(
    name: TEventName,
    listener: (value: TEvents[TEventName]["returnType"]) => Promise<void> | void
) => void;

type MethodsName<T> = {
    [M in keyof T]: T[M] extends AnyFunction ? M : never;
}[keyof T];

export abstract class WorkerClient<
    TData extends SimpleObject,
    TCommands extends WorkerCommands,
    TQueries extends WorkerQueries = never,
    TEvents extends WorkerEvents = never
> {
    private readonly worker!: TSWorker;

    public abstract command: CommandFunction<TCommands>;

    public abstract query: QueryFunction<TQueries>;

    public abstract addEventListener?: EventFunction<TEvents>;

    public constructor(
        protected workerPath: string,
        protected workerData: TData = {} as TData
    ) {
        if (this.isWorker()) {
            // in worker
            this.init();
        } else {
            this.worker = new TSWorker(workerPath, {
                stderr: true,
                workerData,
            });
        }
    }

    protected ensureIsWorker(): asserts this {
        if (!this.isWorker()) {
            throw new Error("Not in worker");
        }
    }

    protected isWorker(): boolean {
        return !!parentPort;
    }

    protected abstract init(): Record<string, MethodsName<this>>;
}

type TestWorkerClientCommands = WorkerCommandsBuilder<{
    cmdaze: {
        param: [tototo: boolean];
    };
    maCommande: {
        param: [];
    };
}>;

type TestWorkerClientQueries = WorkerQueriesBuilder<{
    maQ: {
        param: [];
        returnType: string;
    };
}>;

class TestWC extends WorkerClient<
    never,
    TestWorkerClientCommands,
    TestWorkerClientQueries
> {
    public addEventListener?: EventFunction<never>;

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

    protected init(): Record<string, MethodsName<this>> {
        const binding: [string, MethodsName<this>] = ["", ""];
    }
}

void new TestWC("").query("maQ");
