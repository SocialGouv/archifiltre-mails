import type { AdditionalDatas, PstExtractDatas } from "../pst-extractor/type";

export const WORK_MANAGER_LOAD_EVENT = "workManager.event.load";
export const WORK_MANAGER_SAVE_EVENT = "workManager.event.save";

export interface LoadWorkOptions {
    from: string;
}
export interface SaveWorkOptions {
    additionalDatas?: AdditionalDatas; // TODO or UncachedAdditionalDatas or UncachedDatas = {deletedFolder, toDelete, toKeep, owner, isDowngradedMode} / remove "?"
    dest: string;
}
export type LoadWorkFunction = (
    options: LoadWorkOptions
) => Promise<PstExtractDatas>;
export type SaveWorkFunction = (options: SaveWorkOptions) => pvoid;

declare module "../../lib/ipc/event" {
    interface AsyncIpcMapping {
        [WORK_MANAGER_LOAD_EVENT]: IpcConfigFromFunction<LoadWorkFunction>;
        [WORK_MANAGER_SAVE_EVENT]: IpcConfigFromFunction<SaveWorkFunction>;
    }
}
