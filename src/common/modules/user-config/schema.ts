import type { Schema } from "electron-store";

import { SupportedLocales } from "../../i18n/raw";
import { unreadonly } from "../../utils/type";
import type { UserConfigObject } from "./type";

export const schema: Schema<UserConfigObject> = {
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
    viewConfigs: {
        items: {
            properties: {
                groupBy: {
                    type: "string",
                },
                type: {
                    type: "string",
                },
            },
            type: "object",
        },
        type: "array",
    },
} as const;
