import type { ElectronApplication, Locator, Page } from "@playwright/test";
import { _electron as electron } from "@playwright/test";
import path from "path";

let electronApp: ElectronApplication, win: Page;
/**
 * Starts the electron application
 */
export const startApp = async (): Promise<
    [app: ElectronApplication, win: Page]
> => {
    const main = path.resolve(
        __dirname,
        "..",
        "..",
        "..",
        "dist",
        "main",
        "main.js"
    );
    electronApp = await electron.launch({
        args: [main],
        env: {
            DISPLAY: ":0",
            E2E: "true",
            NODE_ENV: "test-e2e",
        },
        timeout: 120000,
    });
    await electronApp.evaluate(({ app }) => {
        return app.getAppPath();
    });

    win = await electronApp.firstWindow();
    // eslint-disable-next-line no-console
    win.on("console", console.log);
    await win.waitForLoadState();

    return [electronApp, win];
};

export const closeApp = async (app = electronApp): pvoid => {
    await app.close();
};

/**
 * Wait for the given time. (like sleep)
 */
export const wait = async (time: number): pvoid =>
    new Promise((resolve) => setTimeout(resolve, time));

/**
 * Types the text as keyboard input. Handles unicode characters for non text keys.
 */
export const typeText = async (text: string, w = win): pvoid => {
    const letters = text.split("");
    for (const letter of letters) {
        await w.keyboard.type(letter);
    }
};

/**
 * Clicks over the element locator
 */
export const clickOverElement = async (locator: Locator, w = win): pvoid => {
    const box = await locator.boundingBox();
    if (!box) {
        return;
    }
    const { x, y } = box;
    await w.mouse.click(x, y);
};
