import type { ElectronApplication, Page } from "@playwright/test";
import { expect, test } from "@playwright/test";

import { closeApp, startApp } from "./utils/test";

test.describe("App e2e", () => {
    let electronApp: ElectronApplication, win: Page;
    test.beforeEach(async () => {
        [electronApp, win] = await startApp();
    });

    test.afterEach(async () => {
        await closeApp(electronApp);
    });

    test("should render the application", async () => {
        expect((await win.content()).includes(`<div id="app">`)).toBeTruthy();
    });
});
