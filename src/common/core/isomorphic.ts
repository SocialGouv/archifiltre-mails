import { I18nModule } from "@common/modules/I18nModule";

import type { ServiceKeys, ServicesConfig } from "../modules/container/type";
import { containerModule } from "../modules/ContainerModule";
import { FileExporterModule } from "../modules/FileExporterModule";
import { IpcModule } from "../modules/IpcModule";
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
    const fileExporterModule =
        IsomorphicModuleFactory.getInstance(FileExporterModule);
    const ipcModule = IsomorphicModuleFactory.getInstance(IpcModule);

    containerModule.registerServices(
        ["userConfigService", userConfigModule.service],
        ["i18nService", i18nModule.service],
        ["fileExporterService", fileExporterModule.service],
        ...[...additionalServices] // like "Set"
    );

    return [
        containerModule,
        userConfigModule,
        i18nModule,
        fileExporterModule,
        ipcModule,
    ];
};
