import type { PSTRecipient } from "@socialgouv/archimail-pst-extractor";
import { PSTMessage } from "@socialgouv/archimail-pst-extractor";

import { Object } from "../../utils/overload";
import type { UnknownMapping } from "../../utils/type";
import type { PstEmailRecipient } from "../pst-extractor/type";
import type { ViewType } from "./setup";

export const LDAP_ORG = "/O=";
export const LDAP_ARBITRARY_SPLICE_CHAR = "O=";
export const COMMON_NAME_PST = "/CN=";
export const getDomain = (element: string): string =>
    element.toLowerCase().substring(element.indexOf("@"));

export const getLdapDomain = (ldap: string): string =>
    ldap
        .toLowerCase()
        .split("/")[1]
        ?.split(LDAP_ARBITRARY_SPLICE_CHAR.toLowerCase())[1] ?? "";

export const isLdap = (mail: string): boolean =>
    mail.toLowerCase().includes(LDAP_ORG.toLowerCase());

export const getRecipientFromDisplay = (
    display: string,
    recipients: PSTRecipient[]
): PstEmailRecipient[] =>
    display
        .split(";")
        .map((name) => name.trim())
        .filter((name) => name)
        .map((name) => {
            const found = recipients.find(
                (recipient) => recipient.displayName === name
            );
            return {
                email:
                    // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Handle empty string
                    (found?.smtpAddress || found?.emailAddress)?.toLowerCase(),
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Handle empty string
                name: found?.recipientDisplayName || found?.displayName || name,
            };
        });

type PSTMessageProps = {
    [P in keyof PSTMessage]: PSTMessage[P] extends
        | Date
        | bigint
        | boolean
        | number
        | string
        ? P
        : never;
}[keyof PSTMessage];

const PST_MESSAGE_PROPS = Object.getOwnPropertyNames(
    PSTMessage.prototype
) as PSTMessageProps[];

export interface ViewConfiguration {
    groupBy:
        | PSTMessageProps
        | UnknownMapping
        | keyof typeof builtInGroupByFunctions;
    type: ViewType;
}

type GroupByFunction = (email: PSTMessage) => string;

type BuiltInGroupByFunctionsType = "date:year" | "mail:domainAndLdap";
type PrefixedGroupKey = `_fn:${BuiltInGroupByFunctionsType}`;
export const builtInGroupByFunctions: Record<
    PrefixedGroupKey,
    GroupByFunction
> = {
    "_fn:date:year": (email) => {
        const year = email.messageDeliveryTime?.getFullYear();
        return year ? `${year}` : "?";
    },
    "_fn:mail:domainAndLdap": (email) =>
        isLdap(email.senderEmailAddress)
            ? getLdapDomain(email.senderEmailAddress)
            : getDomain(email.senderEmailAddress),
};

export interface ViewGroupFunction extends ViewConfiguration {
    groupByFunction: GroupByFunction;
}
export const resolveViewConfiguration = (
    viewConfig: ViewConfiguration
): ViewGroupFunction => {
    const groupByKey = viewConfig.groupBy;
    if (groupByKey in builtInGroupByFunctions) {
        return {
            ...viewConfig,
            groupByFunction:
                builtInGroupByFunctions[groupByKey as PrefixedGroupKey],
        };
    } else if (PST_MESSAGE_PROPS.includes(groupByKey as PSTMessageProps)) {
        return {
            ...viewConfig,
            groupByFunction: (email) =>
                String(email[groupByKey as PSTMessageProps]),
        };
    } else throw new Error(`Unknown "${groupByKey}" ViewConfiguration`);
};
