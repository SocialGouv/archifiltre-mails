import { CONSOLE_LOG_EVENT } from "@common/constant/event";
import type { Service } from "@common/modules/container/type";
import type { BrowserWindow } from "electron";

export interface ConsoleToRenderService extends Service {
    log: (browserWindow: BrowserWindow, ...args: unknown[]) => void;
}

export const consoleToRenderService: ConsoleToRenderService = {
    log(browserWindow: BrowserWindow, ...args) {
        browserWindow.webContents.send(CONSOLE_LOG_EVENT, ...args);
    },
    name: "ConsoleToRenderService",
};
