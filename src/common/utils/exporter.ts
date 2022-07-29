import { mkdir, writeFile } from "fs/promises";
import { outputFile } from "fs-extra";
import { t } from "i18next";

import type { PstEmail, PstExtractTables } from "../modules/pst-extractor/type";
import type { SimpleObject } from "./type";

export const BACK_LINE = " \n";
export const EML_EXTENSION = ".eml";
export const EML_FROM = "From: "
export const EML_TO = "To: "
export const EML_SUBJECT = "Subject: "
export const EML_HEADERS = "X-Unset: "
export const EML_CONTENT_TYPE = "Content-Type: text/html"

/**
 * Format the given emails table into a "readable" JSON for exporters to use.
 */
export const formatEmailTable = (
    emailsTable: PstExtractTables["emails"]
): SimpleObject[] => {
    const tKeys = {
        attachmentCount: t("exporter.table.attachment-count"),
        attachmentsFilename: t("exporter.table.attachments.filename"),
        attachmentsFilesize: t("exporter.table.attachments.filesize"),
        bccEmail: t("exporter.table.bcc.email"),
        bccName: t("exporter.table.bcc.name"),
        ccEmail: t("exporter.table.cc.email"),
        ccName: t("exporter.table.cc.name"),
        contentText: t("exporter.table.content-text"),
        elementPath: t("exporter.table.element-path"),
        fromEmail: t("exporter.table.from.email"),
        fromName: t("exporter.table.from.name"),
        id: t("exporter.table.id"),
        receivedDate: t("exporter.table.received-date"),
        sentTime: t("exporter.table.send-time"),
        subject: t("exporter.table.subject"),
        tag: t("exporter.table.tag"),
        toEmail: t("exporter.table.to.email"),
        toName: t("exporter.table.to.name"),
    };

    return [...emailsTable.values()].flat(1).map((email) => ({
        [tKeys.id]: email.id,
        [tKeys.receivedDate]: email.receivedDate,
        [tKeys.sentTime]: email.sentTime,
        [tKeys.fromName]: email.from.name,
        [tKeys.fromEmail]: email.from.email ?? "",
        [tKeys.toName]: email.to.map((to) => to.name).join(","),
        [tKeys.toEmail]: email.to.map((to) => to.email).join(","),
        [tKeys.ccName]: email.cc.map((cc) => cc.name).join(","),
        [tKeys.ccEmail]: email.cc.map((cc) => cc.email).join(","),
        [tKeys.bccName]: email.bcc.map((bcc) => bcc.name).join(","),
        [tKeys.bccEmail]: email.bcc.map((bcc) => bcc.email).join(","),
        [tKeys.subject]: email.subject,
        [tKeys.attachmentCount]: email.attachementCount,
        [tKeys.attachmentsFilesize]: email.attachements
            .map((attachement) => attachement.filesize)
            .join(","),
        [tKeys.attachmentsFilename]: email.attachements
            .map((attachement) => attachement.filename)
            .join(","),
        [tKeys.contentText]: email.contentText,
        [tKeys.tag]: email.tag,
        [tKeys.elementPath]: email.elementPath,
    }));
};

const MAILS_TO_EXPORT = "mailsToExport";
export const getMarkedTagForExport = (
    deletedIDs: Set<string>,
    id: string
): string =>
    [...deletedIDs].includes(id)
        ? t("exporter.table.tag.delete")
        : t("exporter.table.tag.untag");

export const getMailsWithTag = (
    emails: PstExtractTables["emails"],
    deletedIds: Set<string>
): PstExtractTables["emails"] =>
    new Map<string, PstEmail[]>().set(
        MAILS_TO_EXPORT,
        [...emails.values()].flat().map((mail) => ({
            ...mail,
            tag: getMarkedTagForExport(deletedIds, mail.id),
        }))
    );

export const createDir = async (
    dirPath: string
): Promise<string | undefined> => {
    return mkdir(dirPath, { recursive: true });
};

export interface EmlFile {
    from?: string,
    to: string,
    isSent: number,
    subject: string,
    body: string
}

/**
 * Create a file with a parent wrapper folder and file name as a title.
 */
export const createEmlFile = async (
    filePath: string,
    fileContent: EmlFile
): Promise<void> => outputFile(filePath + EML_EXTENSION, generateEml(fileContent));

// TODO  EML format considéré comme un MIME Type donc pas besoin de librairie tierce pour le recréer. Attention aux headers.
/**
 * Generate an EML from the given object.
 *
 * @param {string} from
 * @param {string} to
 * @param {string} type
 * @param {number} isSent
 * @param {string} subject
 * @param {string} body
 */
export const generateEml = (
mailContent: EmlFile
): string => {
    const mailFrom = EML_FROM + mailContent.from + BACK_LINE;
    const mailTo = EML_TO + mailContent.to + BACK_LINE;
    const mailType = EML_CONTENT_TYPE + BACK_LINE;
    const mailHeadersSentState = EML_HEADERS + mailContent.isSent + BACK_LINE;
    const mailSubject = EML_SUBJECT + mailContent.subject + BACK_LINE;
    const mailBody = BACK_LINE + "<!DOCTYPE html><html><head></head><body style='background-color: black; color: red'><p>" + `${mailContent.body}<p></body></html>`

    return (
        mailFrom +
        mailTo +
        mailType +
        mailHeadersSentState +
        mailSubject +
        mailBody
    );
};
