import { ipcRenderer } from "@common/ipc";
import { notImplemented } from "@common/utils";
import type { Dialog, Shell } from "electron";

/**
 * @see Dialog
 */
export const dialog: Dialog = {
    showCertificateTrustDialog: notImplemented,
    showErrorBox: notImplemented,
    showMessageBox: notImplemented,
    showMessageBoxSync: notImplemented,
    async showOpenDialog(options) {
        return ipcRenderer.invoke("dialog.showOpenDialog", options);
    },
    showOpenDialogSync: notImplemented,
    async showSaveDialog(options) {
        return ipcRenderer.invoke("dialog.showSaveDialog", options);
    },
    showSaveDialogSync: notImplemented,
};

/**
 * @see Shell
 */
export const shell: Shell = {
    beep: notImplemented,
    openExternal: notImplemented,
    async openPath(path) {
        return ipcRenderer.invoke("shell.openPath", path);
    },
    readShortcutLink: notImplemented,
    async showItemInFolder(fullPath) {
        return ipcRenderer.invoke("shell.showItemInFolder", fullPath);
    },
    trashItem: notImplemented,
    writeShortcutLink: notImplemented,
};
