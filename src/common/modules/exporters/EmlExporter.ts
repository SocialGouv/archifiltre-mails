import { mkdir } from "fs/promises";
import { outputFile } from "fs-extra";
import path from "path";

import type { PstElement } from "./../pst-extractor/type";
import { isPstEmail } from "./../pst-extractor/type";
import type { PstExporter } from "./Exporter";

interface EmlFile {
    body: string;
    from: string;
    isSent: number;
    subject: string;
    to: string;
}

const BACK_LINE = " \n";
const EML_EXTENSION = ".eml";
const EML_FROM = "From: ";
const EML_TO = "To: ";
const EML_SUBJECT = "Subject: ";
const EML_HEADERS = "X-Unset: ";
const EML_CONTENT_TYPE = "Content-Type: text/html";

/**
 * Export PST to EML archive.
 */
export const emlExporter: PstExporter = {
    async export<T extends PstElement>(obj: T, dest: string) {
        const exportEml = async (pst: PstElement) => {
            for (const child of pst.children ?? []) {
                if (isPstEmail(child)) {
                    const wrapPath = path.join(
                        dest,
                        child.elementPath,
                        child.subject,
                        child.subject
                    );

                    const mailContent: EmlFile = {
                        body: child.contentText
                            .replaceAll("\n", "")
                            .replaceAll("\r", ""),
                        from: child.from.email ?? "[unknown]",
                        isSent: child.isFromMe ? 0 : 1,
                        subject: child.subject,
                        to: child.to
                            .map((recipient) => recipient.email)
                            .join(" "),
                    };

                    await createEmlFile(wrapPath, mailContent);
                } else {
                    const folderPath = path.join(dest, child.elementPath);
                    await mkdir(folderPath, { recursive: true });
                    await exportEml(child);
                }
            }
        };

        await exportEml(obj);
    },
};

/**
 * Create a file with a parent wrapper folder and file name as a title.
 */
const createEmlFile = async (filePath: string, fileContent: EmlFile): pvoid =>
    outputFile(filePath + EML_EXTENSION, generateEml(fileContent));

/**
 * Generate an EML from the given object.
 */
const generateEml = (mailContent: EmlFile): string => {
    const mailFrom = EML_FROM + mailContent.from + BACK_LINE;
    const mailTo = EML_TO + mailContent.to + BACK_LINE;
    const mailType = EML_CONTENT_TYPE + BACK_LINE;
    const mailHeadersSentState = `${EML_HEADERS}${mailContent.isSent}${BACK_LINE}`;
    const mailSubject = EML_SUBJECT + mailContent.subject + BACK_LINE;
    const mailBody =
        `${BACK_LINE}<!DOCTYPE html><html><head></head><body style='background-color: black; color: red'><p>` +
        `${mailContent.body}<p></body></html>`;

    return (
        mailFrom +
        mailTo +
        mailType +
        mailHeadersSentState +
        mailSubject +
        mailBody
    );
};
