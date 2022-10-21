import { IS_PACKAGED } from "@common/config";
import { SupportedLocales } from "@common/i18n/raw";
import { logger } from "@common/logger";
import type {
    ExporterType,
    FileExporterService,
} from "@common/modules/FileExporterModule";
import type { I18nService } from "@common/modules/I18nModule";
import type { UserConfigService } from "@common/modules/UserConfigModule";
import type { BrowserWindow, MenuItemConstructorOptions } from "electron";
import { dialog, MenuItem } from "electron";
import { t } from "i18next";

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
        async () => {
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
                await this.extractAndLogPst(pstFilePath);
                enableMenus(
                    this.id,
                    EXPORT_LAST_PST_MENU_ID,
                    OPEN_AND_CONSOLE_LAST_PST_MENU_ID
                );
            }
        };

    private readonly onClickOpenLogLastPST: MenuItemConstructorOptions["click"] =
        async () => {
            if (this.lastPstFilePath) {
                logger.log(`Open last PST file: ${this.lastPstFilePath}`);
                await this.extractAndLogPst(this.lastPstFilePath);
            }
        };

    private async extractAndLogPst(pstFilePath: string): pvoid {
        const extractDatas = await this.pstExtractorMainService.extract({
            pstFilePath,
        });
        logger.log(extractDatas);
    }

    private async exportLast(
        browserWindow: BrowserWindow,
        type: ExporterType
    ): pvoid {
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
        const _extractDatas = await this.pstExtractorMainService.extract({
            pstFilePath: this.lastPstFilePath,
        });

        // TODO: make it work again
        await this.fileExporterService.export(
            type,
            {},
            // emails,
            dialogReturn.filePath
        );
        logger.info("MENU EXPORT DONE");
    }
}
