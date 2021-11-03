import type {
    PstContent,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import path from "path";
import type { PSTFolder } from "pst-extractor";
import { PSTFile } from "pst-extractor";
import { parentPort, workerData } from "worker_threads";

export const PST_PROGRESS_WORKER_EVENT = "pstExtractorService.worker.progress";
export const PST_DONE_WORKER_EVENT = "pstExtractorService.worker.done";

/**
 * Possible message types comming from the worker.
 */
export type PstWorkerMessage =
    | {
          event: typeof PST_DONE_WORKER_EVENT;
          data: { content: PstContent; progressState: PstProgressState };
      }
    | {
          event: typeof PST_PROGRESS_WORKER_EVENT;
          data: PstProgressState;
      };

export interface PstWorkerData {
    pstFilePath: string;
    progressInterval?: number;
}

const START_TIME = Date.now();
let progressInterval = 1000;
let nextTimeTick = START_TIME;

if (parentPort) {
    const { pstFilePath, progressInterval: pi } = workerData as PstWorkerData;
    progressInterval = Math.abs(pi ?? progressInterval);
    const progressState: PstProgressState = {
        countAttachement: 0,
        countEmail: 0,
        countFolder: 0,
        countTotal: 0,
        elapsed: 0,
        progress: true,
    };

    parentPort.postMessage({
        data: progressState,
        event: PST_PROGRESS_WORKER_EVENT,
    } as PstWorkerMessage);
    const pstFile = new PSTFile(path.resolve(pstFilePath));
    const rootFolder = pstFile.getRootFolder();
    const content = processFolder(rootFolder, progressState);

    progressState.elapsed = Date.now() - START_TIME;
    parentPort.postMessage({
        data: {
            content,
            progressState,
        },
        event: PST_DONE_WORKER_EVENT,
    } as PstWorkerMessage);
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
                // TODO: change name
                name: `${email.senderName} ${email.originalSubject}`,
            };
            if (email.hasAttachments) {
                emailContent.children = [];
                for (let i = 0; i < email.numberOfAttachments; i++) {
                    const attachement = email.getAttachment(i);
                    progressState.countAttachement++;
                    progressState.countTotal++;
                    emailContent.children.push({
                        // TODO: change name
                        name: `Attachement: ${attachement.displayName} - ${attachement.pathname}`,
                    });
                }
            }
            progressState.countEmail++;
            progressState.countTotal++;
            content.children.push(emailContent);

            // update progress only when interval ms is reached
            const now = Date.now();
            const elapsed = now - nextTimeTick;
            if (elapsed >= progressInterval) {
                progressState.elapsed = now - START_TIME;
                parentPort?.postMessage({
                    data: progressState,
                    event: PST_PROGRESS_WORKER_EVENT,
                } as PstWorkerMessage);
                nextTimeTick = now;
            }
        }
    }

    return content;
}

function* folderMailIterator(folder: PSTFolder) {
    if (folder.contentCount) {
        let email = folder.getNextChild();
        while (email) {
            yield email;
            email = folder.getNextChild();
        }
    }
}
