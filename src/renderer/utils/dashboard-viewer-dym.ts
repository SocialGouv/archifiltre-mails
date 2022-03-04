import type {
    PstAttachement,
    PstElement,
    PstEmail,
    PstExtractTables,
} from "@common/modules/pst-extractor/type";
import { isPstEmail, isPstFolder } from "@common/modules/pst-extractor/type";
import { v4 as randomUUID } from "uuid";

import { setAttachmentPerLevel } from "../store/PstAttachmentCountStore";
import { setFileSizePerLevel } from "../store/PstFileSizeStore";
import {
    LDAP_ARBITRARY_SPLICE_CHAR,
    LDAP_ORG,
    MAX_TRESHOLD,
    RATIO_FROM_MAX,
} from "./constants";

interface BaseViewerObject<TId extends string> {
    id: TId;
    name: string;
    size: number;
    value: string;
    ids: string[];
}

export type ViewerObjectChild = Omit<BaseViewerObject<string>, "value"> &
    Record<string, BaseViewerObject<string>[keyof BaseViewerObject<string>]>;

export interface DefaultViewerObject<TId extends string>
    extends BaseViewerObject<TId> {
    children: ViewerObjectChild[];
}

export type DomainViewerObject = DefaultViewerObject<"root">;

export type CorrespondantViewerObject<TId extends string> =
    DefaultViewerObject<TId>;

export type YearViewerObject<TId extends string> = DefaultViewerObject<TId>;
export interface MailViewerObject<TId extends string>
    extends DefaultViewerObject<TId> {
    email: PstEmail;
}

export type ViewerObject<TId extends string> =
    | CorrespondantViewerObject<TId>
    | DomainViewerObject
    | MailViewerObject<TId>
    | YearViewerObject<TId>;

type Correspondant = [name: string, count: number, ids: string[]];
type Year = [year: number, count: number, ids: string[]];

export const isMailViewerObject = <TId extends string>(
    viewerObject: ViewerObject<TId>
): viewerObject is MailViewerObject<TId> =>
    !!(viewerObject as MailViewerObject<TId>).email;

export const createBase = <TId extends string>(
    id: TId
): BaseViewerObject<TId> => ({
    id,
    ids: [],
    name: "root",
    size: 0.0001,
    value: "size",
});

export const getInitialTotalMail = (extractTables: PstExtractTables): number =>
    [...Object(extractTables.emails).values()].flat().length;

export const getInitialTotalAttachements = (
    extractTables: PstExtractTables
): number =>
    [...Object(extractTables.emails).values()]
        .flat()
        .reduce(
            (acc: number, { attachementCount }: { attachementCount: number }) =>
                acc + attachementCount,
            0
        ) as number;

export const getInititalTotalFileSize = (
    extractTables: PstExtractTables
): number =>
    getFileSizeByMail(
        [
            ...Object(extractTables.attachements).values(),
        ].flat() as PstAttachement[]
    );

export const getTotalLevelMail = (elements: ViewerObject<string>): number =>
    elements.children.flat().reduce((acc, curr) => acc + curr.size, 0);

export const getFileSizeByMail = (attachments: PstAttachement[]): number =>
    attachments.reduce((acc: number, { filesize }) => {
        return acc + filesize;
    }, 0);

export const createBaseMail = (): PstEmail => ({
    attachementCount: 0,
    attachements: [],
    bcc: [],
    cc: [],
    contentHTML: "",
    contentRTF: "",
    contentText: "",
    elementPath: "",
    from: {
        name: "",
    },
    id: "",
    isFromMe: false,
    name: "",
    receivedDate: new Date(),
    sentTime: new Date(),
    size: 1,
    subject: "",
    to: [],
    type: "email",
});

export const createDomain = (
    domains: Record<string, [number, string[]]>
): DomainViewerObject => {
    const children = Object.entries(domains).map(([key, [value, ids]]) => {
        return {
            id: randomUUID(),
            ids,
            [key]: value,
            name: key,
            size: value,
        };
    });

    return {
        children,
        ...createBase("root"),
    };
};

export const getDomain = (element: string): string =>
    element.substring(element.indexOf("@"));

