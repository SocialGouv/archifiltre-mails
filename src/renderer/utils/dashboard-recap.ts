import type { PstExtractDatas } from "@common/modules/pst-extractor/type";
import { bytesToMegabytes } from "@common/utils";

export const getMailIdsByStatus = (
    ownerId: string,
    extractDatas: PstExtractDatas,
    type: "received" | "sent"
): string[] => {
    if (type === "sent") {
        return extractDatas.groups.senderMail.get(ownerId) ?? [];
    }
    return [...extractDatas.groups.senderMail.entries()]
        .filter(([email]) => email !== ownerId)
        .map(([, indexes]) => indexes)
        .flat();
};

export const getDeletedMailIds = (
    deletedFolderId: string,
    extractDatas: PstExtractDatas
): string[] =>
    [...extractDatas.groups.folder.entries()]
        .filter(([folderId]) => folderId === deletedFolderId)
        .map(([, indexes]) => indexes)
        .flat();

export const getMailsAttachmentCount = (
    mailIds: string[],
    extractDatas: PstExtractDatas
): number =>
    mailIds.reduce(
        (acc, mailId) =>
            acc + (extractDatas.attachments.get(mailId)?.length ?? 0),
        0
    );

export const getMailsAttachmentSize = (
    mailIds: string[],
    extractDatas: PstExtractDatas
): number =>
    bytesToMegabytes(
        mailIds
            .map((mailId) => extractDatas.attachments.get(mailId) ?? [])
            .flat()
            .reduce(
                (totalSize, attachment) => totalSize + attachment.filesize,
                0
            )
    );
