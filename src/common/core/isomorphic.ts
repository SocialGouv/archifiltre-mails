import { PstExtractorModule } from "@common/modules/PstExtractorModule";

import { loadModules } from "../lib/ModuleManager";
import type { ServiceKeys, ServicesConfig } from "../modules/container/type";
import { containerModule } from "../modules/ContainerModule";
import { IsomorphicModuleFactory } from "../modules/Module";
import { UserConfigModule } from "../modules/UserConfigModule";
import type { UnknownMapping } from "../utils/type";

/**
 * Group modules that will be loaded on main AND renderer processes.
 *
 * @param additionalServices Optional additional services to register before loading modules
 */
export const loadIsomorphicModules = async <
    TNames extends (ServiceKeys | UnknownMapping)[]
>(
    ...additionalServices: ServicesConfig<TNames>
): Promise<void> => {
    const userConfigModule =
        IsomorphicModuleFactory.getInstance(UserConfigModule);
    const pstExtractorModule =
        IsomorphicModuleFactory.getInstance(PstExtractorModule);
    containerModule.registerServices(
        ["userConfigService", userConfigModule.service],
        ["pstExtractorService", pstExtractorModule.service]
    );

    containerModule.registerServices(...additionalServices);
    await loadModules(containerModule, userConfigModule, pstExtractorModule);
};
