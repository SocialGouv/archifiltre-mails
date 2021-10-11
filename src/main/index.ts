import { app, BrowserWindow, session } from "electron";
import fs from "fs";
import path from "path";
import { URL } from "url";

import { IS_DEV, IS_E2E, userConfig } from "../common/core/config";

const REACT_DEVTOOLS_PATH = path.join(
    process.cwd(),
    "scripts",
    "out",
    "react-devtools-extension"
);

// enable hot reload when needed
if (module.hot) {
    module.hot.accept();
}

/**
 * Main application class
 */
class Archimail {
    private mainWindow: BrowserWindow | null = null;

    constructor() {
        // quit application when all windows are closed
        app.on("window-all-closed", () => {
            // on macOS it is common for applications to stay open until the user explicitly quits
            if (process.platform !== "darwin") {
                app.quit();
            }
        });

        app.on("activate", async () => {
            // on macOS it is common to re-create a window even after all windows have been closed
            if (!this.mainWindow) {
                await this.createMainWindow();
            }
        });

        // create main BrowserWindow when electron is ready
        app.on("ready", async () => {
            await userConfig.init();
            await this.createMainWindow();
        });
    }

    public async createMainWindow() {
        const window = new BrowserWindow({
            show: !process.env.HEADLESS,
            webPreferences: {
                contextIsolation: false,
                nodeIntegration: true,
                nodeIntegrationInWorker: true,
            },
        });

        if (IS_DEV) {
            if (fs.existsSync(REACT_DEVTOOLS_PATH))
                await session.defaultSession.loadExtension(
                    REACT_DEVTOOLS_PATH,
                    {
                        allowFileAccess: true,
                    }
                );
            else
                window.once("focus", () => {
                    window.webContents.send(
                        "log",
                        `React devtools not found (${REACT_DEVTOOLS_PATH})`
                    );
                });
            window.webContents.openDevTools();
        }

        let indexUrl = new URL(
            `file://${path.join(__dirname, "index.html")}/`
        ).toString();
        if (IS_E2E) {
            indexUrl = new URL(
                `file://${path.join(__dirname, "/../renderer/index.html")}`
            ).toString();
        } else if (IS_DEV) {
            indexUrl = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;
        }
        await window.loadURL(indexUrl);

        window.on("closed", () => {
            this.mainWindow = null;
        });

        window.webContents.on("devtools-opened", () => {
            window.focus();
            setImmediate(() => {
                window.focus();
            });
        });

        this.mainWindow = window;
    }
}

// global reference to full app
// prevent mainWindow from being garbage collected
// eslint-disable-next-line unused-imports/no-unused-vars
const archimail = new Archimail();
