import type {
    AdditionalDatas,
    GroupType,
    PstAttachment,
    PstMailIndexEntries,
} from "../pst-extractor/type";

export interface WorkFile {
    additionalDatas: AdditionalDatas;
    attachments: [string, PstAttachment[]][];
    groups: Record<GroupType, [string, string[]][]>;
    indexes: PstMailIndexEntries;
    uncachedAdditionalDatas: UncachedAdditionalDatas;
}

export interface UncachedAdditionalDatas {
    deleteIds: string[];
    deletedFolderId: string;
    exportWorkId: string;
    keepIds: string[];
    originalPath: string;
    ownerId: string;
}
