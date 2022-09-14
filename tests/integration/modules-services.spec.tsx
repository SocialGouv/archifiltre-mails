import { loadModules, unloadModules } from "@common/lib/ModuleManager";
import {
    containerModule,
    IsomorphicService,
} from "@common/modules/ContainerModule";
import {
    IsomorphicModule,
    IsomorphicModuleFactory,
} from "@common/modules/Module";

describe("Module and loader", () => {
    it("should load and unload a mocked module", async () => {
        const flagInit = jest.fn().mockResolvedValue(void 0);
        const flagUninit = jest.fn().mockResolvedValue(void 0);
        const MockModule = class extends IsomorphicModule {
            async init() {
                await flagInit();
            }

            async uninit() {
                await flagUninit();
            }
        };

        const mockModule = IsomorphicModuleFactory.getInstance(MockModule);
        expect(mockModule).toBeDefined();
        await expect(loadModules(mockModule)).resolves.not.toThrow();
        expect(mockModule).toStrictEqual(
            IsomorphicModuleFactory.getInstance(MockModule)
        );
        expect(flagInit).toBeCalledTimes(1);

        await expect(unloadModules(mockModule)).resolves.not.toThrow();
        expect(flagUninit).toBeCalledTimes(1);
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
