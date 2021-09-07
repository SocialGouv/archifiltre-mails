import { app, BrowserWindow, session } from "electron";
import path from "path";
import { format as formatUrl } from "url";

const isDevelopment = process.env.NODE_ENV !== "production";
const REACT_DEVTOOLS_PATH = path.join(
    process.cwd(),
    "scripts",
    "out",
    "react-devtools-extension"
);

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null = null;

if (module.hot) {
    console.log("hot reload MAIN");
    module.hot.accept();
}

async function createMainWindow() {
    const window = new BrowserWindow({
        webPreferences: {
            contextIsolation: false,
            nativeWindowOpen: false,
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
        },
    });

    if (isDevelopment) {
        await session.defaultSession.loadExtension(REACT_DEVTOOLS_PATH, {
            allowFileAccess: true,
        });
        window.webContents.openDevTools();
    }

    await window.loadURL(
        isDevelopment
            ? `http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`
            : formatUrl({
                  pathname: path.join(__dirname, "index.html"),
                  protocol: "file",
                  slashes: true,
              })
    );

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
