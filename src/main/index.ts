import { app, BrowserWindow, session } from "electron";
import fs from "fs";
import path from "path";
import { URL } from "url";

const isTest = process.env.NODE_ENV?.startsWith("test");
const isDevelopment = process.env.NODE_ENV !== "production" && !isTest;

const isE2E = !!process.env.E2E;

const REACT_DEVTOOLS_PATH = path.join(
    process.cwd(),
    "scripts",
    "out",
    "react-devtools-extension"
);

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null = null;

if (module.hot) {
    module.hot.accept();
}

async function createMainWindow() {
    console.log("process.env.HEADLESS", process.env.HEADLESS);
    const window = new BrowserWindow({
        show: !process.env.HEADLESS,
        webPreferences: {
            contextIsolation: false,
            nativeWindowOpen: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        },
    });

    if (isDevelopment) {
        if (fs.existsSync(REACT_DEVTOOLS_PATH))
            await session.defaultSession.loadExtension(REACT_DEVTOOLS_PATH, {
                allowFileAccess: true,
            });
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
        // `file://${path.join(__dirname, "/../renderer/index.html")}`
    ).toString();
    if (isE2E) {
        indexUrl = new URL(
            `file://${path.join(__dirname, "/../renderer/index.html")}`
        ).toString();
    } else if (isDevelopment) {
        indexUrl = `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`;
    }
    console.log("===========INDEX URL", indexUrl);
    await window.loadURL(indexUrl);
    window.webContents.send("log-e2e", process.env);
    window.webContents.send("log-e2e", indexUrl);

    window.on("closed", () => {
        mainWindow = null;
    });

    window.webContents.on("devtools-opened", () => {
        window.focus();
        setImmediate(() => {
            window.focus();
        });
    });

    return window;
}

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
        mainWindow = await createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on("ready", async () => {
    mainWindow = await createMainWindow();
});

// (() => {
//     throw new Error(
//         `NODE_ENV=${process.env.NODE_ENV} ; E2E=${process.env.E2E}`
//     );
// })();
