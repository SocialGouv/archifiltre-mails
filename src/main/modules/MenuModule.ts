import { IS_DEV } from "@common/config";
import type { Module } from "@common/modules/Module";
import type { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { dialog, Menu } from "electron";

import type { ConsoleToRenderService } from "../services/ConsoleToRenderService";
import type { PstExtractorMainService } from "./PstExtractorModule";

const OPEN_AND_CONSOLE_LAST_PST_MENU_ID = "OPEN_AND_CONSOLE_LAST_PST_MENU_ID";
const DEBUG_MENU_ID = "DEBUG_MENU_ID";

/**
 * Module to load wanted extensions to dev tools.
 */
export class MenuModule implements Module {
    private lastPstFilePath = "";

    constructor(
        private readonly consoleToRenderService: ConsoleToRenderService,
        private readonly pstExtractorMainService: PstExtractorMainService
    ) {}

    async init(): Promise<void> {
        if (IS_DEV) {
            const debugMenu: MenuItemConstructorOptions = {
                enabled: IS_DEV,
                id: DEBUG_MENU_ID,
                label: "Debug",
                sublabel: "Custom debugging",
                submenu: [
                    {
                        accelerator: "CommandOrControl+Shift+O",
                        click: async (_menuItem, browserWindow, _event) => {
                            const dialogReturn = await dialog.showOpenDialog({
                                filters: [
                                    {
                                        extensions: ["pst"],
                                        name: "PST Files",
                                    },
                                ],
                                properties: ["openFile", "showHiddenFiles"],
                            });

                            const pstFilePath = (this.lastPstFilePath =
                                dialogReturn.filePaths[0]);

                            if (pstFilePath && browserWindow) {
                                await this.extractAndLogPst(
                                    browserWindow,
                                    pstFilePath
                                );
                            }

                            const openLastMenu =
                                Menu.getApplicationMenu()?.getMenuItemById(
                                    OPEN_AND_CONSOLE_LAST_PST_MENU_ID
                                );
                            if (openLastMenu) {
                                openLastMenu.enabled = true;
                            }
                        },
                        label: "Open and console log PST file...",
                    },
                    {
                        accelerator: "CommandOrControl+Shift+I",
                        click: async (_menuItem, browserWindow, _event) => {
                            if (this.lastPstFilePath && browserWindow) {
                                this.consoleToRenderService.log(
                                    browserWindow,
                                    `Open last PST file: ${this.lastPstFilePath}`
                                );
                                await this.extractAndLogPst(
                                    browserWindow,
                                    this.lastPstFilePath
                                );
                            }
                        },
                        enabled: false,
                        id: OPEN_AND_CONSOLE_LAST_PST_MENU_ID,
                        label: `Open and console log last PST file (none)`,
                    },
                ],
                visible: IS_DEV,
            };

            const template: MenuItemConstructorOptions[] = [
                { role: "appMenu" },
                { role: "fileMenu" },
                { role: "editMenu" },
                { role: "viewMenu" },
                { role: "windowMenu" },
                { role: "help" },
            ];
            const menu = Menu.buildFromTemplate([...template, debugMenu]);

            Menu.setApplicationMenu(menu);
            return Promise.resolve();
        }
    }

    private async extractAndLogPst(
        browserWindow: BrowserWindow,
        pstFilePath: string
    ): Promise<void> {
        this.disableDebugMenu();
        const content = await this.pstExtractorMainService.extract({
            noProgress: true,
            pstFilePath,
        });
        this.consoleToRenderService.log(browserWindow, content);
        this.enableDebugMenu();
    }

    private disableDebugMenu() {
        const debugMenu =
            Menu.getApplicationMenu()?.getMenuItemById(DEBUG_MENU_ID);
        if (debugMenu) {
            debugMenu.enabled = false;
        }
    }

    private enableDebugMenu() {
        const debugMenu =
            Menu.getApplicationMenu()?.getMenuItemById(DEBUG_MENU_ID);
        if (debugMenu) {
            debugMenu.enabled = true;
        }
    }

    private toggleDebugMenu() {
        const debugMenu =
            Menu.getApplicationMenu()?.getMenuItemById(DEBUG_MENU_ID);
        if (debugMenu) {
            debugMenu.enabled = !debugMenu.enabled;
        }
    }
}
