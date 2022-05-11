import { Use } from "@lsagetlethias/tstrait";
import { app, ipcMain, ipcRenderer } from "electron";
import Store from "electron-store";

import { IS_MAIN, IS_PACKAGED } from "../config";
import type { Locale } from "../i18n/raw";
import { SupportedLocales, validLocale } from "../i18n/raw";
import { AppError } from "../lib/error/AppError";
import type { PubSub } from "../lib/event/PubSub";
import type { Event } from "../lib/event/type";
import type { TrackAppId } from "../tracker/type";
import { randomString } from "../utils";
import { name as appName } from "../utils/package";
import type { SimpleObject, VoidFunction } from "../utils/type";
import { unreadonly } from "../utils/type";
import { WaitableTrait } from "../utils/WaitableTrait";
import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";

export class UserConfigError extends AppError {
    constructor(
        message: string,
        public readonly store?: UserConfigV1,
        previousError?: Error | unknown
    ) {
        super(message, previousError);
    }
}

export class UserConfigEvent<T = SimpleObject>
    implements Event<T & UserConfigV1>
{
    public readonly state: Readonly<T & UserConfigV1>;

    public readonly namespace = "event.userconfig" as const;

    constructor(state: T & UserConfigV1) {
        this.state = { ...state };
    }
}
export class UserConfigUpdatedEvent extends UserConfigEvent {}

declare module "../lib/event/type" {
    interface EventKeyType {
        "event.userconfig.updated": UserConfigUpdatedEvent;
    }
}

/**
 * Config for `ArchifiltreMails@v1`
 */
interface UserConfigV1 {
    _firstOpened: boolean;
    appId: TrackAppId;
    collectData: boolean;
    extractProgressDelay: number;
    fullscreen: boolean;
    locale: Locale;
}

/**
 * Define how to get a config value
 */
type UserConfigGetter = <TKey extends keyof UserConfigV1>(
    key: TKey
) => UserConfigV1[TKey];

/**
 * Define how to set a config value
 */
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

const CONFIG_INIT_EVENT = "config.event.init";
const CONFIG_UPDATE_EVENT = "config.event.update";
const CONFIG_ASK_UPDATE_EVENT = "config.event.askUpdate";
const CONFIG_UNSUB_UPDATE_EVENT = "config.event.unsubUpdate";

/**
 * Isomorphic module handling user config. Use `electron-store` under the hood on main side.
 *
 * Renderer processes can remotly access access to this config. But saves have to be done from main process.
 *
 * The config itself is accessible via the dedicated inner {@link service}.
 */
export class UserConfigModule extends IsomorphicModule {
    private inited = false;

    // bang because only used on main process
    private store!: Store<UserConfigV1>;

    // bang because only used on renderer process
    private localConfigCopy!: UserConfigV1;

    private _service?: UserConfigService;

    private readonly configId = IS_MAIN
        ? "main"
        : (globalThis._configId = globalThis._configId ?? randomString());

    public constructor(private readonly pubSub: PubSub) {
        super();
    }

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        if (IS_MAIN) {
            this.store = new Store<UserConfigV1>({
                clearInvalidConfig: true,
                defaults: {
                    _firstOpened: true,
                    appId: (await import("uuid")).v4(),
                    collectData: true,
                    extractProgressDelay: 1500,
                    fullscreen: true,
                    locale: validLocale(app.getLocale()),
                },
                name: IS_PACKAGED() ? "config" : appName,
                schema: {
                    _firstOpened: {
                        type: "boolean",
                    },
                    appId: {
                        readOnly: true,
                        type: "string",
                    },
                    collectData: {
                        type: "boolean",
                    },
                    extractProgressDelay: {
                        minimum: 500,
                        type: "integer",
                    },
                    fullscreen: {
                        type: "boolean",
                    },
                    locale: {
                        enum: unreadonly(SupportedLocales),
                    },
                },
                watch: true,
            });

            // wait for each renderer process to ask for initial config
            ipcMain.handle(CONFIG_INIT_EVENT, () => this.store.store);
            const rendererConfigRepliers = new Map<
                string,
                (channel: string, value: unknown) => void
            >();
            // add a renderer process as a subscriber to the update event
            ipcMain.on(CONFIG_ASK_UPDATE_EVENT, (event, id) => {
                rendererConfigRepliers.set(id as string, event.reply as never);
            });
            // remove a renderer process from being aware of config changes
            ipcMain.on(CONFIG_UNSUB_UPDATE_EVENT, (event, id) => {
                event.returnValue = rendererConfigRepliers.delete(id as string);
            });
            this.store.onDidAnyChange((config) => {
                if (!config) return;
                for (const reply of rendererConfigRepliers.values()) {
                    reply(CONFIG_UPDATE_EVENT, config);
                }
                this.pubSub.publish(
                    "event.userconfig.updated",
                    new UserConfigUpdatedEvent(config)
                );
            });
        } else {
            // ask main for initial config
            this.localConfigCopy = await ipcRenderer.invoke(CONFIG_INIT_EVENT);
            // subscribe to any udpates
            ipcRenderer.on(CONFIG_UPDATE_EVENT, (_event, arg) => {
                this.localConfigCopy = arg;
            });
            ipcRenderer.send(CONFIG_ASK_UPDATE_EVENT, this.configId);
        }
        this.inited = true;
        this.service.resolve();
    }

    public async uninit(): Promise<void> {
        if (!IS_MAIN) {
            ipcRenderer.sendSync(CONFIG_UNSUB_UPDATE_EVENT, this.configId);
            ipcRenderer.removeAllListeners(CONFIG_UPDATE_EVENT);
        }
        this.inited = false;
        return Promise.resolve();
    }

    /**
     * The linked service used to access config accross the application.
     */
    public get service(): UserConfigService {
        return (
            this._service ??
            (this._service = new InnerUserConfigService(
                this.get,
                this.set,
                this.clear
            ) as UserConfigService)
        );
    }

    /**
     * Return the asked value from provided key. The default implementation of this function must not be called from main process.
     *
     * @param key The config key
     * @returns The config value
     */
    private readonly get: UserConfigGetter = (key) => {
        this.ensureInited();
        if (IS_MAIN) return this.store.get(key);
        else return this.localConfigCopy[key];
    };

    /**
     * Set a value associated with the provided key. Only works from main. Setting undefined will delete the key.
     *
     * @todo set from renderer
     *
     * @param key The config key
     * @param value The set value
     */
    private readonly set: UserConfigSetter = (key, value) => {
        this.ensureInited();
        if (IS_MAIN) {
            this.store.set(key, value);
        } else
            throw new UserConfigError(
                "Can't direct set config outside of main process.",
                this.store.store
            );
    };

    /**
     * Clear the config and reset to default.
     */
    private readonly clear = () => {
        this.ensureInited();
        if (IS_MAIN) {
            this.store.clear();
        } else
            throw new UserConfigError(
                "Can't clear config outside of main process.",
                this.store.store
            );
    };

    private ensureInited(): asserts this {
        if (!this.inited) {
            throw new UserConfigError(
                "Config is not inited.",
                this.store.store
            );
        }
    }
}

@Use(WaitableTrait)
class InnerUserConfigService extends IsomorphicService {
    readonly name = "UserConfigService";

    constructor(
        /**
         * Get a config by its name.
         */
        public readonly get: UserConfigGetter,
        /**
         * Set a config by its name and value.
         */
        public readonly set: UserConfigSetter,

        /**
         * Clear the config and reset to default.
         */
        public readonly clear: VoidFunction
    ) {
        super();
    }
}

export type UserConfigService = InnerUserConfigService & WaitableTrait;
