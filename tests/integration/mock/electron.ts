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
