import electron from "electron";
import path from "path";
import { Application } from "spectron";

jest.setTimeout(50000);
describe("App spectron", () => {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let app: Application;
    beforeEach(async () => {
        app = new Application({
            args: [
                "--no-sandbox",
                "--trace-warnings",
                "--verbose",
                "--enable-logging",
                path.join(__dirname, "../../dist/main/main.js"),
            ],
            env: {
                E2E: "true",
                ELECTRON_ENABLE_LOGGING: true,
                ELECTRON_ENABLE_STACK_DUMPING: true,
            },
            // eslint-disable-next-line @typescript-eslint/no-base-to-string
            path: `${electron}`,
        });

        await app.start();
    });

    afterEach(async () => {
        if (app.isRunning()) {
            return app.stop();
        }
    });

    it("should render the application", async () => {
        const win = await app.client.$("html");
        expect((await win.getText()).includes("Hello toto")).toBeTruthy();
        await app.client.pause(3000);
        expect((await win.getText()).includes("Hello JEANMI")).toBeTruthy();
    });
});
