import path from "path";

jest.mock(
    "electron",
    () => {
        const mockIpcMain = {
            on: jest.fn().mockReturnThis(),
        };
        return {
            app: {
                getLocale: () => "fr-FR",
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
