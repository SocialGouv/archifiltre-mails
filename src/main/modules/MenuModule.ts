import { IS_DEV } from "@common/config";
import type { Module } from "@common/modules/Module";
import { chunkString } from "@common/utils";
import type { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { dialog, Menu } from "electron";

import type { ExporterType } from "../exporters/Exporter";
import { exporters, exporterType } from "../exporters/Exporter";
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
                            if (!browserWindow) {
                                return;
                            }

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

                            if (pstFilePath) {
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
                    {
                        label: `Export last file...`,
                        submenu: exporterType.map((exportType) => ({
                            click: async (_menuItem, browserWindow, _event) => {
                                if (browserWindow) {
                                    await this.exportLast(
                                        browserWindow,
                                        exportType
                                    );
                                }
                            },
                            label: exportType.toUpperCase(),
                        })),
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
        const [content, tables] = await this.pstExtractorMainService.extract({
            noProgress: true,
            pstFilePath,
        });
        this.consoleToRenderService.log(browserWindow, content);
        this.consoleToRenderService.log(browserWindow, tables);
        this.enableDebugMenu();
    }

    private async exportLast(
        browserWindow: BrowserWindow,
        type: ExporterType
    ): Promise<void> {
        const dialogReturn = await dialog.showSaveDialog(browserWindow, {
            defaultPath: this.lastPstFilePath.replace(/\.pst$/i, `.${type}`),
            filters: [
                { extensions: [type], name: `${type.toUpperCase()} File` },
            ],
            message: "✨",
            nameFieldLabel: "👉",
            showsTagField: false,
            title: `Save ${type.toUpperCase()} export`,
        });
        if (dialogReturn.canceled || !dialogReturn.filePath) {
            return;
        }

        this.disableDebugMenu();
        const [, tables] = await this.pstExtractorMainService.extract({
            noProgress: true,
            pstFilePath: this.lastPstFilePath,
        });

        /* eslint-disable sort-keys-fix/sort-keys-fix */
        /* eslint-disable @typescript-eslint/naming-convention */
        const emails = [...tables.emails.values()].flat(1).map((email) => {
            const contentTexts = chunkString(email.contentText, 32767);
            return {
                "N° identifiant": email.id,
                "Date et heure de la réception": email.receivedDate,
                "Date et heure de l'envoie": email.sentTime,
                "Nom de l'expéditeur": email.from.name,
                "Adresse mail de l'expéditeur": email.from.email ?? "",
                "Noms du ou des destinataire A": email.to
                    .map((to) => to.name)
                    .join(","),
                "Adresses mails du ou des destinataire A": email.to
                    .map((to) => to.email)
                    .join(","),
                "Noms du ou des destinataire CC": email.cc
                    .map((cc) => cc.name)
                    .join(","),
                "Adresses mails du ou des destinataire CC": email.cc
                    .map((cc) => cc.email)
                    .join(","),
                "Noms du ou des destinataire BCC": email.bcc
                    .map((bcc) => bcc.name)
                    .join(","),
                "Adresses mails du ou des destinataire BCC": email.bcc
                    .map((bcc) => bcc.email)
                    .join(","),
                "Objet du mail": email.subject,
                "Nombre de pièces jointes": email.attachementCount,
                "Taille des pièces joints (en octet)": email.attachements
                    .map((attachement) => attachement.filesize)
                    .join(","),
                "Noms pièces jointes": email.attachements
                    .map((attachement) => attachement.filename)
                    .join(","),
                // "Contenu du message": email.contentText,
                ...contentTexts.reduce(
                    (p, c, index) => ({
                        ...p,
                        [`Contenu du message (${index + 1})`]: c,
                    }),
                    {}
                ),
            };
        });
        /* eslint-enable sort-keys-fix/sort-keys-fix */
        /* eslint-enable @typescript-eslint/naming-convention */

        await exporters[type].export(emails, dialogReturn.filePath);
        console.info("MENU EXPORT DONE");
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
