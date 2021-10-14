import type { UnknownMapping } from "../../../utils/type";
import type { UserConfigService } from "../UserConfigModule";

export interface ServicesKeyType {
    userConfigService: UserConfigService;
}
export type ServiceKeys = keyof ServicesKeyType;

export interface Service {
    name: string;
    init: () => Promise<void>;
}

export type ReturnServiceType<TKey extends keyof ServicesKeyType> =
    ServicesKeyType[TKey];

export type ServiceConfigName<T extends ServiceKeys | UnknownMapping> =
    | ServiceKeys
    | T;
export type ServiceConfigType<T extends ServiceKeys | UnknownMapping> =
    T extends ServiceKeys ? ReturnServiceType<T> : unknown;

export type ServicesConfig<TNames extends (ServiceKeys | UnknownMapping)[]> = {
    [T in keyof TNames]: TNames[T] extends ServiceKeys | UnknownMapping
        ? [
              name: ServiceConfigName<TNames[T]>,
              service?: ServiceConfigType<TNames[T]>
          ]
        : never;
};
