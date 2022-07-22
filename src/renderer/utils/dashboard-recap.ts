import type {
    PstElement,
    PstEmail,
    PstExtractTables,
    PstFolder,
} from "@common/modules/pst-extractor/type";
import { isPstEmail, isPstFolder } from "@common/modules/pst-extractor/type";
import { bytesToMegabytes } from "@common/utils";

export interface FolderListItem {
    id: string;
    name: string;
    type: string;
}

export const getPstListOfFolder = (pst: PstFolder[]): FolderListItem[] => {
    const folderList: FolderListItem[] = [];
    pst.forEach((folder) => {
        const { id, name, type, children } = folder;
        if (isPstFolder(folder)) {
            folderList.push({ id, name, type });
        }
        const childFolders = children?.filter(isPstFolder);
        if (childFolders) folderList.push(...getPstListOfFolder(childFolders));
    });
    return folderList;
};

export const getMailsByStatus = (
    ownerId: string,
    extractTables: PstExtractTables,
    type: "received" | "sent"
): PstEmail[] =>
    [...extractTables.emails.values()]
        .flat()
        .filter((mail) =>
            type === "sent"
                ? mail.from.email === ownerId
                : mail.from.email !== ownerId
        );

export const getMailsAttachementCount = (mails: PstEmail[]): number =>
    mails.reduce((prev, curr) => (prev += curr.attachmentCount), 0);

export const getMailsAttachementSize = (mails: PstEmail[]): number =>
    bytesToMegabytes(
        mails
            .map((mail) => mail.attachments)
            .filter((mail) => mail.length)
            .flat()
            .reduce((prev, curr) => (prev += curr.filesize), 0)
    );

export const getDeletedMails = (
    pstFile: PstElement,
    deletedFolderId: string
): PstElement => {
    let found: PstElement = {
        elementPath: "",
        id: "",
        name: "",
        size: 0,
        type: "folder",
    };

    const rec = (pst: PstElement) => {
        if (pst.id !== deletedFolderId) {
            pst.children?.forEach((child) => {
                rec(child);
            });
        } else return (found = pst);
    };

    rec(pstFile);
    return found;
};

export interface GetDeletedMailscount {
    deletedMailsAttachementSize: number;
    deletedMailsAttachmentCount: number;
    deletedMailsCount: number;
}

export const getDeletedMailsCount = (
    deletedMails: PstElement
): GetDeletedMailscount => {
    let deletedMailsAttachmentCount = 0;
    let deletedMailsCount = 0;
    let deletedMailsAttachementSize = 0;

    const rec = (pst: PstElement) => {
        if (isPstFolder(pst)) {
            pst.children?.forEach((child) => {
                rec(child);
            });
        } else if (isPstEmail(pst)) {
            deletedMailsAttachmentCount += pst.attachmentCount;
            deletedMailsCount++;
            deletedMailsAttachementSize += pst.attachments.reduce(
                (prev, curr) => prev + curr.filesize,
                0
            );
        }
    };

    rec(deletedMails);

    return {
        deletedMailsAttachementSize: bytesToMegabytes(
            deletedMailsAttachementSize
        ),
        deletedMailsAttachmentCount,
        deletedMailsCount,
    };
};
