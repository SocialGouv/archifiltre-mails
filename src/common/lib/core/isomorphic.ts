import type { ServiceKeys, ServicesConfig } from "../../modules/container/type";
import { containerModule } from "../../modules/ContainerModule";
import { FileExporterModule } from "../../modules/FileExporterModule";
import { I18nModule } from "../../modules/I18nModule";
import { IpcModule } from "../../modules/IpcModule";
import type { Module } from "../../modules/Module";
import { IsomorphicModuleFactory } from "../../modules/Module";
import { UserConfigModule } from "../../modules/UserConfigModule";
import { TrackerModule } from "../../tracker/TrackerModule";
import type { UnknownMapping } from "../../utils/type";
import { PubSub } from "../event/PubSub";

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
    // for dev purpose
    module.hot?.addDisposeHandler(() => void containerModule.uninit());
    const userConfigModule = IsomorphicModuleFactory.getInstance(
        UserConfigModule,
        PubSub.getInstance()
    );
    const trackerModule = IsomorphicModuleFactory.getInstance(
        TrackerModule,
        userConfigModule.service,
        PubSub.getInstance()
    );
    const i18nModule = IsomorphicModuleFactory.getInstance(
        I18nModule,
        userConfigModule.service,
        PubSub.getInstance()
    );
    const fileExporterModule = IsomorphicModuleFactory.getInstance(
        FileExporterModule,
        trackerModule.service
    );
    const ipcModule = IsomorphicModuleFactory.getInstance(IpcModule);

    containerModule.registerServices(
        ["pubSub", PubSub.getInstance()],
        ["userConfigService", userConfigModule.service],
        ["i18nService", i18nModule.service],
        ["fileExporterService", fileExporterModule.service],
        ["trackerService", trackerModule.service],
        ...additionalServices
    );

    return [
        containerModule,
        userConfigModule,
        trackerModule,
        i18nModule,
        fileExporterModule,
        ipcModule,
    ];
};
