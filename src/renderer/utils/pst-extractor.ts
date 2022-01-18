import type {
    PstContent,
    PstElement,
    PstEmail,
    PstExtractTables,
    PstFolder,
} from "@common/modules/pst-extractor/type";
import { isPstEmail, isPstFolder } from "@common/modules/pst-extractor/type";

import { ARBITRARY_FLAT_LEVEL } from "./constants";

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

// ################################################################################
// ################################################################################
// ################################################################################
// ################################################################################
// ################################################################################
// ################################################################################
// ##########################     TESTING PURPOSE     #############################
// ################################################################################
// ################################################################################
// ################################################################################
// ################################################################################
// ################################################################################
// ################################################################################

export const getDomain = (element: string): string =>
    element.substring(element.indexOf("@"));

export const findAllMailAddresses = (pst: PstElement): string[] => {
    const result: string[] = [];
    const recursivelyFindProp = (_pst: PstElement) => {
        if (isPstFolder(_pst)) {
            _pst.children?.forEach((child) => {
                recursivelyFindProp(child);
            });
        } else if (isPstEmail(_pst) && _pst.from.email) {
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
    return result;
};
