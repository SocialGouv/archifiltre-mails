import { CONSOLE_LOG_EVENT } from "@common/constant/event";
import type { Module } from "@common/modules/Module";
import { ipcRenderer } from "electron";

/**
 * Expose an ipc channel to give a way to properly console log from main into renderer.
 */
export class ConsoleFromMainModule implements Module {
    public async init(): pvoid {
        ipcRenderer.on(CONSOLE_LOG_EVENT, (_event, ...args: unknown[]) => {
            console.log(...args);
        });

        return Promise.resolve();
    }

    public async uninit(): pvoid {
        return Promise.resolve();
    }
}
