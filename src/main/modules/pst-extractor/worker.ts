import type {
    PstContent,
    PstProgressState,
} from "@common/modules/pst-extractor/type";
import type { Nothing } from "@common/utils/type";
import path from "path";
import type { PSTFolder } from "pst-extractor";
import { PSTFile } from "pst-extractor";
import { parentPort, threadId, workerData } from "worker_threads";

class PstWorkerInteruptError extends Error {}

// Events - Worker => Parent
export const PST_PROGRESS_WORKER_EVENT = "pstExtractor.worker.event.progress";
export const PST_DONE_WORKER_EVENT = "pstExtractor.worker.event.done";
export const PST_INTERUPTED_WORKER_EVENT =
    "pstExtractor.worker.event.interupted";

interface EventDataMapping {
    [PST_DONE_WORKER_EVENT]: {
        content: PstContent;
        progressState: PstProgressState;
    };
    [PST_INTERUPTED_WORKER_EVENT]: { reason: string };
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

// Commands - Parent => Worker
export const PST_STOP_EXTRACT_COMMAND =
    "pstExtractor.worker.command.stopExtact";

interface CommandArgMapping {
    [PST_STOP_EXTRACT_COMMAND]: Nothing;
}

export type PstWorkerCommand = keyof CommandArgMapping;

/**
 * Possible command types comming from the parent.
 */
export type PstWorkerCommandType<
    TCommand extends PstWorkerCommand = PstWorkerCommand
> = TCommand extends PstWorkerCommand
    ? CommandArgMapping[TCommand] extends Nothing
        ? {
              command: TCommand;
          }
        : {
              command: TCommand;
              args: CommandArgMapping[TCommand];
          }
    : never;

/**
 * WorkerData - Initial worker arguments
 */
export interface PstWorkerData {
    pstFilePath: string;
    progressInterval?: number;
}

const START_TIME = Date.now();
let progressInterval = 1000;
let nextTimeTick = START_TIME;
let stop = false;

if (parentPort) {
    handleIncomingCommands();
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

    postMessage(PST_PROGRESS_WORKER_EVENT, progressState);
    const pstFile = new PSTFile(path.resolve(pstFilePath));
    const rootFolder = pstFile.getRootFolder();

    const content = processFolder(rootFolder, progressState);

    progressState.elapsed = Date.now() - START_TIME;
    postMessage(PST_DONE_WORKER_EVENT, {
        content,
        progressState,
    });
}

// ---

function handleIncomingCommands(): void {
    parentPort?.on("message", (commandType: PstWorkerCommandType) => {
        switch (commandType.command) {
            case PST_STOP_EXTRACT_COMMAND:
                console.info("[WORKER] Stop received");
                stop = true;
                break;
            default:
                throw new Error(
                    `PstExtractor worker ${threadId} - Unknown command from parent (${commandType.command}).`
                );
        }
    });
}

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
    if (stop) {
        throw new PstWorkerInteruptError("Interupted by user.");
    }

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
                postMessage(PST_PROGRESS_WORKER_EVENT, progressState);
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
