import type { ServiceKeys, ServicesConfig } from "../modules/container/type";
import { containerModule } from "../modules/ContainerModule";
import type { Module } from "../modules/Module";
import { IsomorphicModuleFactory } from "../modules/Module";
import { UserConfigModule } from "../modules/UserConfigModule";
import type { UnknownMapping } from "../utils/type";

/**
 * Group modules that will be loaded on main AND renderer processes.
 *
 * @param additionalServices Optional additional services to register before loading modules
 */
export const getIsomorphicModules = <
    TNames extends (ServiceKeys | UnknownMapping)[]
>(
    ...additionalServices: ServicesConfig<TNames>
): Module[] => {
    const userConfigModule =
        IsomorphicModuleFactory.getInstance(UserConfigModule);
    containerModule.registerServices([
        "userConfigService",
        userConfigModule.service,
    ]);

    containerModule.registerServices(...additionalServices);
    return [containerModule, userConfigModule];
};
