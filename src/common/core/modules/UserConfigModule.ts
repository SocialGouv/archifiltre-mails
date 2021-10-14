import { app, ipcMain, ipcRenderer } from "electron";
import Store from "electron-store";

import type { Locale } from "../../i18n/raw";
import { DEFAULT_LOCALE, SupportedLocales, validLocale } from "../../i18n/raw";
import { randomString } from "../../utils";
import { IS_MAIN } from "../config";
import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";

/**
 * Config for `Archimail@v1`
 */
interface UserConfigV1 {
    collectData: boolean;
    locale: Locale;
}

type UserConfigGetter = <TKey extends keyof UserConfigV1>(
    key: TKey
) => UserConfigV1[TKey];
type UserConfigSetter = <TKey extends keyof UserConfigV1>(
    key: TKey,
    value?: UserConfigV1[TKey]
) => void;

declare global {
    /**
     * Overload needed to ensure only one config instance per renderer process
     */
    // eslint-disable-next-line no-var
    var _configId: string | undefined;
}

const CONFIG_INIT_EVENT = "config.init";
const CONFIG_UPDATE_EVENT = "config.update";
const CONFIG_ASK_UPDATE_EVENT = "config.askUpdate";

/**
 * Isomorphic module handling user config. Use `electron-store` under the hood on main side.
 *
 * Renderer processes can remotly access access to this config. But saves have to be done from main process.
 */
export class UserConfigModule extends IsomorphicModule {
    private inited = false;

    // bang because only used on main process
    private store!: Store<UserConfigV1>;

    private readonly configId = IS_MAIN
        ? "main"
        : (globalThis._configId = globalThis._configId ?? randomString());

    /**
     * Init the config on both sides.
     *
     * Renderer processes must call this asap if config is needed.
     *
     * @async
     * @returns void
     */
    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        if (IS_MAIN) {
            this.store = new Store<UserConfigV1>({
                clearInvalidConfig: true,
                defaults: {
                    collectData: true,
                    locale: validLocale(app.getLocale()),
                },
                name:
                    process.env.NODE_ENV === "production"
                        ? "config"
                        : "archimail",
                schema: {
                    collectData: {
                        default: true,
                        type: "boolean",
                    },
                    locale: {
                        default: DEFAULT_LOCALE,
                        enum: SupportedLocales as never,
                    },
                },
                watch: true,
            });

            if (process.env.NODE_ENV === "development") this.store.clear(); // TODO: change with proper env var or user config
            // wait for each renderer process to ask for initial config
            ipcMain.handle(CONFIG_INIT_EVENT, () => this.store.store);
            const rendererConfigRepliers = new Map<
                string,
                (channel: string, value: unknown) => void
            >();
            // add a renderer process as a subscriber to the update event
            // TODO: add "unsubscribe"
            ipcMain.on(CONFIG_ASK_UPDATE_EVENT, (event, id) => {
                rendererConfigRepliers.set(id as string, event.reply as never);
            });
            this.store.onDidAnyChange((config) => {
                for (const reply of rendererConfigRepliers.values()) {
                    reply(CONFIG_UPDATE_EVENT, config);
                }
            });
        } else {
            // ask main for initial config
            let localConfigCopy: UserConfigV1 = await ipcRenderer.invoke(
                CONFIG_INIT_EVENT
            );
            // subscribe to any udpate
            ipcRenderer.on(CONFIG_UPDATE_EVENT, (_event, arg) => {
                localConfigCopy = arg;
            });
            ipcRenderer.send(CONFIG_ASK_UPDATE_EVENT, this.configId);
            this.get = (key) => localConfigCopy[key];
            Object.seal(this);
        }
        this.inited = true;
    }

    public get service(): UserConfigService {
        return new (class
            extends IsomorphicService
            implements UserConfigService
        {
            public name = "UserConfigService";

            set = this.userConfigModule.set;

            constructor(private readonly userConfigModule: UserConfigModule) {
                super();
            }

            get: UserConfigGetter = (key) => {
                return this.userConfigModule.get(key);
            };

            async init() {
                return Promise.resolve();
            }
        })(this);
    }

    /**
     * Return the asked value from provided key. The default implementation of this function must not be called from main process.
     *
     * @param key The config key
     * @returns The config value
     */
    private get: UserConfigGetter = (key) => {
        if (IS_MAIN) return this.store.get(key);
        else throw new Error("Can't direct access config outside of main."); // TODO: proper ERROR management
    };

    /**
     * Set a value associated with the provided key. Only works from main. Setting undefined will delete the key.
     *
     * @param key The config key
     * @param value The set value
     */
    private readonly set: UserConfigSetter = (key, value) => {
        if (IS_MAIN) {
            this.store.set(key, value);
        } else throw new Error("Can't direct access config outside of main."); // TODO: proper ERROR management
    };
}

export interface UserConfigService extends IsomorphicService {
    readonly get: UserConfigGetter;
    readonly set: UserConfigSetter;
}
