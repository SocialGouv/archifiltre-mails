import { Use } from "@lsagetlethias/tstrait";
import { randomUUID } from "crypto";
import { app } from "electron";
import Store from "electron-store";

import { IS_MAIN, IS_PACKAGED } from "../config";
import { validLocale } from "../i18n/raw";
import { AppError } from "../lib/error/AppError";
import type { PubSub } from "../lib/event/PubSub";
import type { Event } from "../lib/event/type";
import { ipcMain, ipcRenderer } from "../lib/ipc";
import { randomString } from "../utils";
import { name as appName } from "../utils/package";
import type { SimpleObject, VoidFunction } from "../utils/type";
import { WaitableTrait } from "../utils/WaitableTrait";
import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";
import { schema } from "./user-config/schema";
import type { UserConfigObject } from "./user-config/type";
import { builtInViewConfigs } from "./views/setup";

export class UserConfigError extends AppError {
    constructor(
        message: string,
        public readonly store?: UserConfigObject,
        previousError?: Error | unknown
    ) {
        super(message, previousError);
    }
}

export class UserConfigEvent<T = SimpleObject>
    implements Event<T & UserConfigObject>
{
    public readonly state: Readonly<T & UserConfigObject>;

    public readonly namespace = "event.userconfig" as const;

    constructor(state: T & UserConfigObject) {
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
 * Define how to get a config value
 */
type UserConfigGetter = <TKey extends keyof UserConfigObject>(
    key: TKey
) => UserConfigObject[TKey];

/**
 * Define how to get a all config
 */
type UserConfigGetterAll = () => UserConfigObject;

/**
 * Define how to set a config value
 */
type UserConfigSetter = <TKey extends keyof UserConfigObject>(
    key: TKey,
    value: UserConfigObject[TKey]
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
const CONFIG_SET_EVENT = "config.event.set";

declare module "../lib/ipc/event" {
    interface DualAsyncIpcMapping {
        [CONFIG_ASK_UPDATE_EVENT]: DualIpcConfig<
            typeof CONFIG_UPDATE_EVENT,
            [id: string],
            [config: Readonly<UserConfigObject>]
        >;
    }

    interface SyncIpcMapping {
        [CONFIG_UNSUB_UPDATE_EVENT]: IpcConfig<[id: string], boolean>;
    }

    interface AsyncIpcMapping {
        [CONFIG_INIT_EVENT]: IpcConfig<[], UserConfigObject>;
        [CONFIG_SET_EVENT]: {
            [K in keyof UserConfigObject]: IpcConfig<
                [key: K, value: UserConfigObject[K]],
                void
            >;
        }[keyof UserConfigObject];
    }
}

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
    private store!: Store<UserConfigObject>;

    // bang because only used on renderer process
    private localConfigCopy!: UserConfigObject;

    private _service?: UserConfigService;

    private readonly configId = IS_MAIN
        ? "main"
        : (globalThis._configId = globalThis._configId ?? randomString());

    public constructor(private readonly pubSub: PubSub) {
        super();
    }

    public async init(): pvoid {
        if (this.inited) {
            return;
        }

        if (IS_MAIN) {
            this.store = new Store<UserConfigObject>({
                clearInvalidConfig: true,
                defaults: {
                    _firstOpened: true,
                    appId: randomUUID(),
                    collectData: true,
                    extractProgressDelay: 1500,
                    fullscreen: true,
                    locale: validLocale(app.getLocale()),
                    viewConfigs: builtInViewConfigs,
                },
                name: IS_PACKAGED() ? "config" : appName,
                schema,
                watch: true,
            });

            // wait for each renderer process to ask for initial config
            ipcMain.handle(CONFIG_INIT_EVENT, () => this.store.store);
            const rendererConfigRepliers = new Map<
                string,
                (
                    replyChannel: typeof CONFIG_UPDATE_EVENT,
                    config: Readonly<UserConfigObject>
                ) => void
            >();
            // add a renderer process as a subscriber to the update event
            ipcMain.on(CONFIG_ASK_UPDATE_EVENT, (event, id) => {
                rendererConfigRepliers.set(id, event.reply);
            });
            // remove a renderer process from being aware of config changes
            ipcMain.on(CONFIG_UNSUB_UPDATE_EVENT, (event, id) => {
                event.returnValue = rendererConfigRepliers.delete(id);
            });
            // triggered when manual set is done from renderer
            ipcMain.handle(CONFIG_SET_EVENT, (_, key, value) => {
                this.store.set(key, value);
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
            // subscribe to any udpate
            ipcRenderer.on(CONFIG_UPDATE_EVENT, (_event, arg) => {
                this.localConfigCopy = arg;
            });
            ipcRenderer.send(CONFIG_ASK_UPDATE_EVENT, this.configId);
        }
        this.inited = true;
        this.service.resolve();
    }

    public async uninit(): pvoid {
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
                this.getAll,
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
     * Return this whole config object. The default implementation of this function must not be called from main process.
     *
     * @returns The full config object
     */
    private readonly getAll: UserConfigGetterAll = () => {
        this.ensureInited();
        if (IS_MAIN) return { ...this.store.store };
        else return this.localConfigCopy;
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
        } else {
            void ipcRenderer.invoke(CONFIG_SET_EVENT, key, value as never);
        }
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
         * Get a whole config.
         */
        public readonly getAll: UserConfigGetterAll,
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
