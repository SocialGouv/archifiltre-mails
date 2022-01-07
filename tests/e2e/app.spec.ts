import type { ElectronApplication, Page } from "@playwright/test";
import { _electron as electron, expect, test } from "@playwright/test";
import path from "path";

test.describe("App e2e", () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let electronApp: ElectronApplication, win: Page;
    test.beforeEach(async () => {
        const main = path.resolve(
            __dirname,
            "..",
            "..",
            "dist",
            "main",
            "main.js"
        );
        electronApp = await electron.launch({
            args: [
                // "--disable_splash_screen",
                // "--disable-extensions",
                // "--disable-dev-shm-usage",
                // "--no-sandbox",
                // "--disable-gpu",
                // "--headless",
                // "--disable-software-rasterizer",
                // "--disable-setuid-sandbox",
                main,
            ],
            env: {
                DISPLAY: ":0", //TODO: input as env var
                E2E: "true",
                NODE_ENV: "test-e2e",
            },
            timeout: 120000,
        });
        await electronApp.evaluate(({ app }) => {
            return app.getAppPath();
        });

        win = await electronApp.firstWindow();
        win.on("console", console.log);
        await win.waitForLoadState();
    });

    test.afterEach(async () => {
        await electronApp.close();
    });

    test("should render the application", async () => {
        expect((await win.content()).includes("#app")).toBeTruthy();
    });
});
