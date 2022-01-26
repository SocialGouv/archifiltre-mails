/* eslint-disable @typescript-eslint/require-array-sort-compare */
/* eslint-disable @typescript-eslint/naming-convention */
import type {
    PstContent,
    PstElement,
    PstEmail,
    PstExtractTables,
    PstFolder,
} from "@common/modules/pst-extractor/type";
import { isPstEmail, isPstFolder } from "@common/modules/pst-extractor/type";
import type { Any } from "@common/utils/type";
import { randomUUID } from "crypto";

import {
    ARBITRARY_FLAT_LEVEL,
    MAX_TRESHOLD,
    ORG_UNIT_PST,
    RATIO_FROM_MAX,
    TRESHOLD_KEY,
} from "./constants";

/**
 * Get the total received emails counts of a given PST.
 */
export const getPstTotalReceivedMails = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails.values()]
            .flat(ARBITRARY_FLAT_LEVEL) // TODO magic
            .filter((mail) => !mail.isFromMe).length;
    }
    return 0;
};

/**
 * Get the total sent emails attachements counts of a given PST.
 */
export const getPstTotalReceivedAttachments = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails.values()]
            .flat(ARBITRARY_FLAT_LEVEL) // TODO no magic number, should be a parameter
            .filter((mail) => !mail.isFromMe && typeof mail !== "string")
            .reduce((prev, current) => {
                return prev + current.attachementCount;
            }, 0);
    }
    return 0;
};

export const getPstTotalSentMails = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails.values()]
            .flat(ARBITRARY_FLAT_LEVEL) // TODO no magic number, should be a parameter
            .filter((mail) => mail.isFromMe).length;
    }
    return 0;
};

export const getPstTotalSentAttachments = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails.values()]
            .flat(ARBITRARY_FLAT_LEVEL) // TODO no magic number, should be a parameter
            .filter((mail) => mail.isFromMe) // no needs to check if mail is type of string because we allow only objects in the verification
            .reduce((prev, current) => {
                return prev + current.attachementCount;
            }, 0);
    }
    return 0;
};

/**
 * Get the total deleted emails counts of a given PST.
 */
export const getPstTotalDeletedMails = (
    pst: PstContent,
    deletedFolderName: string
): number | undefined => {
    //TODO: /!\ Attention /!\, c'est un hack qui reste à vérifier.
    const rootFolder = pst.children[0]!.children!;
    const specificFolder = rootFolder.filter(
        ({ name }) => name === deletedFolderName
    );
    return specificFolder[0]?.children?.length;
};

/**
 * Get all folder name from a given PST.
 */
export const getPSTRootFolderList = (pst: PstContent): string[] =>
    pst.children[0]!.children!.map(({ name }) => name);

export interface PstComputedChild {
    id: string;
    name: string;
    size: number;
    attachementCount: number;
}

export interface PstComputed {
    id: string;
    name: string;
    size: number;
    value: string;
    children: PstComputedChild[];
}

//TODO: comment
/**
 * Get the next PST child level when navigates through the archive viewer.
 * @param pst the pst archive
 * @param nodeId the current clicked node id
 * @returns
 */
export const computedRoot = (pst: PstFolder, nodeId: string): PstComputed => {
    const root = pst.children;

    const children: PstComputedChild[] =
        root?.map((node) =>
            isPstEmail(node)
                ? node
                : ({
                      attachementCount: 0,
                      id: node.id,
                      name: node.name,
                      size: node.size,
                  } as PstComputedChild)
        ) ?? [];

    const newRoot: PstComputed = {
        children,
        id: nodeId,
        name: "root",
        size: 0.0001,
        value: "size",
    };

    return newRoot;
};

const findDeeplyNestedElement = (
    objects: PstElement[] | undefined,
    id: string | undefined
): PstElement | undefined => {
    for (const obj of objects ?? []) {
        if (obj.id == id) return obj;
        const obj1 = findDeeplyNestedElement(obj.children, id);
        if (obj1) return obj1;
    }
};

/**
 * Get first child level for a parent with an id.
 */
export const findPstChildById = (
    pst: PstContent | undefined,
    id: string | undefined
): PstElement | undefined => {
    const foundChild = findDeeplyNestedElement(pst?.children, id);

    return foundChild;
};

export const isToDeleteFolder = (id: string, deleteIds: string[]): boolean =>
    deleteIds.includes(id);

export const isToKeepFolder = (id: string, keepIds: string[]): boolean =>
    keepIds.includes(id);

export const getPstTotalContacts = (
    contactTable: Map<string, string[]> | undefined
): number | undefined => {
    if (contactTable) {
        return [...contactTable].flat(ARBITRARY_FLAT_LEVEL).length;
    }
};
export const getPstTotalMails = (
    mailsTable: Map<string, PstEmail[]> | undefined
): number | undefined => {
    if (mailsTable) {
        return [...mailsTable].flat(ARBITRARY_FLAT_LEVEL).length;
    }
};

