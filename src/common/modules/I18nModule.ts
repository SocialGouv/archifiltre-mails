/* eslint-disable import/no-named-as-default-member */
import { Use } from "@lsagetlethias/tstrait";
import type { IpcMainEvent } from "electron";
import { ipcMain, ipcRenderer } from "electron";
import fs from "fs/promises";
import type { ReadCallback, ResourceKey } from "i18next";
import i18next from "i18next";
import path from "path";

import { IS_MAIN, STATIC_PATH } from "../config";
import type { Locale, Namespace } from "../i18n/raw";
import {
    DEFAULT_LOCALE,
    KnownNamespaces,
    SupportedLocales,
    validLocale,
} from "../i18n/raw";
import type { PubSub } from "../lib/event/PubSub";
import type { Event, Unsubscriber } from "../lib/event/type";
import { logger } from "../logger";
import { WaitableTrait } from "../utils/WaitableTrait";
import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";
import type { UserConfigService } from "./UserConfigModule";

const I18N_REQUEST_EVENT = "i18n.event.request";
const I18N_CHANGE_LANGUAGE_EVENT = "i18n.event.changeLanguage";
const I18N_PREPARE_CHANGE_LANGUAGE_EVENT = "i18n.event.prepareChangeLanguage";
const I18N_CHANGE_LANGUAGE_CALLBACK_EVENT = "i18n.event.changeLanguageCallback";

export interface I18nEventState {
    currentLng: Locale;
}
export class I18nEvent<T> implements Event<I18nEventState & T> {
    public namespace = "event.i18n" as const;

    public state;

    constructor(state: I18nEventState & T) {
        this.state = { ...state };
    }
}

export interface I18nLanguageChangedState extends I18nEventState {
    oldLng: Locale;
}
export class I18nLanguageChangedEvent extends I18nEvent<I18nLanguageChangedState> {}

export type LanguageChangedListener = (evt: I18nLanguageChangedEvent) => void;

declare module "../lib/event/type" {
    interface EventKeyType {
        "event.i18n.languageChanged": I18nLanguageChangedEvent;
    }
}

/**
 * Isomorphic module responsible for loading all i18n resources.
 *
 * Because of ismorphism, locale files are available in main AND renderer.
 */
export class I18nModule extends IsomorphicModule {
    public readonly service = new InnerI18nService(this) as I18nService;

    private readonly mainCache = new Map<Locale, Map<Namespace, ResourceKey>>();

    private changeLanguageRendererCallback?: IpcMainEvent["reply"];

    private readonly languageChangedListeners = new Map<
        LanguageChangedListener,
        Unsubscriber
    >();

    private userConfigChangedFromHere = false;

    private unsubscriberConfigUpdate?: Unsubscriber;

    constructor(
        private readonly userConfigService: UserConfigService,
        private readonly pubSub: PubSub
    ) {
        super();
    }

    public async init(): pvoid {
        // wait for userconfig to be usable
        await this.userConfigService.wait();

        // use custom i18next backend to load files only from main THEN return it from ipc
        // use a basic local cache associated to the main version of the module
        i18next.use({
            init: () => {
                if (IS_MAIN) {
                    ipcMain.handle(
                        I18N_REQUEST_EVENT,
                        async (_evt, language: Locale, namespace: Namespace) =>
                            this.requestFile(language, namespace)
                    );
                }
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
                escapeValue: IS_MAIN, // https://react.i18next.com/latest/i18next-instance said "not needed for react!!"
            },
            lng: this.userConfigService.get("locale"),
            load: "currentOnly", // lazy load other locales
            ns: KnownNamespaces,
            supportedLngs: SupportedLocales,
        });

        // subscribe to locale change from config
        this.unsubscriberConfigUpdate = this.pubSub.subscribe(
            "event.userconfig.updated",
            (event) => {
                logger.log(
                    "[i18nModule] pubsub trigger",
                    this.userConfigChangedFromHere,
                    event
                );
                if (this.userConfigChangedFromHere) {
                    this.userConfigChangedFromHere = false;
                    return;
                }
                void i18next.changeLanguage(event.state.locale);
            }
        );

        this.prepareChangeLanguage();
        this.service.resolve();
    }

