import type { PstContent } from "@common/modules/pst-extractor/type";

/**
 * Get all folder name from a given PST.
 */
export const getPstFolderList = (pst: PstContent): string[] =>
    pst.children[0]!.children!.map(({ name }) => name);
