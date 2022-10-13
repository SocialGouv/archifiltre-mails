import { ipcRenderer } from "@common/lib/ipc";
import type { Service } from "@common/modules/container/type";
import type {
    LoadWorkFunction,
    SaveWorkFunction,
} from "@common/modules/work-manager/ipc";
import {
    WORK_MANAGER_LOAD_EVENT,
    WORK_MANAGER_SAVE_EVENT,
} from "@common/modules/work-manager/ipc";

export interface WorkManagerService extends Service {
    load: LoadWorkFunction;
    save: SaveWorkFunction;
}

export const workManagerService: WorkManagerService = {
    async load(options) {
        return ipcRenderer.invoke(WORK_MANAGER_LOAD_EVENT, options);
    },

    name: "WorkManagerService",

    async save(options) {
        return ipcRenderer.invoke(WORK_MANAGER_SAVE_EVENT, options);
    },
};
