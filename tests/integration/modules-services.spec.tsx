import { loadModules } from "@common/lib/ModuleManager";
import {
    containerModule,
    IsomorphicService,
} from "@common/modules/ContainerModule";
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
    it("should load a mocked module", async () => {
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

describe("Service", () => {
    it("should load and unload a service", async () => {
        const flagLoad = jest.fn().mockResolvedValue(void 0);
        const flagUnload = jest.fn().mockResolvedValue(void 0);
        const MockService = class extends IsomorphicService {
            async init() {
                await flagLoad();
            }

            async uninit() {
                await flagUnload();
            }
        };
        containerModule.registerService("mockService", new MockService());
        expect(containerModule.get("mockService")).toBeDefined();
        expect(containerModule.get("mockService")).toBeInstanceOf(MockService);
        await expect(loadModules(containerModule)).resolves.not.toThrow();
        expect(flagLoad).toBeCalledTimes(1);
        await expect(containerModule.uninit()).resolves.not.toThrow();
        expect(flagUnload).toBeCalledTimes(1);
    });
});
