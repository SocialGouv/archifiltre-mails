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

// colors
export const RED = "red";
export const TRANSPARENT = "transparent";

// html id and classname
export const CIRCLE_PACKING_ID = "#circle-packing";

export const MAX_TRESHOLD = 15;
export const RATIO_FROM_MAX = 10;

export const ORG_UNIT_PST = "/OU=";
export const COMMON_NAME_PST = "/CN=";
