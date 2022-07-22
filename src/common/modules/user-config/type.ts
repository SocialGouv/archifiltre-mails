import type { Locale } from "../../i18n/raw";
import type { TrackAppId } from "../../tracker/type";
import type { ViewConfiguration } from "../views/utils";

/**
 * Config for `ArchifiltreMails@v1`
 */
interface UserConfigV1 {
    readonly _firstOpened: boolean;
    readonly appId: TrackAppId;
    collectData: boolean;
    extractProgressDelay: number;
    fullscreen: boolean;
    locale: Locale;
    viewConfigs: ViewConfiguration[];
}

export type UserConfigObject = UserConfigV1;

export type WritableUserConfigKeys = Exclude<
    keyof UserConfigV1,
    "_firstOpened" | "appId"
>;

export type UserConfigTypedKeys<
    T extends UserConfigObject[WritableUserConfigKeys]
> = {
    [P in WritableUserConfigKeys]: UserConfigV1[P] extends T ? P : never;
}[WritableUserConfigKeys];
