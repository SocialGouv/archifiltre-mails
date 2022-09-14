import type {
    IpcMain as BaseIpcMain,
    IpcMainInvokeEvent,
    IpcRenderer as BaseIpcRenderer,
    IpcRendererEvent,
} from "electron";
import {
    ipcMain as baseIpcMain,
    ipcRenderer as baseIpcRenderer,
} from "electron";

import type { UnknownMapping } from "../../utils/type";
import type {
    AsyncIpcChannel,
    AsyncIpcKeys,
    CustomIpcMainEvent,
    DualAsyncIpcChannel,
    DualAsyncIpcKeys,
    GetAsyncIpcConfig,
    GetDualAsyncIpcConfig,
    GetRepliedDualAsyncIpcConfig,
    GetSyncIpcConfig,
    ReplyDualAsyncIpcChannel,
    ReplyDualAsyncIpcKeys,
    SyncIpcChannel,
    SyncIpcKeys,
} from "./event";

interface IpcMain extends BaseIpcMain {
    handle: <T extends AsyncIpcKeys | UnknownMapping>(
        channel: AsyncIpcChannel<T>,
        listener: (
            event: IpcMainInvokeEvent,
            ...args: GetAsyncIpcConfig<T>["args"]
        ) =>
            | GetAsyncIpcConfig<T>["returnValue"]
            | Promise<GetAsyncIpcConfig<T>["returnValue"]>
    ) => void;

    on: <T extends DualAsyncIpcKeys | SyncIpcKeys | UnknownMapping>(
        channel: DualAsyncIpcChannel<T> | SyncIpcChannel<T>,
        listener: (
            event: CustomIpcMainEvent<T>,
            ...args: T extends SyncIpcKeys
                ? // @ts-expect-error -- conflict because of pre filled ipc mapping for pubsub
                  GetSyncIpcConfig<T>["args"]
                : GetDualAsyncIpcConfig<T>["args"]
        ) => void
    ) => this;
}
interface IpcRenderer extends BaseIpcRenderer {
    invoke: <T extends AsyncIpcKeys | UnknownMapping>(
        channel: AsyncIpcChannel<T>,
        ...args: GetAsyncIpcConfig<T>["args"]
    ) => Promise<GetAsyncIpcConfig<T>["returnValue"]>;

    on: <T extends ReplyDualAsyncIpcKeys | UnknownMapping>(
        channel: ReplyDualAsyncIpcChannel<T>,
        listener: (
            event: IpcRendererEvent,
            ...args: GetRepliedDualAsyncIpcConfig<T>["args"]
        ) => void
    ) => this;

    removeAllListeners: <
        T extends
            | AsyncIpcKeys
            | DualAsyncIpcKeys
            | ReplyDualAsyncIpcKeys
            | SyncIpcKeys
            | UnknownMapping
    >(
        channel: T
    ) => this;

    send: <T extends DualAsyncIpcKeys | UnknownMapping>(
        channel: DualAsyncIpcChannel<T>,
        ...args: GetDualAsyncIpcConfig<T>["args"]
    ) => void;

    sendSync: <T extends SyncIpcKeys | UnknownMapping>(
        channel: SyncIpcChannel<T>,
        ...args: GetSyncIpcConfig<T>["args"]
    ) => GetSyncIpcConfig<T>["returnValue"];
}

export const ipcMain = baseIpcMain as IpcMain;
export const ipcRenderer = baseIpcRenderer as IpcRenderer;
