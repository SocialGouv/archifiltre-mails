import { IS_PACKAGED } from "@common/config";
import { SupportedLocales } from "@common/i18n/raw";
import type {
    ExporterType,
    FileExporterService,
} from "@common/modules/FileExporterModule";
import type { I18nService } from "@common/modules/I18nModule";
import type { UserConfigService } from "@common/modules/UserConfigModule";
import { formatEmailTable } from "@common/utils/exporter";
import type { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { dialog, MenuItem } from "electron";
import { t } from "i18next";

import type { ConsoleToRendererService } from "../../services/ConsoleToRendererService";
// eslint-disable-next-line unused-imports/no-unused-imports -- MenuModule used in doc
import type { ArchifiltreMailsMenu, MenuModule } from "../MenuModule";
import type { PstExtractorMainService } from "../PstExtractorModule";
import { disableMenus, enableMenus } from "./utils";

const OPEN_AND_CONSOLE_LAST_PST_MENU_ID = "OPEN_AND_CONSOLE_LAST_PST_MENU_ID";
const EXPORT_LAST_PST_MENU_ID = "EXPORT_LAST_PST_MENU_ID";
const CHANGE_LANGUAGE_MENU_ID = "CHANGE_LANGUAGE_MENU_ID";

/**
 * Loaded in {@link MenuModule}, the debug menu is only shown on demand or by default in dev mode.
 */
export class DebugMenu implements ArchifiltreMailsMenu {
    public visible = !IS_PACKAGED();

    public enabled = true;

    public readonly id = "DEBUG_MENU_ID";

    private lastPstFilePath = "";

    constructor(
        private readonly consoleToRendererService: ConsoleToRendererService,
        private readonly pstExtractorMainService: PstExtractorMainService,
        private readonly i18nService: I18nService,
        private readonly fileExporterService: FileExporterService,
        private readonly userConfigService: UserConfigService
    ) {}

    public get item(): MenuItem {
        return new MenuItem({
            enabled: this.enabled,
            id: this.id,
            label: t("common:menu.debug.label"),
            sublabel: t("common:menu.debug.sublabel"),
            submenu: [
                { role: "toggleDevTools" },
                {
                    accelerator: "CommandOrControl+Shift+C",
                    click: () => {
                        this.userConfigService.clear();
                    },
                    label: t("common:menu.debug.resetConfig"),
                },
                {
                    accelerator: "CommandOrControl+Shift+O",
                    click: this.onClickOpenLogPST,
                    label: t("common:menu.debug.openConsolePst"),
                },
                {
                    accelerator: "CommandOrControl+Shift+I",
                    click: this.onClickOpenLogLastPST,
                    enabled: !!this.lastPstFilePath,
                    id: OPEN_AND_CONSOLE_LAST_PST_MENU_ID,
                    label: t("common:menu.debug.openConsolePstLast"),
                },
                {
                    id: EXPORT_LAST_PST_MENU_ID,
                    label: t("common:menu.debug.exportLastFile"),
                    submenu: this.fileExporterService.exporterTypes.map(
                        (exportType) => ({
                            click: async (_menuItem, browserWindow, _event) => {
                                if (browserWindow) {
                                    await this.exportLast(
                                        browserWindow,
                                        exportType
                                    );
                                }
                            },
                            id: `${EXPORT_LAST_PST_MENU_ID}_${exportType.toUpperCase()}`,
                            label: exportType.toUpperCase(),
                        })
                    ),
                },
                {
                    id: CHANGE_LANGUAGE_MENU_ID,
                    label: t("common:menu.debug.changeLanguage"),
                    submenu: SupportedLocales.map((lng) => ({
                        click: async () => this.i18nService.changeLanguage(lng),
                        enabled: true,
                        id: `${CHANGE_LANGUAGE_MENU_ID}_${lng}`,
                        label: t(
                            `common:menu.debug.changeLanguage_${lng.toUpperCase()}`
                        ),
                    })),
                },
            ],
            visible: this.visible,
        });
    }

    private readonly onClickOpenLogPST: MenuItemConstructorOptions["click"] =
        async (_menuItem, browserWindow, _event) => {
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

            if (!dialogReturn.filePaths[0]) {
                return;
            }

            const pstFilePath = (this.lastPstFilePath =
                dialogReturn.filePaths[0]);

            if (pstFilePath) {
                disableMenus(this.id);
                await this.extractAndLogPst(browserWindow, pstFilePath);
                enableMenus(
                    this.id,
                    EXPORT_LAST_PST_MENU_ID,
                    OPEN_AND_CONSOLE_LAST_PST_MENU_ID
                );
            }
        };

    private readonly onClickOpenLogLastPST: MenuItemConstructorOptions["click"] =
        async (_menuItem, browserWindow, _event) => {
            if (this.lastPstFilePath && browserWindow) {
                this.consoleToRendererService.log(
                    browserWindow,
                    `Open last PST file: ${this.lastPstFilePath}`
                );
                await this.extractAndLogPst(
                    browserWindow,
                    this.lastPstFilePath
                );
            }
        };

    private async extractAndLogPst(
        browserWindow: BrowserWindow,
        pstFilePath: string
    ): Promise<void> {
        const [content, tables] = await this.pstExtractorMainService.extract({
            noProgress: true,
            pstFilePath,
        });
        this.consoleToRendererService.log(browserWindow, content);
        this.consoleToRendererService.log(browserWindow, tables);
    }

    private async exportLast(
        browserWindow: BrowserWindow,
        type: ExporterType
    ): Promise<void> {
        const dialogReturn = await dialog.showSaveDialog(browserWindow, {
            defaultPath: this.lastPstFilePath.replace(/\.pst$/i, `.${type}`),
            filters: [
                {
                    extensions: [type],
                    name: t("exporter.save.filterName", { type }),
                },
            ],
            message: t("exporter.save.message"),
            nameFieldLabel: t("exporter.save.nameFieldLabel"),
            showsTagField: false,
            title: t("exporter.save.title", { type }),
        });
        if (dialogReturn.canceled || !dialogReturn.filePath) {
            return;
        }

        disableMenus(this.id);
        const [, tables] = await this.pstExtractorMainService.extract({
            noProgress: true,
            pstFilePath: this.lastPstFilePath,
        });

        const emails = formatEmailTable(tables.emails);
        await this.fileExporterService.export(
            type,
            emails,
            dialogReturn.filePath
        );
        console.info("MENU EXPORT DONE");
    }
}
