import type { UnknownMapping } from "../../utils/type";
import type { ViewConfiguration } from "./utils";

export type BuiltInViewType = "domain" | "recipient" | "year";
export type ViewType = BuiltInViewType | UnknownMapping;

export const DEFAULT_VIEW_LIST: ViewType[] = ["domain", "recipient", "year"];
export const MAIL_VIEW = "mail";

export const builtInViewConfigs: ViewConfiguration[] = [
    {
        groupBy: "_fn:mail:domainAndLdap",
        type: "domain",
    },
    {
        groupBy: "_fn:date:year",
        type: "year",
    },
    {
        groupBy: "senderEmailAddress",
        type: "recipient",
    },
];
