import { app, BrowserWindow } from "electron";
import path from "path";
import { URL } from "url";

import { IS_DEV, IS_E2E } from "../common/core/config";
import { IsomorphicModuleFactory } from "../common/core/modules/Module";
import { UserConfigModule } from "../common/core/modules/UserConfigModule";
import { loadModules } from "./lib/ServiceManager";
import { DevToolsModule } from "./modules/DevToolsService";

// enable hot reload when needed
if (module.hot) {
    module.hot.accept();
}

/**
 * Stub index.html url for main window. As E2E is not packaged, it needs a direct access to generated file. In dev mode, calling localhost let the dev server handling the file.
 */
const INDEX_URL = new URL(
    IS_E2E
        ? `file://${path.join(__dirname, "/../renderer/index.html")}`
        : IS_DEV
        ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
        : `file://${path.join(__dirname, "index.html")}/`
).toString();

/**
 * global reference
 * prevent mainWindow from being garbage collected
 */
let mainWindow: BrowserWindow | null = null;

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", async () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (!mainWindow) {
        await createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
    await loadModules(
        IsomorphicModuleFactory.getInstance(UserConfigModule),
        new DevToolsModule()
    );
    await createMainWindow();
});
const createMainWindow = async () => {
    mainWindow = new BrowserWindow({
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        },
    });

    if (IS_DEV) mainWindow.webContents.openDevTools();

    await mainWindow.loadURL(INDEX_URL);

    mainWindow.on("closed", () => {
        mainWindow = null;
    });
};
