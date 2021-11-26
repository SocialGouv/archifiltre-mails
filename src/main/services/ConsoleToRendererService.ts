import { CONSOLE_LOG_EVENT } from "@common/constant/event";
import type { Service } from "@common/modules/container/type";
import type { BrowserWindow } from "electron";

export interface ConsoleToRendererService extends Service {
    /**
     * Log in the renderer process via the given browser window
     */
    log: (browserWindow: BrowserWindow, ...args: unknown[]) => void;
}

/**
 * Simple back service that send console.log's to renderer.
 */
export const consoleToRenderService: ConsoleToRendererService = {
    log(browserWindow: BrowserWindow, ...args) {
        browserWindow.webContents.send(CONSOLE_LOG_EVENT, ...args);
    },
    name: "ConsoleToRenderService",
};
