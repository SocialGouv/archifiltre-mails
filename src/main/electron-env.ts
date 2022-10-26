import {
    APP_CACHE,
    APP_DATA,
    IS_PACKAGED,
    NATIVES_PATH,
    STATIC_PATH,
} from "@common/config";

process.env.ELECTRON_APP_DATA = APP_DATA();
process.env.ELECTRON_APP_CACHE = APP_CACHE();
process.env.ELECTRON_IS_PACKAGED = `${IS_PACKAGED()}`;
process.env.ELECTRON_NATIVES_PATH = NATIVES_PATH;
process.env.ELECTRON_STATIC_PATH = STATIC_PATH;
