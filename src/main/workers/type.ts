import type { SimpleObject } from "@common/utils/type";

export interface WorkerCommand<TParam extends SimpleObject = SimpleObject> {
    param: TParam;
}

export interface WorkerQuery<
    TReturn = unknown,
    TParam extends SimpleObject = SimpleObject
> {
    param: TParam;
    returnType: TReturn;
}

export interface WorkerEventListener<TReturn = unknown> {
    returnType: TReturn;
}

export type WorkerCommands = SimpleObject<WorkerCommand>;
export type WorkerQueries = SimpleObject<WorkerQuery>;
export type WorkerEventListeners = SimpleObject<WorkerEventListener>;

export type WorkerCommandsBuilder<T extends WorkerCommands> = T;
export type WorkerQueriesBuilder<T extends WorkerQueries> = T;
export type WorkerEventListenersBuilder<T extends WorkerEventListeners> = T;

export interface WorkerConfig {
    commands?: WorkerCommands;
    data?: unknown;
    eventListeners?: WorkerEventListeners;
    queries?: WorkerQueries;
}

export type WorkerConfigBuilder<T extends WorkerConfig> = T;

export interface Ack {
    ok: true;
}

export interface DefaultWorkerMessageType {
    data: { _requestId: number; type: "command" | "event" | "query" };
    event: string;
}
