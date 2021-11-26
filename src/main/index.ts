import { IS_DEV, IS_E2E } from "@common/config";
import { getIsomorphicModules } from "@common/core/isomorphic";
import { loadModules } from "@common/lib/ModuleManager";
import { containerModule } from "@common/modules/ContainerModule";
import type { Any } from "@common/utils/type";
import { app, BrowserWindow, Menu } from "electron";
import path from "path";
import { URL } from "url";

import { AppModule } from "./modules/AppModule";
import { DevToolsModule } from "./modules/DevToolsModule";
import { MenuModule } from "./modules/MenuModule";
import { PstExtractorModule } from "./modules/PstExtractorModule";
import { consoleToRenderService } from "./services/ConsoleToRendererService";

export type MainWindowRetriever = () => Promise<BrowserWindow>;

// enable hot reload when needed
if (module.hot) {
    module.hot.accept();
}

Menu.setApplicationMenu(null);

/**
 * Stub index.html url for main window. As E2E is not packaged, it needs a direct access to generated file. In dev mode, calling localhost let the dev server handling the file.
 */
const INDEX_URL = new URL(
    IS_E2E || !IS_DEV
        ? `file://${path.join(__dirname, "/../renderer/index.html")}`
        : `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
    // : `file://${path.join(__dirname, "index.html")}/` // Should work but doesn't for some reasons...
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
};

// ----------------------------[EVENTS]----------------------------

// quit application when all windows are closed
app.on("window-all-closed", () => {
    app.quit();
});

const MAIN_WINDOW_CREATED_EVENT = "main-window-created";
const mainWindowRetriever: MainWindowRetriever = async () =>
    mainWindow ??
    new Promise<BrowserWindow>((ok) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Because custom event
        app.on(MAIN_WINDOW_CREATED_EVENT as Any, () => {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- Window is definitly defined at this step
            ok(mainWindow!);
        });
    });

// when electron is ready
app.on("ready", async () => {
    // load shared/common modules
    const isomorphicModules = getIsomorphicModules(
        ["consoleToRenderService", consoleToRenderService],
        ["mainWindowRetriever", mainWindowRetriever]
    );
    // load "main-process" modules
    await loadModules(
        ...isomorphicModules,
        new AppModule(mainWindowRetriever),
        new DevToolsModule(),
        new PstExtractorModule(containerModule.get("userConfigService")),
        new MenuModule(
            consoleToRenderService,
            containerModule.get("pstExtractorMainService")
        )
    );
    // create actual main BrowserWindow
    await createMainWindow();
    app.emit(MAIN_WINDOW_CREATED_EVENT);
});
