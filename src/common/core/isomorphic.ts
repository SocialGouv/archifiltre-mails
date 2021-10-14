import { loadModules } from "../lib/ModuleManager";
import type { UnknownMapping } from "../utils/type";
import type { ServiceKeys, ServicesConfig } from "./modules/container/type";
import { containerModule } from "./modules/ContainerModule";
import { IsomorphicModuleFactory } from "./modules/Module";
import { UserConfigModule } from "./modules/UserConfigModule";

export const loadIsomorphicModules = async <
    TNames extends (ServiceKeys | UnknownMapping)[]
>(
    ...additionalServices: ServicesConfig<TNames>
): Promise<void> => {
    const userConfigModule =
        IsomorphicModuleFactory.getInstance(UserConfigModule);
    containerModule.registerService(
        "userConfigService",
        userConfigModule.service
    );

    containerModule.registerServices(...additionalServices);
    await loadModules(containerModule, userConfigModule);
};
