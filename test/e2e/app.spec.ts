import type { ElectronApplication, Page } from "@playwright/test";
import { _electron as electron } from "@playwright/test";
import path from "path";

// playwrightTest.use({ headless: true });

jest.setTimeout(50000);
describe("App e2e", () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let electronApp: ElectronApplication, win: Page;
    beforeEach(async () => {
        electronApp = await electron.launch({
            args: [
                "--disable-extensions",
                path.join(__dirname, "../../dist/main/main.js"),
            ],
            env: {
                E2E: "true",
                ELECTRON_ENABLE_LOGGING: "true",
                ELECTRON_ENABLE_STACK_DUMPING: "true",
                NODE_ENV: "test-e2e",
            },
        });
        await electronApp.evaluate(({ app }) => {
            // This runs in the main Electron process, parameter here is always
            // the result of the require('electron') in the main app script.
            return app.getAppPath();
        });

        win = await electronApp.firstWindow();
        await win.waitForLoadState();
    });

    afterEach(async () => {
        await electronApp.close();
    });

    it("should render the application", async () => {
        expect((await win.content()).includes("Hello toto")).toBeTruthy();
        await win.waitForTimeout(3000);
        expect((await win.content()).includes("Hello JEANMI")).toBeTruthy();
    });
});
