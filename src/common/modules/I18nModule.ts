/* eslint-disable import/no-named-as-default-member */
import { IS_MAIN, STATIC_PATH } from "@common/config";
import { ipcMain, ipcRenderer } from "electron";
import fs from "fs/promises";
import type { ReadCallback, ResourceKey } from "i18next";
import i18next from "i18next";
import path from "path";

import type { Locale, Namespace } from "../i18n/raw";
import { DEFAULT_LOCALE, SupportedLocales } from "../i18n/raw";
import { IsomorphicModule } from "./Module";
import type { UserConfigService } from "./UserConfigModule";

const I18N_REQUEST_EVENT = "i18n.event.request";

export class I18nModule extends IsomorphicModule {
    private readonly mainCache = new Map<Locale, Map<Namespace, ResourceKey>>();

    constructor(private readonly userConfigService: UserConfigService) {
        super();
    }

    public async init(): Promise<void> {
        await this.userConfigService.wait();
        i18next.use({
            init: () => {
                if (IS_MAIN) {
                    ipcMain.handle(
                        I18N_REQUEST_EVENT,
                        async (_evt, language: Locale, namespace: Namespace) =>
                            this.requestFile(language, namespace)
                    );
                }
                return;
            },
            read: (
                language: Locale,
                namespace: Namespace,
                callback: ReadCallback
            ) => {
                (IS_MAIN
                    ? this.requestFile(language, namespace)
                    : ipcRenderer.invoke(
                          I18N_REQUEST_EVENT,
                          language,
                          namespace
                      )
                )
                    .then((data: ResourceKey) => {
                        callback(null, data);
                    })
                    .catch((err: Error) => {
                        callback(err, null);
                    });
            },

            type: "backend",
        });

        if (!IS_MAIN) {
            i18next.use((await import("react-i18next")).initReactI18next);
        }

        await i18next.init({
            fallbackLng: DEFAULT_LOCALE,
            interpolation: {
                escapeValue: IS_MAIN,
            },
            lng: this.userConfigService.get("locale"),
            load: "currentOnly",
            supportedLngs: SupportedLocales,
        });
    }

    private async requestFile(language: Locale, namespace: Namespace) {
        const localesPath = path.resolve(STATIC_PATH, "locales");
        const filePath = path.join(localesPath, language, `${namespace}.json`);
        const languageCache = this.mainCache.get(language);
        if (!languageCache) {
            const data: ResourceKey = JSON.parse(
                await fs.readFile(filePath, { encoding: "utf-8" })
            );
            this.mainCache.set(language, new Map([[namespace, data]]));
            return data;
        }

        const namespaceCache = languageCache.get(namespace);
        if (!namespaceCache) {
            const data: ResourceKey = JSON.parse(
                await fs.readFile(filePath, { encoding: "utf-8" })
            );
            this.mainCache.get(language)!.set(namespace, data);
            return data;
        }

        return this.mainCache.get(language)!.get(namespace)!;
    }
}
