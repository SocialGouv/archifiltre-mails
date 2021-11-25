import type {
    PstAttachement,
    PstContent,
    PstEmail,
    PstEmailRecipient,
    PstExtractTables,
    PstFolder,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import type {
    PSTFolder,
    PSTRecipient,
} from "@socialgouv/archimail-pst-extractor";
import { PSTFile } from "@socialgouv/archimail-pst-extractor";
import { randomUUID } from "crypto";
import path from "path";
import { parentPort, workerData } from "worker_threads";

// Events - Worker => Parent
export const PST_PROGRESS_WORKER_EVENT = "pstExtractor.worker.event.progress";
export const PST_DONE_WORKER_EVENT = "pstExtractor.worker.event.done";

interface EventDataMapping {
    [PST_DONE_WORKER_EVENT]: {
        content: PstContent;
        progressState: PstProgressState;
        pstExtractTables: PstExtractTables;
    };
    [PST_PROGRESS_WORKER_EVENT]: PstProgressState;
}

export type PstWorkerEvent = keyof EventDataMapping;

/**
 * Possible message types comming from the worker.
 */
export type PstWorkerMessageType<
    TEvent extends PstWorkerEvent = PstWorkerEvent
> = TEvent extends PstWorkerEvent
    ? {
          event: TEvent;
          data: EventDataMapping[TEvent];
      }
    : never;

/**
 * Post a message to parent thread.
 */
function postMessage<TEvent extends PstWorkerEvent>(
    event: TEvent,
    data: EventDataMapping[TEvent]
): void {
    parentPort?.postMessage({ data, event } as PstWorkerMessageType);
}

const getRecipientFromDisplay = (
    display: string,
    recipients: PSTRecipient[]
): PstEmailRecipient[] =>
    display
        .split(";")
        .map((name) => name.trim())
        .filter((name) => name)
        .map((name) => {
            const found = recipients.find(
                (recipient) => recipient.displayName === name
            );
            return {
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Handle empty string
                email: found?.smtpAddress || found?.emailAddress,
                // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- Handle empty string
                name: found?.recipientDisplayName || found?.displayName || name,
            };
        });

/**
 * WorkerData - Initial worker arguments
 */
export interface PstWorkerData {
    pstFilePath: string;
    progressInterval?: number;
    depth?: number;
}

let starTime = Date.now();
let progressInterval = 1000;
let nextTimeTick = starTime;
let definedDepth = Infinity;
let root = true;
let currentDepth = 0;

if (parentPort) {
    const {
        pstFilePath,
        progressInterval: pi,
        depth,
    } = workerData as PstWorkerData;
    progressInterval = Math.abs(pi ?? progressInterval);
    definedDepth = Math.abs(depth ?? definedDepth);
    const progressState: PstProgressState = {
        countAttachement: 0,
        countEmail: 0,
        countFolder: 0,
        countTotal: 0,
        elapsed: 0,
        progress: true,
    };

    const pstExtractTables: PstExtractTables = {
        attachements: new Map(),
        contacts: new Map(),
        emails: new Map(),
    };

    postMessage(PST_PROGRESS_WORKER_EVENT, progressState);
    const pstFile = new PSTFile(path.resolve(pstFilePath));
    const rootFolder = pstFile.getRootFolder();

    // reset vars
    root = true;
    currentDepth = 0;
    starTime = Date.now();
    nextTimeTick = starTime;
    //

    const content = {
        ...processFolder(rootFolder, progressState, pstExtractTables),
        type: "rootFolder",
    } as PstContent;
    content.name = pstFile.getMessageStore().displayName;

    // TODO: postProcess(content); // real email count, ...

    progressState.elapsed = Date.now() - starTime;
    postMessage(PST_DONE_WORKER_EVENT, {
        content,
        progressState,
        pstExtractTables,
    });
}

// ---

/**
 * Process a "raw" folder from the PST and extract sub folders, emails, and attachements.
 *
 * The progress state is updated for every item found and sent to any listener on every emails.
 *
 * @param folder The folder to process
 * @param progressState The current progress state to update
 * @returns The extracted content
 */
function processFolder(
    folder: PSTFolder,
    progressState: PstProgressState,
    pstExtractTables: PstExtractTables
): PstFolder {
    const content: PstFolder = {
        emailCount: folder.emailCount,
        folderType: ["Generic", "Root", "Search"][folder.folderType],
        id: randomUUID(),
        name: folder.displayName,
        size: Math.abs(folder.emailCount) || 1,
        type: "folder",
    };

    if (root) {
        root = false;
    } else {
        currentDepth++;
    }

    if (currentDepth <= definedDepth && folder.hasSubfolders) {
        for (const childFolder of folder.getSubFolders()) {
            if (!content.children) {
                content.children = [];
            }
            progressState.countFolder++;
            progressState.countTotal++;
            content.children.push(
                processFolder(childFolder, progressState, pstExtractTables)
            );
        }
    }

    if (folder.contentCount) {
        for (const email of folder.childrenIterator()) {
            if (!content.children) {
                content.children = [];
            }

            if (email.messageClass !== "IPM.Note") {
                if (!content.other) {
                    content.other = [];
                }
                content.other.push(email.messageClass);
                continue;
            }

            const recipients = email.getRecipients();
            const emailContent: PstEmail = {
                attachementCount: email.numberOfAttachments,
                attachements: [],
                bcc: getRecipientFromDisplay(email.displayBCC, recipients),
                cc: getRecipientFromDisplay(email.displayCC, recipients),
                contentHTML: email.bodyHTML,
                contentRTF: email.bodyRTF,
                contentText: email.body,
                from: {
                    email: email.senderEmailAddress,
                    name: email.senderName,
                },

                id: randomUUID(),
                // TODO: change name
                name: `${email.senderName} ${email.originalSubject}`,
                receivedDate: email.messageDeliveryTime,
                sentTime: email.clientSubmitTime,
                size: 1,
                subject: email.subject,
                to: getRecipientFromDisplay(email.displayTo, recipients),
                type: "email",
            };

            [
                ...emailContent.bcc,
                ...emailContent.cc,
                emailContent.from,
                ...emailContent.to,
            ].forEach((recipient) => {
                const contactKey = recipient.email ?? recipient.name;
                if (!pstExtractTables.contacts.has(contactKey))
                    pstExtractTables.contacts.set(contactKey, [
                        emailContent.id,
                    ]);
                else
                    pstExtractTables.contacts
                        .get(contactKey)
                        ?.push(emailContent.id);
            });

            if (email.hasAttachments) {
                emailContent.attachements = [];
                for (let i = 0; i < email.numberOfAttachments; i++) {
                    const attachement = email.getAttachment(i);
                    progressState.countAttachement++;
                    progressState.countTotal++;
                    const attachementContent: PstAttachement = {
                        // TODO: change name
                        filename: attachement.displayName,
                        filesize: attachement.filesize,
                        mimeType: attachement.mimeTag,
                    };
                    emailContent.attachements.push(attachementContent);

                    if (!pstExtractTables.attachements.has(emailContent.id))
                        pstExtractTables.attachements.set(emailContent.id, [
                            attachementContent,
                        ]);
                    else
                        pstExtractTables.attachements
                            .get(emailContent.id)
                            ?.push(attachementContent);
                }
            }

            if (!pstExtractTables.emails.has(content.id))
                pstExtractTables.emails.set(content.id, [emailContent]);
            else pstExtractTables.emails.get(content.id)?.push(emailContent);

            progressState.countEmail++;
            progressState.countTotal++;
            content.children.push(emailContent);

            // update progress only when interval ms is reached
            const now = Date.now();
            const elapsed = now - nextTimeTick;
            if (elapsed >= progressInterval) {
                progressState.elapsed = now - starTime;
                postMessage(PST_PROGRESS_WORKER_EVENT, progressState);
                nextTimeTick = now;
            }
        }
    }

    return content;
}
