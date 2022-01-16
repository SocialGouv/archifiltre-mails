/* eslint-disable import/no-named-as-default-member */
import { IS_MAIN, STATIC_PATH } from "@common/config";
import { WaitableTrait } from "@common/utils/WaitableTrait";
import { Use } from "@lsagetlethias/tstrait";
import type { IpcMainEvent } from "electron";
import { ipcMain, ipcRenderer } from "electron";
import fs from "fs/promises";
import type { ReadCallback, ResourceKey } from "i18next";
import i18next from "i18next";
import path from "path";

import type { Locale, Namespace } from "../i18n/raw";
import {
    DEFAULT_LOCALE,
    KnownNamespaces,
    SupportedLocales,
    validLocale,
} from "../i18n/raw";
import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";
import type { UserConfigService } from "./UserConfigModule";

const I18N_REQUEST_EVENT = "i18n.event.request";
const I18N_CHANGE_LANGUAGE_EVENT = "i18n.event.changeLanguage";
const I18N_PREPARE_CHANGE_LANGUAGE_EVENT = "i18n.event.prepareChangeLanguage";
const I18N_CHANGE_LANGUAGE_CALLBACK_EVENT = "i18n.event.changeLanguageCallback";

/**
 * Isomorphic module responsible for loading all i18n resources.
 *
 * Because of ismorphism, locale files are available in main AND renderer.
 */
export class I18nModule extends IsomorphicModule {
    public readonly service = new InnerI18nService(this) as I18nService;

    private readonly mainCache = new Map<Locale, Map<Namespace, ResourceKey>>();

    private changeLanguageRendererCallback?: IpcMainEvent["reply"];

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
            ns: KnownNamespaces,
            supportedLngs: SupportedLocales,
        });

        this.prepareChangeLanguage();
        this.service.resolve();
    }

    /**
     * Change the language in renderer by calling the prepared callback.
     */
    public callChangeLanguageRendererCallback(lng: Locale): void {
        this.changeLanguageRendererCallback?.(lng);
    }

    private prepareChangeLanguage() {
        if (IS_MAIN) {
            ipcMain.handle(
                I18N_CHANGE_LANGUAGE_EVENT,
                async (_evt, lng: Locale) => {
                    await i18next.changeLanguage(lng);
                }
            );

            ipcMain.on(I18N_PREPARE_CHANGE_LANGUAGE_EVENT, (event) => {
                this.changeLanguageRendererCallback = event.reply;
            });
        } else {
            ipcRenderer.send(I18N_PREPARE_CHANGE_LANGUAGE_EVENT);
            ipcRenderer.on(
                I18N_CHANGE_LANGUAGE_CALLBACK_EVENT,
                async (_evt, lng: Locale) => {
                    await i18next.changeLanguage(lng);
                }
            );
        }
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

@Use(WaitableTrait)
class InnerI18nService extends IsomorphicService {
    public readonly i18next = i18next;

    constructor(private readonly i18nModule: I18nModule) {
        super();
    }

    /**
     * Change i18next language for current side and use ipc to change language for the other side.
     */
    public async changeLanguage(lng: Locale) {
        const validLng = validLocale(lng);
        await i18next.changeLanguage(validLng);
        if (IS_MAIN) {
            this.i18nModule.callChangeLanguageRendererCallback(validLng);
        } else {
            await ipcRenderer.invoke(I18N_CHANGE_LANGUAGE_EVENT, validLng);
        }
    }
}

/**
 * Service used to act on i18next on both main and renderer at the same time.
 */
export type I18nService = InnerI18nService & WaitableTrait;
