import { CONSOLE_LOG_EVENT } from "@common/constant/event";
import type { Module } from "@common/modules/Module";
import { ipcRenderer } from "electron";

export class ConsoleFromMainModule implements Module {
    public async init(): Promise<void> {
        ipcRenderer.on(CONSOLE_LOG_EVENT, (_event, ...args: unknown[]) => {
            console.log(...args);
        });

        return Promise.resolve();
    }
}