const getMailTreshold = (
    base: Map<string, [number, string[]]> | Record<string, [number, string[]]>
): number => {
    const maxMail = (
        base instanceof Map ? [...base.values()] : Object.values(base)
    ).reduce((acc, [cur]) => Math.max(acc, cur), 0);

    return Math.min(Math.ceil(maxMail * (RATIO_FROM_MAX / 100)), MAX_TRESHOLD);
};

export const getLdapDomain = (ldap: string): string =>
    ldap.split("/")[1]?.split(LDAP_ARBITRARY_SPLICE_CHAR)[1] ?? "";

export const isLdap = (mail: string): boolean => mail.includes(LDAP_ORG);

export const isLdapDomain = (domain: string): boolean => !domain.includes("@");

// ### GETTER ###
export const getAggregatedDomains = (
    initPst: PstElement
): Record<string, [number, string[]]> => {
    const domains = new Map<string, [count: number, ids: string[]]>();

    const recursivelyFindProp = (pst: PstElement) => {
        if (isPstFolder(pst)) {
            pst.children?.forEach((child) => {
                recursivelyFindProp(child);
            });
        } else if (isPstEmail(pst) && pst.from.email) {
            const emails = new Set([pst.from.email]);
            emails.forEach((email) => {
                const domainKey = isLdap(email)
                    ? getLdapDomain(email)
                    : getDomain(email);

                const [count, ids] = domains.get(domainKey) ?? [0, []];
                domains.set(domainKey, [count + 1, [...ids, pst.id]]);
            });
        }
    };

    recursivelyFindProp(initPst);

    /* eslint-disable @typescript-eslint/naming-convention */
    const orderByValues = <K, V extends [number, string[]]>(
        m: Map<K, V>
    ): Map<K, V> =>
        new Map([...m.entries()].sort(([, [va]], [, [vb]]) => vb - va));

    const toRecord = <K extends string, V>(m: Map<K, V>): Record<K, V> =>
        [...m.entries()].reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v }),
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
            {} as Record<K, V>
        );
    /* eslint-enable @typescript-eslint/naming-convention */

    // THRESHOLD LOGIC TO KEEP
    // const threshold = getMailTreshold(domains);
    // const thresholdify = (
    //     m: Map<string, [number, string[]]>
    // ): Map<string, [number, string[]]> => {
    //     const out = new Map<string, [number, string[]]>();
    //     for (const [k, [count, ids]] of m) {
    //         if (count < threshold) {
    //             const domainOther = out.get(TRESHOLD_KEY) ?? [0, []];
    //             out.set(TRESHOLD_KEY, [
    //                 count + domainOther[0],
    //                 [...ids, ...domainOther[1]],
    //             ]);
    //         } else out.set(k, [count, ids]);
    //     }

    //     return out;
    // };

    // const THERESULT = orderByValues(thresholdify(domains));

    return toRecord(orderByValues(domains));
};

export const getUniqueCorrespondantsByDomain = (
    initPst: PstElement,
    domain: string
): Correspondant[] => {
    const correspsFound: Correspondant[] = [];
    let attachementPerLevel = 0;
    let fileSizePerLevel = 0;
    const recursivelyFindCorresp = (pst: PstElement) => {
        if (isPstFolder(pst)) {
            pst.children?.forEach((child) => {
                recursivelyFindCorresp(child);
            });
        } else if (
            isPstEmail(pst) &&
            pst.from.email &&
            (getDomain(pst.from.email) === domain ||
                getLdapDomain(pst.from.email) === domain)
        ) {
            fileSizePerLevel += getFileSizeByMail(pst.attachements);

            attachementPerLevel += pst.attachementCount;
            correspsFound.push([pst.from.name, 1, [pst.id]]);
        }
    };
    recursivelyFindCorresp(initPst);
    setAttachmentPerLevel(attachementPerLevel);
    setFileSizePerLevel(fileSizePerLevel);

    const accumulatedCorresps = correspsFound.reduce<typeof correspsFound>(
        (acc, [name, count, ids]) => {
            const found = acc.find(([nameToTest]) => nameToTest === name);
            if (found) {
                found[1] += count;
                found[2].push(...ids);
            } else acc.push([name, count, ids]);
            return acc;
        },
        []
    );

    return accumulatedCorresps.sort(([, v1], [, v2]) => v2 - v1);
};

