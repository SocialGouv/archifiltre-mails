import type { WORKER_CONFIG_TOKEN, workerConfig } from "@common/config";
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
export type WorkerEventListenersBuilder<T extends WorkerEventListeners> = T & {
    error: WorkerEventListener;
};

export interface WorkerConfig {
    commands?: WorkerCommands;
    // eslint-disable-next-line @typescript-eslint/ban-types -- need a wider type
    data?: object;
    eventListeners?: WorkerEventListeners;
    queries?: WorkerQueries;
}

export type WorkerConfigBuilder<T extends WorkerConfig> = T;

export interface Ack {
    ok: true;
}

export interface DefaultWorkerMessageType {
    data?: unknown;
    event: string;
    metadata: { _requestId: number; type: "command" | "event" | "query" };
}

export interface WorkerAppConfig {
    [WORKER_CONFIG_TOKEN]: typeof workerConfig;
}
