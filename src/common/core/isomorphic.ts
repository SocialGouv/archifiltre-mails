import { I18nModule } from "@common/modules/I18nModule";

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
    const i18nModule = IsomorphicModuleFactory.getInstance(
        I18nModule,
        userConfigModule.service
    );
    containerModule.registerServices(
        ["userConfigService", userConfigModule.service],
        ["i18nRetrieverService", i18nModule.service]
    );

    containerModule.registerServices(...additionalServices);
    return [containerModule, userConfigModule, i18nModule];
};
