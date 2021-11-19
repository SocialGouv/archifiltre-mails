import { IS_DEV, IS_E2E, IS_MAC } from "@common/config";
import { loadIsomorphicModules } from "@common/core/isomorphic";
import { loadModules } from "@common/lib/ModuleManager";
import { containerModule } from "@common/modules/ContainerModule";
import { app, BrowserWindow } from "electron";
import path from "path";
import { URL } from "url";

import { DevToolsModule } from "./modules/DevToolsModule";
import { MenuModule } from "./modules/MenuModule";
import { PstExtractorModule } from "./modules/PstExtractorModule";
import { consoleToRenderService } from "./services/ConsoleToRenderService";

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
 * Global reference.
 *
 * Prevent mainWindow from being garbage collected.
 */
let mainWindow: BrowserWindow | null = null;
/**
 * Create the main {@link BrowserWindow}.
 */
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

// ----------------------------[EVENTS]----------------------------

// quit application when all windows are closed
app.on("window-all-closed", () => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (IS_MAC) {
        app.quit();
    }
});

app.on("activate", async () => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (!mainWindow) {
        await createMainWindow();
    }
});

// when electron is ready
app.on("ready", async () => {
    // load shared/common modules
    await loadIsomorphicModules([
        "consoleToRenderService",
        consoleToRenderService,
    ]);
    // load "main-process" modules
    await loadModules(
        new DevToolsModule(),
        new PstExtractorModule(containerModule.get("userConfigService")),
        new MenuModule(
            consoleToRenderService,
            containerModule.get("pstExtractorMainService")
        )
    );
    // create actual main BrowserWindow
    await createMainWindow();
});
