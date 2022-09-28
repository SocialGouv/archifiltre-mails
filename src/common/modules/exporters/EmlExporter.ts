import { emlStringify } from "@socialgouv/archimail-pst-extractor";
import { mkdir } from "fs/promises";
import { EOL } from "os";
import path from "path";
import sanitizeFilename from "sanitize-filename";

import { outputFile } from "../../utils/fs";
import type { PstElement, PstEmail } from "./../pst-extractor/type";
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
const EML_PATH_ESCAPED_SEP = "_";

/**
 * Export PST to EML archive.
 */
export const emlExporter: PstExporter = {
    async export<T extends PstElement>(obj: T, dest: string) {
        await mkdir(dest);
        const exportEml = async (pst: PstElement) => {
            for (const child of pst.children ?? []) {
                if (isPstEmail(child)) {
                    const escapedSubject = sanitizeFilename(child.subject, {
                        replacement: EML_PATH_ESCAPED_SEP,
                    });

                    const wrapPath = path.join(
                        child.elementPath,
                        escapedSubject,
                        escapedSubject
                    );

                    const mailContent: EmlFile = {
                        body: child.contentText
                            .replaceAll("\n", "")
                            .replaceAll("\r", ""),
                        // body: child.contentHTML,
                        from: child.from.email ?? "[unknown]",
                        isSent: child.isFromMe ? 0 : 1,
                        subject: child.subject,
                        to: child.to
                            .map((recipient) => recipient.email)
                            .join(" "),
                    };

                    // await createEmlFile(wrapPath, mailContent, dest);
                    await createEmlFile(wrapPath, child, dest);
                } else await exportEml(child);
            }
        };

        await exportEml(obj);
    },
};

/**
 * Create a file with a parent wrapper folder and file name as a title.
 */
const createEmlFile = async (
    filePath: string,
    // fileContent: EmlFile,
    fileContent: PstEmail,
    dest: string
) =>
    outputFile(filePath + EML_EXTENSION, generate(fileContent), dest, {
        encoding: "utf-8",
    });

/**
 * Generate an EML from the given object.
 */
const generate = (email: PstEmail): string => {
    // TODO use "emlParse(rawEmail.transportMessageHeaders.replace(/Content-Type:.*/i, ""), {headersOnly: true})"
    // TODO move to worker and do like xlsxExporter where write file logic is handled separatly
    return emlStringify(
        {
            cc: email.cc,
            from: email.from,
            headers: {
                Date: new Date(email.receivedTime).toUTCString(), // eslint-disable-line @typescript-eslint/naming-convention
                "MIME-Version": "1.0", // eslint-disable-line @typescript-eslint/naming-convention
                "Message-ID": email.messageId, // eslint-disable-line @typescript-eslint/naming-convention
            },
            html: email.contentHTML,
            subject: email.subject,
            text: email.contentText,
            to: email.to,
        },
        { lf: EOL }
    );
};
