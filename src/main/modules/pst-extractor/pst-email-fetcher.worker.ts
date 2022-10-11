import type {
    PstAttachment as PstAttachment,
    PstEmail,
} from "@common/modules/pst-extractor/type";
import { getRecipientFromDisplay } from "@common/modules/views/utils";
import { notImplemented } from "@common/utils";
import type {
    PSTFolder,
    PSTMessage,
} from "@socialgouv/archimail-pst-extractor";
import { PSTFile } from "@socialgouv/archimail-pst-extractor";
import { randomUUID } from "crypto";
import { promises as fs } from "fs";
import { isEqual } from "lodash";
import path from "path";
import { Pool, TimeoutError } from "tarn";

import type {
    WorkerCommandsBuilder,
    WorkerConfigBuilder,
    WorkerQueriesBuilder,
} from "../../workers/type";
import { Ack } from "../../workers/type";
import { WorkerServer } from "../../workers/WorkerServer";
import { PstCache } from "./PstCache";

type Commands = WorkerCommandsBuilder<{
    open: {
        param: {
            pstFilePath: string;
        };
    };
    writeEml: {
        param: {
            emailIndexes: number[][];
        };
    };
}>;
type Queries = WorkerQueriesBuilder<{
    fetch: {
        param: {
            emailIndexes: number[][];
        };
        returnType: string;
    };
}>;

export type FetchWorkerConfig = WorkerConfigBuilder<{
    commands: Commands;
    queries: Queries;
}>;

const pstCache = new PstCache();
void pstCache.db.close();
const server = new WorkerServer<FetchWorkerConfig>();

let pool: Pool<FileAndId> | null = null;
let buf: Buffer | null = null;

let fileId = 0;
interface FileAndId {
    id: number;
    pstFile: PSTFile;
}
server.onCommand("open", async ({ pstFilePath }) => {
    const filePath = path.resolve(pstFilePath);
    buf = await fs.readFile(filePath);
    pool = new Pool<FileAndId>({
        create() {
            if (!buf) {
                throw new Error("File not read");
            }
            const id = fileId++;
            return { id, pstFile: new PSTFile(buf) };
        },
        destroy({ pstFile }) {
            pstFile.close();
        },
        max: 50,
        min: 1,
    });
    pstCache.openForPst(pstFilePath);

    return Ack.Resolve();
});

server.onQuery("fetch", async ({ emailIndexes }) => {
    const allIndexes = await pstCache.getPstMailIndexes();
    const cacheKeys = [...allIndexes.keys()];
    const cacheValues = [...allIndexes.values()];

    const emails = await parallelIndexesProcess(
        emailIndexes,
        (rawEmail, emailIndex) => {
            const email = toInternalPstEmail(rawEmail);
            email.id =
                cacheKeys[
                    cacheValues.findIndex((idxs) => isEqual(emailIndex, idxs))
                ]!;
            return email;
        }
    );

    const cacheKey = randomUUID();
    await pstCache.setTempEmails(cacheKey, emails);
    return cacheKey;
});

// TODO writeEml could be renamed "export" and export functions can be ported here
// we want to directly manipulate rawEmail file (and attachments) right after retreiving
// like fetch, the operation could be parallelized (pool of writter or simply Promise.all)
// for eml files, rawEmail.toEML() can now be used
server.onCommand("writeEml", notImplemented);

// ---

type ProcessFunction<T> = (rawEmail: PSTMessage, emailIndex: number[]) => T;
const parallelIndexesProcess = async <T>(
    emailIndexes: number[][],
    processFunction: ProcessFunction<T>
): Promise<T[]> => {
    if (!pool) {
        throw new Error("No pst file opened yet.");
    }
    console.time("==FETCH MAILS");
    const emails = await Promise.all(
        emailIndexes.map(async (emailIndex) => {
            try {
                const fileAndId = await pool!.acquire().promise;
                const email = processFunction(
                    findEmail(fileAndId.pstFile.getRootFolder(), emailIndex),
                    emailIndex
                );
                pool!.release(fileAndId);
                return email;
            } catch (error: unknown) {
                if (error instanceof TimeoutError) {
                    console.error("Pool timeout error mega fail...");
                }
                throw error;
            }
        })
    );
    console.timeEnd("==FETCH MAILS");

    return emails;
};

function findEmail(folder: PSTFolder, emailIndex: number[]): PSTMessage {
    if (!emailIndex.length) {
        throw new Error("No index provided.");
    }

    const idxCopy = [...emailIndex];
    const emailPositionInLastFolder = idxCopy.pop()!;

    const lastFolder = idxCopy.reduce<PSTFolder>((subfolder, index) => {
        let tmpSubFolderIndex = 0;
        return subfolder.getSubFolders().find((sub) => {
            if (
                sub.containerClass !== "" &&
                sub.containerClass !== "IPF.Note"
            ) {
                return false;
            }
            if (tmpSubFolderIndex === index) {
                return true;
            }
            tmpSubFolderIndex++;
        })!;
    }, folder);
    const rawEmail = lastFolder.getChildAt(emailPositionInLastFolder);

    if (!rawEmail) {
        throw new Error(
            `Email not found at given index. (${[
                ...idxCopy,
                emailPositionInLastFolder,
            ]})`
        );
    }

    return rawEmail;
}

const toInternalPstEmail = (rawEmail: PSTMessage): PstEmail => {
    const recipients = rawEmail.getRecipients();
    const email: PstEmail = {
        attachmentCount: rawEmail.numberOfAttachments,
        attachments: [],
        bcc: getRecipientFromDisplay(rawEmail.displayBCC, recipients),
        cc: getRecipientFromDisplay(rawEmail.displayCC, recipients),
        contentHTML: rawEmail.bodyHTML,
        contentRTF: rawEmail.bodyRTF,
        contentText: rawEmail.body,
        elementPath: "",
        from: {
            email: (
                rawEmail.senderSmtpEmailAddress || rawEmail.senderEmailAddress
            ).toLowerCase(),
            name: rawEmail.senderName,
        },

        id: "",

        // TODO: change name
        isFromMe: rawEmail.isFromMe,

        messageId: rawEmail.internetMessageId,
        name: `${rawEmail.senderName} ${rawEmail.originalSubject}`,
        receivedTime: rawEmail.messageDeliveryTime!.getTime(),
        sentTime: rawEmail.clientSubmitTime!.getTime(),
        size: 1,
        subject: rawEmail.subject,
        to: getRecipientFromDisplay(rawEmail.displayTo, recipients),
        transportMessageHeaders: rawEmail.transportMessageHeaders,
        type: "email",
    };

    if (rawEmail.hasAttachments) {
        email.attachments = [];
        for (let i = 0; i < rawEmail.numberOfAttachments; i++) {
            const rawAttachment = rawEmail.getAttachment(i);
            const attachment: PstAttachment = {
                // TODO: change name
                filename: rawAttachment.displayName,
                filesize: rawAttachment.filesize,
                mimeType: rawAttachment.mimeTag,
            };
            email.attachments.push(attachment);
        }
    }

    return email;
};
