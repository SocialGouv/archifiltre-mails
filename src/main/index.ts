import { IS_DIST_MODE, IS_E2E, IS_PACKAGED } from "@common/config";
import { getIsomorphicModules } from "@common/lib/core/isomorphic";
import { loadModules, unloadModules } from "@common/lib/ModuleManager";
import { containerModule } from "@common/modules/ContainerModule";
import type { Module } from "@common/modules/Module";
import { setupSentry } from "@common/monitoring/sentry";
import { sleep } from "@common/utils";
import type { Any } from "@common/utils/type";
import { app, BrowserWindow, Menu } from "electron";
import path from "path";

import { AppModule } from "./modules/AppModule";
import { DevToolsModule } from "./modules/DevToolsModule";
import { MenuModule } from "./modules/MenuModule";
import { PstExtractorModule } from "./modules/PstExtractorModule";
import { consoleToRendererService } from "./services/ConsoleToRendererService";

export type MainWindowRetriever = () => Promise<BrowserWindow>;

// enable hot reload when needed
module.hot?.accept();

// get integrations setup callback
const setupSentryIntegrations = setupSentry();

Menu.setApplicationMenu(null);

/**
 * Stub index.html url for main window. As E2E is not packaged, it needs a direct access to generated file. In dev mode, calling localhost let the dev server handling the file.
 */
const INDEX_URL = IS_PACKAGED()
    ? `file://${path.join(__dirname, "index.html")}`
    : IS_E2E || IS_DIST_MODE
    ? `file://${path.join(__dirname, "/../renderer/index.html")}`
    : `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;

const PRELOAD_PATH = IS_PACKAGED()
    ? path.resolve(process.resourcesPath, "preload.js") // prod
    : IS_DIST_MODE
    ? path.resolve(__dirname, "preload.js") // dist / e2e
    : path.resolve(__dirname, "preload.js").replace("/src/", "/dist/"); // dev
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
            defaultEncoding: "UTF-8",
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: PRELOAD_PATH,
            webSecurity: false,
        },
    });

    if (!IS_PACKAGED()) mainWindow.webContents.openDevTools();

    await mainWindow.loadURL(INDEX_URL);
};

// ----------------------------[EVENTS]----------------------------

// quit application when all windows are closed
app.on("window-all-closed", () => {
    app.quit();
});

const MAIN_WINDOW_CREATED_APP_EVENT = "main-window-created";
const mainWindowRetriever: MainWindowRetriever = async () =>
    mainWindow ??
    new Promise<BrowserWindow>((ok) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- Because custom event
        app.on(MAIN_WINDOW_CREATED_APP_EVENT as Any, () => {
            ok(mainWindow!);
        });
    });

// when electron is ready
app.on("ready", async () => {
    // load shared/common modules
    const isomorphicModules = getIsomorphicModules(
        ["consoleToRendererService", consoleToRendererService],
        ["mainWindowRetriever", mainWindowRetriever]
    );
    const trackerService = containerModule.get("trackerService");
    const modules: Module[] = [
        ...isomorphicModules,
        new AppModule(
            mainWindowRetriever,
            consoleToRendererService,
            containerModule.get("i18nService"),
            containerModule.get("userConfigService"),
            trackerService,
            containerModule.get("pubSub")
        ),
        new DevToolsModule(),
        new PstExtractorModule(containerModule.get("userConfigService")),
        new MenuModule(
            consoleToRendererService,
            containerModule.get("pstExtractorMainService"),
            containerModule.get("i18nService"),
            containerModule.get("fileExporterService"),
            containerModule.get("userConfigService")
        ),
    ];

    app.on("will-quit", async (event) => {
        event.preventDefault();
        trackerService.getProvider().track("App Closed", { date: new Date() });
        await sleep(1000);
        await unloadModules(...modules);
        process.exit();
    });
    // load "main-process" modules
    await loadModules(...modules);
    setupSentryIntegrations();
    // create actual main BrowserWindow
    await createMainWindow();
    app.emit(MAIN_WINDOW_CREATED_APP_EVENT);
});
