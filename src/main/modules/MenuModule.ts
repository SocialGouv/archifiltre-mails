import { IS_MAC, IS_PACKAGED } from "@common/config";
import type { Service } from "@common/modules/container/type";
import type { FileExporterService } from "@common/modules/FileExporterModule";
import type { I18nService } from "@common/modules/I18nModule";
import type { UserConfigService } from "@common/modules/UserConfigModule";
import type { MenuItem } from "electron";
import { Menu } from "electron";
import { t } from "i18next";

import type { ConsoleToRendererService } from "../services/ConsoleToRendererService";
import { MainModule } from "./MainModule";
import { DebugMenu } from "./menu/DebugMenu";
import type { PstExtractorMainService } from "./PstExtractorModule";

/**
 * A small wrapper around electron menu and menu items.
 */
export interface ArchifiltreMailsMenu {
    /**
     * Enable of disable the menu
     */
    enabled?: boolean;
    /**
     * Id used for searching in whole menu
     */
    readonly id: string;
    /**
     * Retrieve the electron {@link MenuItem} representation
     */
    item: MenuItem;
    /**
     * Show or hide the menu (**when hidden, shortcuts are still active!**)
     */
    visible?: boolean;
}

type ReloadMenuFunction = typeof MenuModule["prototype"]["reloadMenu"];
export interface MenuService extends Service {
    name: "MenuService";
    reloadMenu: ReloadMenuFunction;
}

/**
 * Module for the menu bar. Will load various menus each of them containing (or not) submenus.
 */
export class MenuModule extends MainModule {
    private readonly customMenus: ArchifiltreMailsMenu[] = [];

    private debugMenu?: DebugMenu;

    constructor(
        private readonly consoleToRendererService: ConsoleToRendererService,
        private readonly pstExtractorMainService: PstExtractorMainService,
        private readonly i18nService: I18nService,
        private readonly fileExporterService: FileExporterService,
        private readonly userConfigService: UserConfigService
    ) {
        super();
    }

    public async init(): Promise<void> {
        await this.i18nService.wait();
        await this.userConfigService.wait();
        this.debugMenu = new DebugMenu(
            this.consoleToRendererService,
            this.pstExtractorMainService,
            this.i18nService,
            this.fileExporterService,
            this.userConfigService
        );
        this.customMenus.push(this.debugMenu);
        this.loadMenu();
        this.i18nService.addLanguageChangedListener(() => {
            this.reloadMenu();
        });
    }

    public reloadMenu(): void {
        Menu.setApplicationMenu(null);
        this.loadMenu();
    }

    private loadMenu() {
        const visible = !IS_PACKAGED();
        const template: Parameters<typeof Menu.buildFromTemplate>[0] = [
            { role: "fileMenu", visible },
            { role: "editMenu", visible },
            { role: "viewMenu", visible },
            { role: "windowMenu", visible },
            {
                role: "help",
                submenu: [
                    {
                        checked: this.debugMenu?.visible,
                        click: (item) => {
                            this.debugMenu!.visible = item.checked;
                            this.reloadMenu();
                        },
                        label: t("common:menu.help.enableDebug"),
                        type: "checkbox",
                    },
                    { role: "about" },
                ],
            }, // TODO: Update with links and other helpful stuff
            ...this.customMenus.map((m) => m.item),
        ];

        if (IS_MAC) {
            template.unshift({ role: "appMenu" });
        }

        const menu = Menu.buildFromTemplate(template);

        Menu.setApplicationMenu(menu);
    }

    public get service(): MenuService {
        return {
            name: "MenuService",
            reloadMenu: this.reloadMenu.bind(this),
        };
    }
}
