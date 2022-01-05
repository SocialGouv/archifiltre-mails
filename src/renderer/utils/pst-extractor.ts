import type {
    PstContent,
    PstEmail,
    PstExtractTables,
    PstFolder,
} from "./../../common/modules/pst-extractor/type";

/**
 * Get the total received emails counts of a given PST.
 *
 * @param extractTables the extracted PST tables.
 *  @returns total number of received mails
 */
export const getPstTotalReceivedMails = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails]
            .flat(9)
            .filter((mail) => !mail.isFromMe).length;
    }
    return 0;
};

/**
 * Get the total sent emails attachements counts of a given PST.
 *
 * @param extractTables the extracted PST tables.
 *  @returns total number of sent mails attachements
 */
export const getPstTotalReceivedAttachments = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails]
            .flat(9) // magic number
            .filter((mail) => !mail.isFromMe && typeof mail !== "string")
            .reduce((prev, current) => {
                return prev + current.attachementCount;
            }, 0);
    }
    return 0;
};

/**
 * Get the total sent emails counts of a given PST.
 *
 * @param extractTables the extracted PST tables.
 *  @returns total number of sent mails
 */
export const getPstTotalSentMails = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails].flat(9).filter((mail) => mail.isFromMe)
            .length;
    }
    return 0;
};

/**
 * Get the total sent emails attachements counts of a given PST.
 *
 * @param extractTables the extracted PST tables.
 *  @returns total number of sent mails attachements
 */
export const getPstTotalSentAttachments = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails]
            .flat(9) // magic number
            .filter((mail) => mail.isFromMe) // no needs to check if mail is type of string because we allow only objects in the verification
            .reduce((prev, current) => {
                return prev + current.attachementCount;
            }, 0);
    }
    return 0;
};

/**
 * Get the total deleted emails counts of a given PST.
 *
 * @param pst the extracted PST.
 * @param deletedFolderName the folder name following user choice.
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
 *
 * @param pst the extracted PST.
 */
export const getPSTRootFolderList = (pst: PstContent): string[] =>
    pst.children[0]!.children!.map(({ name }) => name);

// domaine > années > mails

export type PstComputedChildren = {
    id: string;
    name: string;
    size: number;
    attachementCount: number;
}[];

export interface PstComputed {
    id: string;
    name: string;
    size: number;
    value: string;
    children: PstComputedChildren;
}

export const computedRoot = (pst: PstContent): PstComputed => {
    const root = pst.children;

    const children: PstComputedChildren = root.map((node) => ({
        attachementCount: node.attachementCount,
        from: node.from,
        id: node.id,
        name: node.name,
        receivedDate: node.receivedDate,
        sentTime: node.sentTime,
        size: node.size,
    }));

    const newRoot: PstComputed = {
        children,
        id: "rootId",
        name: "root",
        size: 0.0001,
        value: "size",
    };

    return newRoot;
};

const findDeeplyNestedElement = (
    objects: PstFolder[] | undefined,
    id: string | undefined
): unknown => {
    for (const obj of objects ?? []) {
        if (obj.id == id) return obj;
        const obj1 = findDeeplyNestedElement(obj.children, id);
        if (obj1) return obj1;
    }
};

/**
 * Get first child level for a parent with an id.
 *
 * @param pst the extracted PST.
 * @param id the id of the wanted child PST.
 */
export const findPstChildById = (
    pst: PstContent | undefined,
    id: string | undefined
): unknown => {
    const foundChild = findDeeplyNestedElement(pst?.children, id);

    return foundChild;
};

export const getPstTotalContacts = (
    contactTable: Map<string, string[]> | undefined
): number | undefined => {
    if (contactTable) {
        return [...contactTable].flat(9).length;
    }
};
export const getPstTotalMails = (
    mailsTable: Map<string, PstEmail[]> | undefined
): number | undefined => {
    if (mailsTable) {
        return [...mailsTable].flat(9).length;
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
