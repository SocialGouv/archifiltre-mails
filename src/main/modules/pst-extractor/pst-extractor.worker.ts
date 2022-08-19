import type {
    AddtionalDataItem,
    GroupType,
    PstAttachment,
    PstMailIndex,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import { builtInViewConfigs } from "@common/modules/views/setup";
import type { ViewConfiguration } from "@common/modules/views/utils";
import {
    getRecipientFromDisplay,
    resolveViewConfiguration,
} from "@common/modules/views/utils";
import type { PSTFolder } from "@socialgouv/archimail-pst-extractor";
import { PSTFile } from "@socialgouv/archimail-pst-extractor";
import path from "path";

import type {
    WorkerCommandsBuilder,
    WorkerConfigBuilder,
    WorkerEventListenersBuilder,
} from "../../workers/type";
import { WorkerServer } from "../../workers/WorkerServer";
import { PstCache } from "./PstCache";

// import { randomUUID } from "crypto";
let ID = 0;
function randomUUID() {
    return `mail-${ID++}`;
}

interface Data {
    cachePath: string;
}

type Commands = WorkerCommandsBuilder<{
    extract: {
        param: {
            progressInterval?: number;
            viewConfigs?: ViewConfiguration[];
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

const pstCache = new PstCache();
void pstCache.db.close();
const server = new WorkerServer<ExtractorWorkerConfig>();
let pstFile: PSTFile | null = null;

server.onCommand("open", async ({ pstFilePath }) => {
    pstFile = new PSTFile(path.resolve(pstFilePath));
    pstCache.openForPst(pstFilePath);

    return Promise.resolve({ ok: true });
});

server.onCommand(
    "extract",
    async ({ progressInterval: pi, viewConfigs: vc }) => {
        if (!pstFile) {
            throw new Error("No pst file opened yet.");
        }
        const progressInterval = Math.abs(pi ?? 1000);
        const viewConfigs = vc ?? builtInViewConfigs;
        const viewGroupFunctions = viewConfigs.map(resolveViewConfiguration);
        const progressState: PstProgressState = {
            countAttachment: 0,
            countEmail: 0,
            countFolder: 0,
            countTotal: 0,
            elapsed: 0,
            progress: true,
        };

        // view groups
        const groups = new Map<GroupType, Map<string, string[]>>(
            viewGroupFunctions.map((viewGroupFn) => [
                viewGroupFn.type,
                new Map(),
            ])
        );
        // utility groups
        groups.set("senderMail", new Map());
        groups.set("folder", new Map());
        const mailIndexes = new Map<string, PstMailIndex>();
        const attachments = new Map<string, PstAttachment[]>();

        server.trigger("progress", progressState);
        const rootFolder = pstFile.getRootFolder();

        const starTime = Date.now();
        let nextTimeTick = starTime;
        let root = true;
        let currentDepth = 0;
        let currentFolderIndexes = [-1];

        // folder list collect
        let folderId = 0;
        const folderList: AddtionalDataItem[] = [];

        // contact list collect
        const contactList = new Map<
            AddtionalDataItem["id"],
            AddtionalDataItem["name"]
        >();

        // extrem dates
        let minDate = Infinity;
        let maxDate = 0;

        /**
         * Process a "raw" folder from the PST and extract sub folders, emails, and attachements.
         *
         * The progress state is updated for every item found and sent to any listener on every emails.
         */
        function processFolder(folder: PSTFolder, currentFolderId = ""): void {
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
                    progressState.countFolder++;
                    progressState.countTotal++;
                    if (
                        childFolder.containerClass !== "" && // root or system folder
                        childFolder.containerClass !== "IPF.Note" // message folder
                    ) {
                        continue;
                    }
                    const strFolderId = `folder-${folderId}`;
                    folderList.push({
                        id: strFolderId,
                        name: childFolder.displayName,
                    });
                    folderId++;
                    processFolder(childFolder, strFolderId);
                }
            }

            if (folder.contentCount) {
                let mailIndex = 0;
                for (const email of folder.childrenIterator()) {
                    if (email.messageClass !== "IPM.Note") {
                        continue;
                    }
                    const emailId = randomUUID();
                    // group mails
                    for (const viewGroupFn of viewGroupFunctions) {
                        const currentGroupIds = groups.get(viewGroupFn.type)!;
                        const criterion = viewGroupFn.groupByFunction(email);

                        const ids = currentGroupIds.get(criterion) ?? [];
                        currentGroupIds.set(criterion, [...ids, emailId]);

                        groups.set(viewGroupFn.type, currentGroupIds);
                    }

                    // group for sender
                    const senderMail = email.senderEmailAddress.toLowerCase();
                    const senderGroupIds = groups.get("senderMail")!;
                    const senderMailIds = senderGroupIds.get(senderMail) ?? [];
                    senderGroupIds.set(senderMail, [...senderMailIds, emailId]);

                    // group by folder name (prepare for deleted folder)
                    const folderGroupIds = groups.get("folder")!;
                    const folderMailIds =
                        folderGroupIds.get(currentFolderId) ?? [];
                    folderGroupIds.set(currentFolderId, [
                        ...folderMailIds,
                        emailId,
                    ]);

                    // test and get extrem dates
                    const sentTime = email.clientSubmitTime!.getTime();
                    const receivedTime = email.messageDeliveryTime!.getTime();
                    minDate = Math.min(minDate, sentTime, receivedTime);
                    maxDate = Math.max(maxDate, sentTime, receivedTime);

                    // get contact
                    const recipients = email.getRecipients();
                    const to = getRecipientFromDisplay(
                        email.displayTo,
                        recipients
                    );
                    const cc = getRecipientFromDisplay(
                        email.displayCC,
                        recipients
                    );
                    const bcc = getRecipientFromDisplay(
                        email.displayBCC,
                        recipients
                    );
                    [
                        ...bcc,
                        ...cc,
                        {
                            email: (
                                email.senderSmtpEmailAddress ||
                                email.senderEmailAddress
                            ).toLowerCase(),
                            name: email.senderName,
                        },
                        ...to,
                    ].forEach((recipient) => {
                        const contactKey = recipient.email ?? recipient.name;
                        if (!contactList.has(contactKey))
                            contactList.set(contactKey, recipient.name);
                    });

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

                    if (email.hasAttachments) {
                        for (let i = 0; i < email.numberOfAttachments; i++) {
                            const attachment = email.getAttachment(i);
                            progressState.countAttachment++;
                            progressState.countTotal++;
                            const attachmentContent: PstAttachment = {
                                // TODO: change name
                                filename: attachment.displayName,
                                filesize: attachment.filesize,
                                mimeType: attachment.mimeTag,
                            };

                            if (!attachments.has(emailId))
                                attachments.set(emailId, [attachmentContent]);
                            else
                                attachments
                                    .get(emailId)
                                    ?.push(attachmentContent);
                        }
                    }

                    mailIndexes.set(emailId, [
                        ...currentFolderIndexes,
                        mailIndex++,
                    ]);

                    progressState.countEmail++;
                    progressState.countTotal++;

                    // update progress only when interval ms is reached
                    const now = Date.now();
                    const elapsed = now - nextTimeTick;
                    if (elapsed >= progressInterval) {
                        progressState.elapsed = now - starTime;
                        server.trigger("progress", progressState);
                        nextTimeTick = now;
                    }
                }
            }

            currentDepth--;
        }

        processFolder(rootFolder);

        await pstCache.setPstMailIndexes(mailIndexes);
        await pstCache.setAttachments(attachments);
        for (const [groupType, group] of groups) {
            await pstCache.setGroup(groupType, group);
        }
        await pstCache.setAddtionalDatas("folderList", folderList);
        await pstCache.setAddtionalDatas(
            "contactList",
            [...contactList.entries()].map(([id, name]) => ({ id, name }))
        );
        await pstCache.setAddtionalDatas("extremeDates", {
            max: maxDate,
            min: minDate,
        });

        progressState.elapsed = Date.now() - starTime;
        server.trigger("done", progressState);

        return { ok: true };
    }
);

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
