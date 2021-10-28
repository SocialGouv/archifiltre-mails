import type { UnknownMapping } from "../../utils/type";
import type { UserConfigService } from "../UserConfigModule";

/**
 * For DX/autocomplet purpose, list of all services that can be available in the app.
 *
 * Be aware that isomorphic and dedicated services have no difference here.
 */
export interface ServicesKeyType {
    userConfigService: UserConfigService;
}

export type ServiceKeys = keyof ServicesKeyType;

/**
 * A service is responsible to anchor capabilities around a given business domain.
 *
 * It can be standalone or attached to a module.
 */
export interface Service {
    /**
     * Given name. Recommended to be `constructor.name`
     */
    name: string;

    /**
     * Init a service once when the app starts (main) or when a window open (renderer).
     *
     * If needed, a private `inited` property flag can be used to ensure this method is called once.
     */
    init?: () => Promise<void>;
}

/**
 * Associate a given key to its service type
 */
export type ReturnServiceType<TKey extends ServiceKeys> = ServicesKeyType[TKey];

/**
 * Ensure auto complete on union string even with a primitive string
 */
export type ServiceConfigName<T extends ServiceKeys | UnknownMapping> =
    | ServiceKeys
    | T;

/**
 * Give the correct service type or unknown by default with a given wide key
 */
export type ServiceConfigType<T extends ServiceKeys | UnknownMapping> =
    T extends ServiceKeys ? ReturnServiceType<T> : unknown;

/**
 * Tuple map for a list of combo key/service
 */
export type ServicesConfig<TNames extends (ServiceKeys | UnknownMapping)[]> = {
    [T in keyof TNames]: TNames[T] extends ServiceKeys | UnknownMapping
        ? [
              name: ServiceConfigName<TNames[T]>,
              service?: ServiceConfigType<TNames[T]>
          ]
        : never;
};
