import type {
    PstAttachment as PstAttachment,
    PstEmail,
} from "@common/modules/pst-extractor/type";
import { getRecipientFromDisplay } from "@common/modules/views/utils";
import type { PSTFolder } from "@socialgouv/archimail-pst-extractor";
import { PSTFile } from "@socialgouv/archimail-pst-extractor";
import path from "path";
import { parentPort, workerData } from "worker_threads";

export const PST_EMAIL_DONE_WORKER_EVENT = "pstEmailFetcher.worker.event.done";

interface EventDataMapping {
    [PST_EMAIL_DONE_WORKER_EVENT]: {
        email: PstEmail;
    };
}

export type PstEmailWorkerEvent = keyof EventDataMapping;

/**
 * Possible message types comming from the worker.
 */
export type PstEmailWorkerMessageType<
    TEvent extends PstEmailWorkerEvent = PstEmailWorkerEvent
> = TEvent extends PstEmailWorkerEvent
    ? {
          data: EventDataMapping[TEvent];
          event: TEvent;
      }
    : never;

/**
 * Post a message to parent thread.
 */
function postMessage<TEvent extends PstEmailWorkerEvent>(
    event: TEvent,
    data: EventDataMapping[TEvent]
): void {
    parentPort?.postMessage({ data, event } as PstEmailWorkerMessageType);
}

/**
 * WorkerData - Initial worker arguments
 */
export interface PstEmailWorkerData {
    emailIndex: number[];
    pstFilePath: string;
}

if (parentPort) {
    const { pstFilePath, emailIndex } = workerData as PstEmailWorkerData;

    const pstFile = new PSTFile(path.resolve(pstFilePath));
    const rootFolder = pstFile.getRootFolder();

    const email = findEmail(rootFolder, emailIndex);

    postMessage(PST_EMAIL_DONE_WORKER_EVENT, {
        email,
    });
}

// ---

function findEmail(folder: PSTFolder, emailIndex: number[]): PstEmail {
    if (!emailIndex.length) {
        throw new Error("No index provided.");
    }

    const idxCopy = [...emailIndex];
    const emailPositionInLastFolder = idxCopy.pop()!;

    const lastFolder = idxCopy.reduce<PSTFolder>((subfolder, index) => {
        return subfolder.getSubFolders()[index]!;
    }, folder);
    lastFolder.moveChildCursorTo(emailPositionInLastFolder);

    const rawEmail = lastFolder.getNextChild();

    if (!rawEmail) {
        throw new Error(
            `Email not found at given index. (${[
                ...idxCopy,
                emailPositionInLastFolder,
            ]})`
        );
    }

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
            email: rawEmail.senderEmailAddress,
            name: rawEmail.senderName,
        },

        id: "",
        // TODO: change name
        isFromMe: rawEmail.isFromMe,
        name: `${rawEmail.senderName} ${rawEmail.originalSubject}`,
        receivedDate: rawEmail.messageDeliveryTime,
        sentTime: rawEmail.clientSubmitTime,
        size: 1,
        subject: rawEmail.subject,
        to: getRecipientFromDisplay(rawEmail.displayTo, recipients),
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
}
