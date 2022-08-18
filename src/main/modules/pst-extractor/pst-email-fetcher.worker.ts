import type {
    PstAttachment as PstAttachment,
    PstEmail,
} from "@common/modules/pst-extractor/type";
import { getRecipientFromDisplay } from "@common/modules/views/utils";
import type { PSTFolder } from "@socialgouv/archimail-pst-extractor";
import { PSTFile } from "@socialgouv/archimail-pst-extractor";
import path from "path";

import type {
    WorkerCommandsBuilder,
    WorkerConfigBuilder,
    WorkerQueriesBuilder,
} from "../../workers/type";
import { WorkerServer } from "../../workers/WorkerServer";
import { PstCache } from "./PstCache";

type Commands = WorkerCommandsBuilder<{
    open: {
        param: {
            pstFilePath: string;
        };
    };
}>;
type Queries = WorkerQueriesBuilder<{
    fetch: {
        param: {
            emailIndexes: number[][];
        };
        returnType: PstEmail[];
    };
}>;

export type FetchWorkerConfig = WorkerConfigBuilder<{
    commands: Commands;
    queries: Queries;
}>;

const pstCache = new PstCache();
void pstCache.db.close();
const server = new WorkerServer<FetchWorkerConfig>();
let pstFile: PSTFile | null = null;

server.onCommand("open", async ({ pstFilePath }) => {
    pstFile = new PSTFile(path.resolve(pstFilePath));
    pstCache.openForPst(pstFilePath);

    return Promise.resolve({ ok: true });
});

server.onQuery("fetch", async ({ emailIndexes }) => {
    if (!pstFile) {
        throw new Error("No pst file opened yet.");
    }
    const allIndexes = await pstCache.getPstMailIndexes();
    const cacheKeys = [...allIndexes.keys()];
    const cacheValues = [...allIndexes.values()];
    return Promise.all(
        emailIndexes.map(
            async (emailIndex) =>
                new Promise((ok) => {
                    const email = findEmail(
                        pstFile!.getRootFolder(),
                        emailIndex
                    );
                    email.id = cacheKeys[cacheValues.indexOf(emailIndex)]!;
                    ok(email);
                })
        )
    );
});

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
    const rawEmail = lastFolder.getChildAt(emailPositionInLastFolder);

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
