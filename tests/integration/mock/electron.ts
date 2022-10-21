import type { ElectronLog } from "electron-log";
import path from "path";

process.env.NODE_ENV = "test-jest";

jest.mock(
    "electron",
    () => {
        const mockIpcMain = {
            on: jest.fn().mockReturnThis(),
        };
        return {
            app: {
                getLocale: () => "fr-FR",
                getName: () => `archifiltre-mails-test`,
                getPath: (p: string) =>
                    path.resolve(__dirname, `../__app_getPath__/${p}`),
            },
            ipcMain: mockIpcMain,
        };
    },
    {
        virtual: true,
    }
);

jest.mock(
    "electron-log",
    (): Partial<ElectronLog> => {
        return {
            create(_name) {
                // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                return console as Any;
            },
        };
    },
    {
        virtual: true,
    }
);
