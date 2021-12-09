import type {
    PstContent,
    PstExtractTables,
} from "./../../common/modules/pst-extractor/type";

/**
 * Get total elements of a table like number of mails, attachments or contacts from a given PST.
 *
 * @param extractTables extractTables from pstExtractorService extract method.
 * @param table key of the extractTable: could be mails, attachments or contacts.
 */
export const getPstTotalElementByTable = (
    extractTables: PstExtractTables,
    table: keyof PstExtractTables
): number =>
    [...extractTables[table].values()].reduce(
        (previous: number, current): number => previous + current.length,
        0
    );

/**
 * Get all folder name from a given PST.
 *
 * @param pst the extracted PST.
 */
export const getAllPSTFolderName = (pst: PstContent): string[] =>
    pst.children[0]!.children!.map(({ name }) => name);

/**
 * Get the total emails counts of a given PST.
 *
 * @param pst the extracted PST.
 * @param folderName the folder name following user choice.
 */
export const getSpecificFolderTotalElements = (
    pst: PstContent,
    folderName: string
): number | undefined => {
    const rootFolder = pst.children[0]!.children!;
    const specificFolder = rootFolder.find(({ name }) => name === folderName);
    return specificFolder?.children?.length;
};
