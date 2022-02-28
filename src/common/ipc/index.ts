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

import type { UnknownMapping } from "../utils/type";
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

    handle: <T extends AsyncIpcKeys | UnknownMapping>(
        channel: AsyncIpcChannel<T>,
        listener: (
            event: IpcMainInvokeEvent,
            ...args: GetAsyncIpcConfig<T>["args"]
        ) =>
            | GetAsyncIpcConfig<T>["returnValue"]
            | Promise<GetAsyncIpcConfig<T>["returnValue"]>
    ) => void;
}
interface IpcRenderer extends BaseIpcRenderer {
    sendSync: <T extends SyncIpcKeys | UnknownMapping>(
        channel: SyncIpcChannel<T>,
        ...args: GetSyncIpcConfig<T>["args"]
    ) => GetSyncIpcConfig<T>["returnValue"];

    send: <T extends DualAsyncIpcKeys | UnknownMapping>(
        channel: DualAsyncIpcChannel<T>,
        ...args: GetDualAsyncIpcConfig<T>["args"]
    ) => void;

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
}

export const ipcMain = baseIpcMain as IpcMain;
export const ipcRenderer = baseIpcRenderer as IpcRenderer;
