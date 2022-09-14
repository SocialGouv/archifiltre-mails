/* eslint-disable @typescript-eslint/no-empty-interface */
import type { IpcMainEvent } from "electron";

import type {
    EveryFunction,
    UnboxPromise,
    UnknownMapping,
} from "../../utils/type";

/**
 * Define an IPC config with arguments type and a return values type.
 *
 * Arguments should be considered as a spreadable array of args.
 */
export interface IpcConfig<TArgs extends unknown[], TReturnValue> {
    args: TArgs;
    returnValue: TReturnValue;
}

/**
 * Define an IPC config from arguements and return value of a given function.
 */
export type IpcConfigFromFunction<TFunction extends EveryFunction> =
    TFunction extends (...args: infer TArgs) => infer TReturnValue
        ? IpcConfig<TArgs, UnboxPromise<TReturnValue>>
        : never;

/**
 * Define an asynchronous IPC config (e.g. `ipcRenderer.send()`) with arguments
 * type, return values type, and an channel that will be asynchronously called back with those return values.
 *
 * Arguments and return values should be considered as a spreadable array of args.
 */
export interface DualIpcConfig<
    TReplyChannel extends string,
    TArgs extends unknown[],
    TReturnValues extends unknown[]
> extends IpcConfig<TArgs, TReturnValues> {
    replyKey: TReplyChannel;
}

export type DualIpcConfigExtractReply<T extends DualAsyncIpcKeys> = (
    replyChannel: GetDualAsyncIpcConfig<T>["replyKey"],
    ...args: GetDualAsyncIpcConfig<T>["returnValue"]
) => void;

/**
 * A default IPC config if you only need to declare an IPC channel for autocomplete.
 */
export type DefaultIpcConfig = IpcConfig<unknown[], unknown>;
/**
 * A default asynchronous IPC config if you only need to declare an IPC channel for autocomplete.
 */
export type DefaultDualIpcConfig = DualIpcConfig<"", unknown[], unknown[]>;

/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on sync ipc "on/sendSync" combo.
 *
 * @see IpcConfig
 */
export interface SyncIpcMapping {}
/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on async ipc "handle/invoke" combo.
 *
 * @see IpcConfig
 */
export interface AsyncIpcMapping {}

/**
 * A map of IPC channels associated to their associated config.
 *
 * Those configs have an impact on async ipc "on/send" combo.
 *
 * @see DualIpcConfig
 */
export interface DualAsyncIpcMapping {}

export type SyncIpcKeys = keyof SyncIpcMapping;
export type AsyncIpcKeys = keyof AsyncIpcMapping;
export type DualAsyncIpcKeys = keyof DualAsyncIpcMapping;
export type ReplyDualAsyncIpcKeys = {
    [K in DualAsyncIpcKeys]: DualAsyncIpcMapping[K]["replyKey"];
}[DualAsyncIpcKeys];

export type GetSyncIpcConfig<T extends SyncIpcKeys | UnknownMapping> =
    T extends SyncIpcKeys ? SyncIpcMapping[T] : DefaultIpcConfig;
export type GetAsyncIpcConfig<T extends AsyncIpcKeys | UnknownMapping> =
    T extends AsyncIpcKeys ? AsyncIpcMapping[T] : DefaultIpcConfig;
export type GetDualAsyncIpcConfig<T extends DualAsyncIpcKeys | UnknownMapping> =
    T extends DualAsyncIpcKeys ? DualAsyncIpcMapping[T] : DefaultDualIpcConfig;
export type GetRepliedDualAsyncIpcConfig<T> = T extends ReplyDualAsyncIpcKeys
    ? {
          [K in DualAsyncIpcKeys]: T extends DualAsyncIpcMapping[K]["replyKey"]
              ? IpcConfig<DualAsyncIpcMapping[K]["returnValue"], void>
              : never;
      }[DualAsyncIpcKeys]
    : DefaultIpcConfig;

export type SyncIpcChannel<T extends SyncIpcKeys | UnknownMapping> =
    | SyncIpcKeys
    | T;
export type AsyncIpcChannel<T extends AsyncIpcKeys | UnknownMapping> =
    | AsyncIpcKeys
    | T;
export type DualAsyncIpcChannel<T extends DualAsyncIpcKeys | UnknownMapping> =
    | DualAsyncIpcKeys
    | T;
export type ReplyDualAsyncIpcChannel<
    T extends ReplyDualAsyncIpcKeys | UnknownMapping
> = ReplyDualAsyncIpcKeys | T;

// -- augments
interface CustomSyncIpcMainEvent<T extends SyncIpcKeys | UnknownMapping>
    extends IpcMainEvent {
    /**
     * Sync event comming from `ipcRenderer.sendSync`. Use `ipcRenderer.send` to return a sync value.
     * @deprecated
     */
    reply: never;
    returnValue: GetSyncIpcConfig<T>["returnValue"];
}

interface CustomAsyncIpcMainEvent<T extends DualAsyncIpcKeys | UnknownMapping>
    extends IpcMainEvent {
    reply: (
        replyChannel: GetDualAsyncIpcConfig<T>["replyKey"],
        ...args: GetDualAsyncIpcConfig<T>["returnValue"]
    ) => void;
    /**
     * Async event comming from `ipcRenderer.send`. Use `ipcRenderer.sendSync` to return a sync value.
     * @deprecated
     */
    returnValue: never;
}

export type CustomIpcMainEvent<T> = T extends SyncIpcKeys
    ? CustomSyncIpcMainEvent<T>
    : T extends DualAsyncIpcKeys
    ? CustomAsyncIpcMainEvent<T>
    : IpcMainEvent;