export const getPstMailsPercentage = (
    current: number,
    total: Map<string, PstEmail[]> | undefined
): string => {
    const totalMails = getPstTotalMails(total);
    if (totalMails) {
        return ((current / totalMails) * 100).toFixed(1);
    }
    return "0";
};

// ###########
// TODO: move domains/year/mails utils in dedicated folder
// TODO: respect DRY pattern on "domains/year/mails" utils
// ###########

export const createBase = (id?: string) => ({
    id: id ?? "root",
    name: "root",
    size: 0.0001,
    value: "size",
});

export const createBaseMail = (): PstEmail => ({
    attachementCount: 0,
    attachements: [],
    bcc: [],
    cc: [],
    contentHTML: "",
    contentRTF: "",
    contentText: "",
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

export const getDomain = (element: string): string =>
    element.substring(element.indexOf("@"));

export const getMailTreshold = (
    base: Map<string, number> | Record<string, number>
): number => {
    const maxMail = (
        base instanceof Map ? [...base.values()] : Object.values(base)
    ).reduce((acc, cur) => Math.max(acc, cur), 0);

    return Math.min(Math.ceil(maxMail * (RATIO_FROM_MAX / 100)), MAX_TRESHOLD);
};

export const findAllMailAddresses = (
    pst: PstElement
): Record<string, number> => {
    const result: string[] = [];
    const mailCountPerMail = new Map<string, number>();
    const mailCountPerDomain = new Map<string, number>();
    const recursivelyFindProp = (_pst: PstElement) => {
        if (isPstFolder(_pst)) {
            _pst.children?.forEach((child) => {
                recursivelyFindProp(child);
            });
        } else if (isPstEmail(_pst) && _pst.from.email) {
            const emails = new Set([
                _pst.from.email,
                ...(["to", "cc", "bcc"] as const)
                    .map(
                        (theKey) =>
                            _pst[theKey]
                                .map((value) => value.email)
                                .filter(Boolean) as string[]
                    )
                    .flat(),
            ]);
            emails.forEach((email) => {
                const emailKey = email.includes(ORG_UNIT_PST)
                    ? "Same_LD"
                    : email;
                const currentMailCount = mailCountPerMail.get(emailKey) ?? 0;
                mailCountPerMail.set(emailKey, currentMailCount + 1);

                const domainKey = email.includes(ORG_UNIT_PST)
                    ? "Same_LD"
                    : getDomain(email);
                const currentDomainCount =
                    mailCountPerDomain.get(domainKey) ?? 0;
                mailCountPerDomain.set(domainKey, currentDomainCount + 1);
            });

            result.push(
                _pst.from.email,
                ...(["to", "cc", "bcc"] as const)
                    .map(
                        (theKey) =>
                            _pst[theKey]
                                .map((value) => value.email)
                                .filter(Boolean) as string[]
                    )
                    .flat()
            );
        }
    };

    recursivelyFindProp(pst);

    const orderByValues = <K, V extends number>(m: Map<K, V>): Map<K, V> =>
        new Map([...m.entries()].sort(([, va], [, vb]) => vb - va));

    const orderByKeys = <K, V extends number>(m: Map<K, V>): Map<K, V> =>
        new Map([...m.entries()].sort(([ka], [kb]) => (ka < kb ? 1 : -1)));

    const toRecord = <K extends string, V>(m: Map<K, V>): Record<K, V> =>
        [...m.entries()].reduce(
            (acc, [k, v]) => ({ ...acc, [k]: v }),
            // eslint-disable-next-line @typescript-eslint/prefer-reduce-type-parameter
            {} as Record<K, V>
        );
    // threshold
    const threshold = getMailTreshold(mailCountPerDomain);
    const thresholdify = (m: Map<string, number>): Map<string, number> => {
        const out = new Map<string, number>();
        for (const [k, v] of m) {
            if (v < threshold) {
                out.set(TRESHOLD_KEY, v + (out.get(TRESHOLD_KEY) ?? 0));
            } else out.set(k, v);
        }

        return out;
    };

    const THERESULT = orderByValues(thresholdify(mailCountPerDomain));

    return toRecord(THERESULT);
};

// export const getAllDomainsByAddresses = (
//     uniqueAddresses: string[]
// ): (string | undefined)[] =>
//     uniqueAddresses
//         .map((element) => {
//             if (element.includes(ORG_UNIT_PST)) {
//                 // TODO: handle "/DC"
//                 return "Same LDAP";
//             }
//             if (element.indexOf("@")) {
//                 return getDomain(element);
//             }
//         })
//         .sort();

// export const getDuplicatedDomainsCount = (
//     domains: (string | undefined)[]
// ): Record<string, number> => {
//     return (domains.filter(Boolean) as string[]).reduce<Record<string, number>>(
//         (acc, value) => ({
//             ...acc,
//             [value]: (acc[value] ?? 0) + 1,
//         }),
//         {}
//     );
// };

// export const getAggregatedDomainsCount = (
//     duplicatedDomainsCount: Record<string, number>
// ): Record<string, number> => {
//     const treshold = getMailTreshold(duplicatedDomainsCount);

//     return Object.entries(duplicatedDomainsCount).reduce<
//         Record<string, number>
//     >(
//         (acc, [email, count]) => {
//             if (count > treshold) {
//                 acc[email] = count;
//             } else acc.__others += count;
//             return acc;
//         },
//         { __others: 0 }
//     );
// };

export const findUniqueCorrespondantsByDomain = (
    pst: PstElement,
    domain: string
): string[] => {
    const result: string[] = [];
    const _result: Any = [];
    const recursivelyFindProp = (_pst: PstElement) => {
        if (isPstFolder(_pst)) {
            _pst.children?.forEach((child) => {
                recursivelyFindProp(child);
            });
        } else if (
            isPstEmail(_pst) &&
            _pst.from.email &&
            getDomain(_pst.from.email) === domain
        ) {
            result.push(_pst.from.name); // TODO: est-ce bien ce que l'on veut

            _result.push({ name: _pst.from.name, value: 1 });
        }
    };
    recursivelyFindProp(pst);

    const output = _result.reduce((acc, current) => {
        const name = current.name;
        const found = acc.find((elem) => {
            return elem.name === name;
        });
        if (found) found.value += current.value;
        else acc.push(current);
        return acc;
    }, []);

    return output;
};

export const findYearByCorrespondants = (
    pst: PstElement,
    correspondant: string
): number[] => {
    const _result: Any = [];

    const recursivelyFindProp = (_pst: PstElement) => {
        if (isPstFolder(_pst)) {
            _pst.children?.forEach((child) => {
                recursivelyFindProp(child);
            });
        } else if (
            isPstEmail(_pst) &&
            _pst.receivedDate &&
            _pst.from.name === correspondant
        ) {
            _result.push({ date: _pst.receivedDate.getFullYear(), value: 1 });
        }
    };
    recursivelyFindProp(pst);

    const output = _result.reduce((acc, current) => {
        const date = current.date;
        const found = acc.find((elem) => {
            return elem.date === date;
        });
        if (found) found.value += current.value;
        else acc.push(current);
        return acc;
    }, []);

    return output;
};

export const findMailsByDomainCorrespondantAndYear = (
    pst: PstElement,
    domain: string,
    correspondant: string,
    year: number
): PstEmail[] => {
    const result: PstEmail[] = [];
    const recursivelyFindProp = (_pst: PstElement) => {
        if (isPstFolder(_pst)) {
            _pst.children?.forEach((child) => {
                recursivelyFindProp(child);
            });
        } else if (
            isPstEmail(_pst) &&
            _pst.from.email &&
            _pst.receivedDate &&
            getDomain(_pst.from.email) === domain &&
            _pst.receivedDate.getFullYear() === year &&
            _pst.from.name === correspondant
        ) {
            result.push(_pst);
        }
    };
    recursivelyFindProp(pst);

    return result;
};

export const createDomain = (domains: Record<string, number>, id: string) => {
    const children = Object.entries(domains).map(([key, value]) => {
        return {
            id: randomUUID(),
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

const correspondantCache = new Map<string, unknown>();

// export const createCorrespondants = (correspondants: string[], id: string) => {
//     if (!correspondantCache.has(id)) {
//         const children = Object.entries(correspondants).map(([key, value]) => {
//             return {
//                 id: randomUUID(),
//                 [key]: value,
//                 name: value,
//                 size: 1, // TODO: check coherence : if we need the volume, 1 is not accurate
//             };
//         });

//         correspondantCache.set(id, {
//             children,
//             ...createBase(id),
//         });
//     }
//     return correspondantCache.get(id);
// };
export const createCorrespondants = (correspondants: string[], id: string) => {
    if (!correspondantCache.has(id)) {
        const children = correspondants.map((correspondant) => {
            return {
                id: randomUUID(),
                name: correspondant.name,
                size: correspondant.value, // TODO: check coherence : if we need the volume, 1 is not accurate
            };
        });

        correspondantCache.set(id, {
            children,
            ...createBase(id),
        });
    }
    return correspondantCache.get(id);
};

const yearsCache = new Map<string, unknown>();

export const createYears = (years: number[], id: string) => {
    if (!yearsCache.has(id)) {
        const children = years.map((year) => ({
            id: randomUUID(),
            name: year.date,
            size: year.value,
        }));

        yearsCache.set(id, {
            children,
            ...createBase(id),
        });
    }

    return yearsCache.get(id);
};

const mailsCache = new Map<string, unknown>();

export const createMails = (mails: PstEmail[], id: string) => {
    if (!mailsCache.get(id)) {
        const children = Object.entries(mails).map(([, value]) => {
            return {
                id: value.id,
                name: value.name,
                size: value.size,
                value: value.name,
            };
        });

        mailsCache.set(id, {
            children,
            ...createBase(id),
        });
    }
    return mailsCache.get(id);
};
