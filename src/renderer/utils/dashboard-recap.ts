import type {
    PstContent,
    PstEmail,
    PstExtractTables,
} from "@common/modules/pst-extractor/type";

export const getPstTotalReceivedMails = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails.values()]
            .flat()
            .filter((mail) => !mail.isFromMe).length;
    }
    return 0;
};

export const getPstTotalReceivedAttachments = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails.values()]
            .flat()
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
            .flat()
            .filter((mail) => mail.isFromMe).length;
    }
    return 0;
};

export const getPstTotalSentAttachments = (
    extractTables: PstExtractTables | undefined
): number => {
    if (extractTables) {
        return [...extractTables.emails.values()]
            .flat()
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

export const getPstTotalContacts = (
    contactTable: Map<string, string[]> | undefined
): number | undefined => {
    if (contactTable) {
        return [...contactTable].flat().length;
    }
};
export const getPstTotalMails = (
    mailsTable: Map<string, PstEmail[]> | undefined
): number | undefined => {
    if (mailsTable) {
        return [...mailsTable].flat().length;
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
