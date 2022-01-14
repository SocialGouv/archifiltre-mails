/* eslint-disable import/no-named-as-default-member */
import { IS_MAIN } from "@common/config";
import { ElectronI18nextBackend } from "@common/i18n/ElectronI18nextBackend";
import i18next from "i18next";

import { IsomorphicModule } from "./Module";
import type { UserConfigService } from "./UserConfigModule";

export class I18nModule extends IsomorphicModule {
    constructor(private readonly userConfigService: UserConfigService) {
        super();
    }

    public async init(): Promise<void> {
        console.info("======================== USE ElectronI18nextBackend");
        i18next.use(ElectronI18nextBackend);

        if (!IS_MAIN) {
            i18next.use((await import("react-i18next")).initReactI18next);
        }

        await i18next.init({
            debug: true,
            fallbackLng: "cimode",
            interpolation: {
                escapeValue: IS_MAIN,
            },
            lng: this.userConfigService.get("locale"),
        });
    }
}
