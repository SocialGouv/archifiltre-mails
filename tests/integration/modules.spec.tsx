import { loadModules } from "@common/lib/ModuleManager";
import {
    IsomorphicModule,
    IsomorphicModuleFactory,
} from "@common/modules/Module";

jest.mock(
    "electron",
    () => {
        const mockIpcMain = {
            on: jest.fn().mockReturnThis(),
        };
        return { app: { getLocale: () => "fr-FR" }, ipcMain: mockIpcMain };
    },
    {
        virtual: true,
    }
);

describe("Module and loader", () => {
    it("a mocked module should load", async () => {
        const flag = jest.fn().mockResolvedValue(void 0);
        const MockModule = class extends IsomorphicModule {
            async init() {
                await flag();
            }
        };

        const mockModule = IsomorphicModuleFactory.getInstance(MockModule);
        expect(mockModule).toBeDefined();
        await expect(loadModules(mockModule)).resolves.not.toThrow();
        expect(mockModule).toStrictEqual(
            IsomorphicModuleFactory.getInstance(MockModule)
        );
        expect(flag).toBeCalledTimes(1);
    });
});