    public async uninit(): pvoid {
        logger.info("[I18nModule] uninit ", this.unsubscriberConfigUpdate);
        this.unsubscriberConfigUpdate?.();
        return Promise.resolve();
    }

    /**
     * Change the language in renderer by calling the prepared callback.
     */
    public callChangeLanguageRendererCallback(lng: Locale): void {
        this.changeLanguageRendererCallback?.(
            I18N_CHANGE_LANGUAGE_CALLBACK_EVENT,
            lng
        );
        this.userConfigChangedFromHere = true;
        this.userConfigService.set("locale", lng);
    }

    public addLanguageChangedListener(listener: LanguageChangedListener): void {
        this.languageChangedListeners.set(
            listener,
            this.pubSub.subscribe("event.i18n.languageChanged", listener)
        );
    }

    public removeLanguageChangedListener(
        listener: LanguageChangedListener
    ): void {
        this.languageChangedListeners.get(listener)?.();
        this.languageChangedListeners.delete(listener);
    }

    public triggerLanguageChangedListeners(
        currentLng: Locale,
        oldLng: Locale
    ): void {
        this.pubSub.publish(
            "event.i18n.languageChanged",
            new I18nLanguageChangedEvent({
                currentLng,
                oldLng,
            })
        );
    }

    private prepareChangeLanguage() {
        if (IS_MAIN) {
            // when renderer asks for changing language, do it in main
            // update user config
            // and trigger set main listeners if applicable
            ipcMain.handle(
                I18N_CHANGE_LANGUAGE_EVENT,
                async (_evt, lng: Locale) => {
                    logger.log("[I18nModule] change asked from renderer", lng);
                    const oldLng = i18next.language;
                    await i18next.changeLanguage(lng);
                    this.userConfigChangedFromHere = true;
                    this.userConfigService.set("locale", lng);
                    this.triggerLanguageChangedListeners(lng, oldLng as Locale);
                }
            );

            // get the "reply" function and store it for latter uses
            // when changing the language is asked first from main
            ipcMain.on(I18N_PREPARE_CHANGE_LANGUAGE_EVENT, (event) => {
                this.changeLanguageRendererCallback = event.reply;
            });
        } else {
            // send renderer callback when changing the language is asked first from main
            ipcRenderer.send(I18N_PREPARE_CHANGE_LANGUAGE_EVENT);
            // when main asks for changing language, do it in renderer
            // and trigger set renderer listeners if applicable
            ipcRenderer.on(
                I18N_CHANGE_LANGUAGE_CALLBACK_EVENT,
                async (_evt, lng: Locale) => {
                    logger.log("[I18nModule] change triggered by main", lng);
                    const oldLng = i18next.language;
                    await i18next.changeLanguage(lng);
                    this.triggerLanguageChangedListeners(lng, oldLng as Locale);
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
     *
     * The module will also ensure that the user config is updated with the chosen locale.
     */
    public async changeLanguage(lng: Locale) {
        const validLng = validLocale(lng);
        const oldLng = i18next.language;
        await i18next.changeLanguage(validLng);
        this.i18nModule.triggerLanguageChangedListeners(lng, oldLng as Locale);
        if (IS_MAIN) {
            this.i18nModule.callChangeLanguageRendererCallback(validLng);
        } else {
            await ipcRenderer.invoke(I18N_CHANGE_LANGUAGE_EVENT, validLng);
        }
    }

    /**
     * Listen to any language changes from any side.
     */
    public addLanguageChangedListener(listener: LanguageChangedListener) {
        this.i18nModule.addLanguageChangedListener(listener);
    }

    /**
     * Stop listening to any language changes by giving the same function added earlier.
     */
    public removeLanguageChangedListener(listener: LanguageChangedListener) {
        this.i18nModule.removeLanguageChangedListener(listener);
    }
}

/**
 * Service used to act on i18next on both main and renderer at the same time.
 */
export type I18nService = InnerI18nService & WaitableTrait;
