import type {
    PstAttachment as PstAttachment,
    PstAttachmentEntries,
    PstMailIdsEntries,
    PstMailIndex,
    PstMailIndexEntries,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { getDomain, getLdapDomain, isLdap } from "@common/modules/views/utils";
import type { PSTFolder } from "@socialgouv/archimail-pst-extractor";
import { PSTFile } from "@socialgouv/archimail-pst-extractor";
import { Level } from "level";
import path from "path";

import type {
    WorkerCommandsBuilder,
    WorkerConfigBuilder,
    WorkerEventListenersBuilder,
} from "../../workers/type";
import { WorkerServer } from "../../workers/WorkerServer";

// import { randomUUID } from "crypto";
let ID = 0;
function randomUUID() {
    return `${ID++}`;
}

interface Data {
    cachePath: string;
}

type Commands = WorkerCommandsBuilder<{
    extract: {
        param: {
            progressInterval?: number;
        };
    };
    open: {
        param: {
            pstFilePath: string;
        };
    };
}>;

type EventListeners = WorkerEventListenersBuilder<{
    done: {
        returnType: PstProgressState;
    };
    progress: {
        returnType: PstProgressState;
    };
}>;

export type ExtractorWorkerConfig = WorkerConfigBuilder<{
    commands: Commands;
    data: Data;
    eventListeners: EventListeners;
}>;

const server = new WorkerServer<ExtractorWorkerConfig>();
// const server = new WorkerServer<Data, Commands, Any, EventListeners>();
export type ExtractorWorkerServer = typeof server;
let pstFile: PSTFile | null = null;

server.onCommand("open", async ({ pstFilePath }) => {
    pstFile = new PSTFile(path.resolve(pstFilePath));

    return Promise.resolve({ ok: true });
});

server.onCommand("extract", async ({ progressInterval: pi }) => {
    if (!pstFile) {
        throw new Error("No pst file opened yet.");
    }
    const progressInterval = Math.abs(pi ?? 1000);
    const progressState: PstProgressState = {
        countAttachment: 0,
        countEmail: 0,
        countFolder: 0,
        countTotal: 0,
        elapsed: 0,
        progress: true,
    };

    const mailIndexes = new Map<string, PstMailIndex>();
    const attachments = new Map<string, PstAttachment[]>();
    // TODO: prepare from given view config
    const domainIds = new Map<string, string[]>();
    const recipientIds = new Map<string, string[]>();
    const yearIds = new Map<string, string[]>();

    // postMessage(PST_PROGRESS_WORKER_EVENT, progressState);
    server.trigger("progress", progressState);
    const rootFolder = pstFile.getRootFolder();

    const starTime = Date.now();
    let nextTimeTick = starTime;
    let root = true;
    let currentDepth = 0;
    let currentFolderIndexes = [-1];

    /**
     * Process a "raw" folder from the PST and extract sub folders, emails, and attachements.
     *
     * The progress state is updated for every item found and sent to any listener on every emails.
     */
    function processFolder(
        folder: PSTFolder,
        progressStateRec: PstProgressState,
        mailIndexesRec: Map<string, PstMailIndex>,
        domainIndexesRec: Map<string, string[]>,
        yearIndexesRec: Map<string, string[]>,
        recipientIndexesRec: Map<string, string[]>,
        attachmentsRec: Map<string, PstAttachment[]>
    ): void {
        if (root) {
            root = false;
        } else {
            currentFolderIndexes[currentDepth] ??= -1;
            currentFolderIndexes = currentFolderIndexes.slice(
                0,
                currentDepth + 1
            );
            currentFolderIndexes[currentDepth]++;
            currentDepth++;
        }

        if (folder.hasSubfolders) {
            for (const childFolder of folder.getSubFolders()) {
                progressStateRec.countFolder++;
                progressStateRec.countTotal++;
                if (
                    childFolder.containerClass !== "" && // root or system folder
                    childFolder.containerClass !== "IPF.Note" // message folder
                ) {
                    continue;
                }
                processFolder(
                    childFolder,
                    progressStateRec,
                    mailIndexesRec,
                    domainIndexesRec,
                    yearIndexesRec,
                    recipientIndexesRec,
                    attachmentsRec
                );
            }
        }

        if (folder.contentCount) {
            let mailIndex = 0;
            for (const email of folder.childrenIterator()) {
                if (email.messageClass !== "IPM.Note") {
                    continue;
                }

                // const recipients = email.getRecipients();

                // TODO: use group functions instead
                const emailId = randomUUID();
                const emailAddress = email.senderEmailAddress;
                const domainKey = isLdap(emailAddress)
                    ? getLdapDomain(emailAddress)
                    : getDomain(emailAddress);
                const recipientKey = email.senderName;
                const year = email.messageDeliveryTime?.getFullYear();
                const yearKey = year ? `${year}` : "";

                const domainIdsRec = domainIndexesRec.get(domainKey) ?? [];
                domainIndexesRec.set(domainKey, [...domainIdsRec, emailId]);
                const recipientIdsRec =
                    recipientIndexesRec.get(recipientKey) ?? [];
                recipientIndexesRec.set(recipientKey, [
                    ...recipientIdsRec,
                    emailId,
                ]);

                if (yearKey) {
                    const yearIdsRec = yearIndexesRec.get(yearKey) ?? [];
                    yearIndexesRec.set(yearKey, [...yearIdsRec, emailId]);
                }
                // const emailContent: PstEmail = {
                //     attachementCount: email.numberOfAttachments,
                //     attachements: [],
                //     bcc: getRecipientFromDisplay(email.displayBCC, recipients),
                //     cc: getRecipientFromDisplay(email.displayCC, recipients),
                //     contentHTML: email.bodyHTML,
                //     contentRTF: email.bodyRTF,
                //     contentText: email.body,
                //     elementPath: parentPath,

                //     from: {
                //         email: email.senderEmailAddress,
                //         name: email.senderName,
                //     },

                //     id: emailId,
                //     // TODO: change name
                //     isFromMe: email.isFromMe,
                //     name: `${email.senderName} ${email.originalSubject}`,
                //     receivedDate: email.messageDeliveryTime,
                //     sentTime: email.clientSubmitTime,
                //     size: 1,
                //     subject: email.subject,
                //     to: getRecipientFromDisplay(email.displayTo, recipients),
                //     type: "email",
                // };

                // [
                //     ...emailContent.bcc,
                //     ...emailContent.cc,
                //     emailContent.from,
                //     ...emailContent.to,
                // ].forEach((recipient) => {
                //     const contactKey = recipient.email ?? recipient.name;
                //     if (!pstExtractTables.contacts.has(contactKey))
                //         pstExtractTables.contacts.set(contactKey, [
                //             emailContent.id,
                //         ]);
                //     else
                //         pstExtractTables.contacts
                //             .get(contactKey)
                //             ?.push(emailContent.id);
                // });

                if (email.hasAttachments) {
                    for (let i = 0; i < email.numberOfAttachments; i++) {
                        const attachment = email.getAttachment(i);
                        progressStateRec.countAttachment++;
                        progressStateRec.countTotal++;
                        const attachmentContent: PstAttachment = {
                            // TODO: change name
                            filename: attachment.displayName,
                            filesize: attachment.filesize,
                            mimeType: attachment.mimeTag,
                        };

                        if (!attachmentsRec.has(emailId))
                            attachmentsRec.set(emailId, [attachmentContent]);
                        else
                            attachmentsRec
                                .get(emailId)
                                ?.push(attachmentContent);
                    }
                }

                mailIndexesRec.set(emailId, [
                    ...currentFolderIndexes,
                    mailIndex++,
                ]);

                progressStateRec.countEmail++;
                progressStateRec.countTotal++;

                // update progress only when interval ms is reached
                const now = Date.now();
                const elapsed = now - nextTimeTick;
                if (elapsed >= progressInterval) {
                    progressStateRec.elapsed = now - starTime;
                    // postMessage(PST_PROGRESS_WORKER_EVENT, progressStateRec);
                    server.trigger("progress", progressStateRec);
                    nextTimeTick = now;
                }
            }
        }
        currentDepth--;
    }

    processFolder(
        rootFolder,
        progressState,
        // pstExtractTables,
        mailIndexes,
        domainIds,
        yearIds,
        recipientIds,
        attachments
    );

    // const db = new Level<string, PstMailIndex>(
    //     path.resolve(server.workerData.cachePath, "db")
    // );

    const db = new Level<string, PstMailIndexEntries>(
        "/Users/lsagetlethias/source/SocialGouv/archimail/db",
        { valueEncoding: "json" }
    );
    await db.clear();
    const idDb = db.sublevel<string, PstMailIdsEntries>("ids", {
        valueEncoding: "json",
    });
    const attachmentDb = db.sublevel<string, PstAttachmentEntries>(
        "attachment",
        {
            valueEncoding: "json",
        }
    );

    await db.put("index", [...mailIndexes.entries()]);
    await idDb.put("domain", [...domainIds.entries()]);
    await idDb.put("year", [...yearIds.entries()]);
    await idDb.put("recipient", [...recipientIds.entries()]);
    await attachmentDb.put("_", [...attachments.entries()]);
    await db.close();
    progressState.elapsed = Date.now() - starTime;
    // postMessage(PST_DONE_WORKER_EVENT, {
    //     progressState,
    // });
    server.trigger("done", progressState);

    return { ok: true };
});

// Events - Worker => Parent
// export const PST_PROGRESS_WORKER_EVENT = "pstExtractor.worker.event.progress";
// export const PST_DONE_WORKER_EVENT = "pstExtractor.worker.event.done";

/*
1/ tester le switch randomUUID vs incremental id
2/ 4012 => [ 0, 1, 4, 0, 11, 180 ] == index de stockage global (baseIndex)
3/ créer des index de recherche par id : Set([id1, id2, id3]) pour tous les domaines, toutes les années, tous les correspondants
4/ effectuer des instersections e.g. (domaine(beta.gouv) + année(2018))
5/ stocker en cache le résultat
*/

// interface EventDataMapping {
//     [PST_DONE_WORKER_EVENT]: {
//         progressState: PstProgressState;
//     };
//     [PST_PROGRESS_WORKER_EVENT]: PstProgressState;
// }

// export type PstWorkerEvent = keyof EventDataMapping;

// /**
//  * Possible message types comming from the worker.
//  */
// export type PstWorkerMessageType<
//     TEvent extends PstWorkerEvent = PstWorkerEvent
// > = TEvent extends PstWorkerEvent
//     ? {
//           data: EventDataMapping[TEvent];
//           event: TEvent;
//       }
//     : never;

// /**
//  * Post a message to parent thread.
//  */
// function postMessage<TEvent extends PstWorkerEvent>(
//     event: TEvent,
//     data: EventDataMapping[TEvent]
// ): void {
//     parentPort?.postMessage({ data, event } as PstWorkerMessageType);
// }

// /**
//  * WorkerData - Initial worker arguments
//  */
// export interface PstWorkerData {
//     cachePath: string;
//     depth?: number;
//     progressInterval?: number;
//     pstFilePath: string;
// }

// let starTime = Date.now();
// const progressInterval = 1000;
// let nextTimeTick = starTime;
// const definedDepth = Infinity;
// let root = true;
// let currentDepth = 0;
// let currentFolderIndexes = [-1];
