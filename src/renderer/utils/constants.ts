// views
export type VIEWS = `views.dashboard` | `views.ecology` | `views.history`;
export const DASHBOARD = "dashboard";

// dashboard menu
export type MENU =
    | "menu.audit"
    | "menu.enrichment"
    | "menu.general"
    | "menu.redondance"
    | "menu.vizualisation";

// workspace
export type VIZUALISATION =
    | "vizualisation.circle-packing"
    | "vizualisation.dropdown-list"
    | "vizualisation.sunburst";

// extractor
export const ACCEPTED_EXTENSION = ".pst";
export const ARBITRARY_FLAT_LEVEL = 12;

export const ROOT = "root";

// colors
export const RED = "red";
export const TRANSPARENT = "transparent";
export const KEEP_COLOR = "#62bc6f";
export const DELETE_COLOR = "#f75e42";
export const BASE_COLOR = "rgb(31, 120, 180)";
export const BASE_COLOR_LIGHT = "#eaf0fd";
// export const KEEP_COLOR = "#71c377";

export const COLORS = {
    BASE_COLOR,
    BASE_COLOR_LIGHT,
    DELETE_COLOR,
    KEEP_COLOR,
    RED,
    TRANSPARENT,
};

// html id and classname
export const CIRCLE_PACKING_ID = "#circle-packing";

export const MAX_TRESHOLD = 20;
export const TRESHOLD_KEY = "_other";
export const RATIO_FROM_MAX = 10;

export const ORG_UNIT_PST = "/OU=";
export const COMMON_NAME_PST = "/CN=";

export const DOMAIN = "domain";
export const CORRESPONDANTS = "correspondants";
export const YEAR = "year";
export const MAILS = "mails";
