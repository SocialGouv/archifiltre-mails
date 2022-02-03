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
export const COLORS = {
    // TODO: design system
    BASE_COLOR: "rgb(31, 120, 180)",
    BASE_COLOR_LIGHT: "#eaf0fd",
    BLACK: "#000",
    CARD_LABEL_BLUE: "blue",
    CARD_LABEL_GREEN: "green",
    CARD_LABEL_GREY: "grey",
    CARD_LABEL_ORANGE: "orange",
    CARD_LABEL_PURPLE: "purple",
    DELETE_COLOR: "rgb(247, 94, 66)",
    KEEP_COLOR: "#62bc6f",
    RED: "red",
    TRANSPARENT: "transparent",
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

export const markedTags = {
    // TODO: i18n
    TO_DELETE: "Supprimer",
    TO_KEEP: "Conserver",
    UNTAG: "Non marqué",
};
