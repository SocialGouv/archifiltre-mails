import { Menu } from "electron";

const switchEnableMenus = (enable: boolean, ...ids: string[]): void => {
    for (const id of ids) {
        const menu = Menu.getApplicationMenu()?.getMenuItemById(id);
        if (menu) {
            console.log(enable ? "enable" : "disable", id);
            menu.enabled = enable;
        }
    }
};

/**
 * Disable electron menus by ids.
 */
export const disableMenus = (...ids: string[]): void => {
    switchEnableMenus(false, ...ids);
};

/**
 * Enable electron menus by ids.
 */
export const enableMenus = (...ids: string[]): void => {
    switchEnableMenus(true, ...ids);
};
