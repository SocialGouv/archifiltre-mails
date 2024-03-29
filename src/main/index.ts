import "@common/utils/overload";
import "./electron-env";

import { IS_DIST_MODE, IS_E2E, IS_PACKAGED } from "@common/config";
import { getIsomorphicModules } from "@common/lib/core/isomorphic";
import { AppError } from "@common/lib/error/AppError";
import { loadModules, unloadModules } from "@common/lib/ModuleManager";
import { logger } from "@common/logger";
import { containerModule } from "@common/modules/ContainerModule";
import type { Module } from "@common/modules/Module";
import { setupSentry } from "@common/monitoring/sentry";
import { sleep } from "@common/utils";
import Sentry from "@sentry/electron";
import { app, BrowserWindow, Menu } from "electron";
import path from "path";

import { AppModule } from "./modules/AppModule";
import { CacheModule } from "./modules/CacheModule";
import { DevToolsModule } from "./modules/DevToolsModule";
import { MenuModule } from "./modules/MenuModule";
import { PstExporterModule } from "./modules/PstExporterModule";
import { PstExtractorModule } from "./modules/PstExtractorModule";
import { WorkManagerModule } from "./modules/WorkManagerModule";
// import { consoleToRendererService } from "./services/ConsoleToRendererService";

export type MainWindowRetriever = () => Promise<BrowserWindow>;

// enable hot reload when needed
module.hot?.accept();

// get integrations setup callback
const setupSentryIntegrations = setupSentry();

Menu.setApplicationMenu(null);
if (!IS_PACKAGED()) {
    app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
}

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
    : path
          .resolve(__dirname, "preload.js")
          .replace(`${path.sep}src${path.sep}`, `${path.sep}dist${path.sep}`); // dev

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
        show: false,
        webPreferences: {
            contextIsolation: false,
            defaultEncoding: "UTF-8",
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            preload: PRELOAD_PATH,
            webSecurity: false,
        },
    });

    mainWindow.once("ready-to-show", () => {
        mainWindow?.show();
    });

    if (!IS_PACKAGED() && !IS_E2E) mainWindow.webContents.openDevTools();

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
    try {
        // load shared/common modules
        const isomorphicModules = getIsomorphicModules([
            "mainWindowRetriever",
            mainWindowRetriever,
        ]);
        const trackerService = containerModule.get("trackerService");
        const modules: Module[] = [
            ...isomorphicModules,
            new AppModule(
                mainWindowRetriever,
                containerModule.get("i18nService"),
                containerModule.get("userConfigService"),
                trackerService
            ),
            new DevToolsModule(),
            new CacheModule(),
            new PstExtractorModule(
                containerModule.get("userConfigService"),
                containerModule.get("pstCacheMainService")
            ),
            new WorkManagerModule(
                containerModule.get("fileExporterService"),
                containerModule.get("i18nService"),
                containerModule.get("pstCacheMainService"),
                containerModule.get("pstExtractorMainService")
            ),
            new MenuModule(
                containerModule.get("pstExtractorMainService"),
                containerModule.get("i18nService"),
                containerModule.get("fileExporterService"),
                containerModule.get("userConfigService")
            ),
            new PstExporterModule(
                containerModule.get("fileExporterService"),
                containerModule.get("pstExtractorMainService"),
                containerModule.get("i18nService"),
                containerModule.get("pstCacheMainService")
            ),
        ];

        app.on("will-quit", async (event) => {
            event.preventDefault();
            trackerService
                .getProvider()
                .track("App Closed", { date: new Date() });
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
    } catch (error: unknown) {
        if (error instanceof AppError) {
            logger.error("Error during app lauching");
            if (IS_PACKAGED())
                Sentry.addBreadcrumb({
                    data: {
                        previousErrors: error.appErrorList(),
                        stack: error.appErrorStack(),
                    },
                    type: "info",
                });
            else logger.error(error.appErrorStack());
        }
        throw error;
    }
});