export const getYearByCorrespondants = (
    initPst: PstElement,
    correspondant: string
): Year[] => {
    const yearsFound: Year[] = [];
    let attachementPerLevel = 0;
    let fileSizePerLevel = 0;
    const recursivelyFindYear = (pst: PstElement) => {
        if (isPstFolder(pst)) {
            pst.children?.forEach((child) => {
                recursivelyFindYear(child);
            });
        } else if (
            isPstEmail(pst) &&
            pst.receivedDate &&
            pst.from.name === correspondant
        ) {
            attachementPerLevel += pst.attachementCount;
            fileSizePerLevel += getFileSizeByMail(pst.attachements);

            yearsFound.push([pst.receivedDate.getFullYear(), 1, [pst.id]]);
        }
    };
    recursivelyFindYear(initPst);
    setAttachmentPerLevel(attachementPerLevel);
    setFileSizePerLevel(fileSizePerLevel);

    const accumulatedYears = yearsFound.reduce<typeof yearsFound>(
        (acc, [year, count, ids]) => {
            const found = acc.find(([yearToTest]) => yearToTest === year);
            if (found) {
                found[1] += count;
                found[2].push(...ids);
            } else acc.push([year, count, ids]);
            return acc;
        },
        []
    );

    return accumulatedYears.sort(([, v1], [, v2]) => v2 - v1);
};

export const getMailsByDym = (
    initPst: PstElement,
    domain: string,
    correspondant: string,
    year: number
): PstEmail[] => {
    const mailsFound: PstEmail[] = [];
    let attachementPerLevel = 0;
    let fileSizePerLevel = 0;

    const recursivelyFindMail = (pst: PstElement) => {
        if (isPstFolder(pst)) {
            pst.children?.forEach((child) => {
                recursivelyFindMail(child);
            });
        } else if (
            isPstEmail(pst) &&
            pst.from.email &&
            pst.receivedDate &&
            pst.receivedDate.getFullYear() === year &&
            pst.from.name === correspondant &&
            (getDomain(pst.from.email) === domain ||
                getLdapDomain(pst.from.email) === domain)
        ) {
            attachementPerLevel += pst.attachementCount;
            fileSizePerLevel += getFileSizeByMail(pst.attachements);

            mailsFound.push(pst);
        }
    };
    recursivelyFindMail(initPst);
    setAttachmentPerLevel(attachementPerLevel);
    setFileSizePerLevel(fileSizePerLevel);

    return mailsFound.sort(
        (a, b) =>
            (a.receivedDate?.valueOf() ?? 0) - (b.receivedDate?.valueOf() ?? 0)
    );
};

// ### CACHE ###
const correspondantCache = new Map<string, CorrespondantViewerObject<string>>();
const yearsCache = new Map<string, YearViewerObject<string>>();
const mailsCache = new Map<string, unknown>();

export const createCorrespondants = <TId extends string>(
    correspondants: Correspondant[],
    id: TId
): CorrespondantViewerObject<TId> => {
    if (!correspondantCache.has(id)) {
        const children = correspondants.map(([name, value, ids]) => {
            return {
                id: randomUUID(),
                ids,
                name,
                size: value,
                value,
            };
        });

        correspondantCache.set(id, {
            children,
            ...createBase(id),
        });
    }

    return correspondantCache.get(id) as CorrespondantViewerObject<TId>;
};

export const createYears = <TId extends string>(
    years: Year[],
    id: TId
): YearViewerObject<TId> => {
    if (!yearsCache.has(id)) {
        const children = years.map(([year, value, ids]) => ({
            id: randomUUID(),
            ids,
            name: year.toString(),
            size: value,
            value,
        }));

        yearsCache.set(id, {
            children,
            ...createBase(id),
        });
    }

    return yearsCache.get(id) as YearViewerObject<TId>;
};

export const createMails = <TId extends string>(
    mails: PstEmail[],
    id: TId
): MailViewerObject<TId> => {
    if (!mailsCache.get(id)) {
        const children = Object.entries(mails).map(([, value]) => {
            const { name, size, ...email } = value;
            return {
                email,
                id: randomUUID(),
                name,
                size,
                value: name,
            };
        });

        mailsCache.set(id, {
            children,
            ...createBase(id),
        });
    }
    return mailsCache.get(id) as MailViewerObject<TId>;
};
