import path from "path";
import type { PSTFolder } from "pst-extractor";
import { PSTFile } from "pst-extractor";
import { parentPort, workerData } from "worker_threads";

import type { PstContent, PSTExtractorEmail } from "./type";

export const PST_PROGRESS_WORKER_EVENT = "pstExtractorService.worker.progress";
export const PST_DONE_WORKER_EVENT = "pstExtractorService.worker.done";

export interface PstProgressState {
    progress: boolean;
    countTotal: number;
    countEmail: number;
    countFolder: number;
    countAttachement: number;
}

if (parentPort) {
    const { pstFilePath } = workerData as { pstFilePath: string };
    const progressState: PstProgressState = {
        countAttachement: 0,
        countEmail: 0,
        countFolder: 0,
        countTotal: 0,
        progress: true,
    };
    const pstFile = new PSTFile(path.resolve(pstFilePath));
    const rootFolder = pstFile.getRootFolder();
    const content = processFolder(rootFolder, progressState);

    parentPort.postMessage({
        data: {
            content,
            progressState,
        },
        event: PST_DONE_WORKER_EVENT,
    });
}

// ---

function processFolder(
    folder: PSTFolder,
    progressState: PstProgressState
): PstContent {
    const content: PstContent = {
        contentSize: folder.contentCount,
        name: folder.displayName,
        size: folder.emailCount,
    };

    if (folder.hasSubfolders) {
        for (const childFolder of folder.getSubFolders()) {
            if (!content.children) {
                content.children = [];
            }
            progressState.countFolder++;
            progressState.countTotal++;
            content.children.push(processFolder(childFolder, progressState));
        }
    }

    if (folder.contentCount) {
        for (const email of folderMailIterator(folder)) {
            if (!content.children) {
                content.children = [];
            }

            const emailContent: PstContent = {
                name: `${email.senderName} ${email.originalSubject}`,
            };
            if (email.hasAttachments) {
                emailContent.children = [];
                for (let i = 0; i < email.numberOfAttachments; i++) {
                    const attachement = email.getAttachment(i);
                    progressState.countAttachement++;
                    progressState.countTotal++;
                    emailContent.children.push({
                        name: `Attachement: ${attachement.displayName} - ${attachement.pathname}`,
                    });
                }
            }
            progressState.countEmail++;
            progressState.countTotal++;
            content.children.push(emailContent);
            parentPort?.postMessage({
                data: progressState,
                event: PST_PROGRESS_WORKER_EVENT,
            });
        }
    }

    return content;
}

function* folderMailIterator(folder: PSTFolder) {
    if (folder.contentCount) {
        let email = folder.getNextChild() as PSTExtractorEmail | null;
        while (email) {
            yield email;
            email = folder.getNextChild();
        }
    }
}
