import { IS_MAC } from "@common/config";
import type { I18nService } from "@common/modules/I18nModule";
import type { Module } from "@common/modules/Module";
import type { MenuItem } from "electron";
import { Menu } from "electron";

import type { ConsoleToRendererService } from "../services/ConsoleToRendererService";
import { DebugMenu } from "./menu/DebugMenu";
import type { PstExtractorMainService } from "./PstExtractorModule";

/**
 * A small wrapper around electron menu and menu items.
 */
export interface ArchimailMenu {
    /**
     * Retrieve the electron {@link MenuItem} representation
     */
    item: MenuItem;
    /**
     * Id used for searching in whole menu
     */
    readonly id: string;
}

/**
 * Module for the menu bar. Will load various menus each of them containing (or not) submenus.
 */
export class MenuModule implements Module {
    private readonly customMenus: ArchimailMenu[] = [];

    constructor(
        private readonly consoleToRendererService: ConsoleToRendererService,
        private readonly pstExtractorMainService: PstExtractorMainService,
        private readonly i18nService: I18nService
    ) {}

    public async init(): Promise<void> {
        this.customMenus.push(
            new DebugMenu(
                this.consoleToRendererService,
                this.pstExtractorMainService,
                this.i18nService
            )
        );

        const template: Parameters<typeof Menu.buildFromTemplate>[0] = [
            { role: "help", submenu: [{ role: "toggleDevTools" }] }, // TODO: Update with links and other helpful stuff
            ...this.customMenus.map((m) => m.item),
        ];

        if (IS_MAC) {
            template.unshift({ role: "appMenu" });
        }

        const menu = Menu.buildFromTemplate(template);

        Menu.setApplicationMenu(menu);
        return Promise.resolve();
    }
}

// TODO: reload menu
