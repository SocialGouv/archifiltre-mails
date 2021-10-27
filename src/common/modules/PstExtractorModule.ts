import { IS_MAIN } from "@common/config";
import { ipcMain, ipcRenderer } from "electron";
import path from "path";
import type { PSTFolder } from "pst-extractor";
import { PSTFile } from "pst-extractor";

import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";
import type { PstContent, PSTExtractorEmail } from "./pst-extractor/type";

const REGEXP_PST = /\.pst$/i;
const PST_EXTRACT_EVENT = "pstExtractorService.extract";

export class PstExtractorModule extends IsomorphicModule {
    public service = new InnerPstExtractorService();

    private inited = false;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        this.inited = true;
        await Promise.resolve();
    }
}

export type PstExtractorService = InnerPstExtractorService;

class InnerPstExtractorService extends IsomorphicService {
    public inited = false;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }
        if (IS_MAIN) {
            ipcMain.handle(
                PST_EXTRACT_EVENT,
                async (_event, ...args: unknown[]) =>
                    this.extract(args[0] as string)
            );
        }
        await Promise.resolve();
        this.inited = true;
    }

    public async extract(pstFilePath?: string): Promise<PstContent> {
        if (!pstFilePath || !REGEXP_PST.test(pstFilePath)) {
            throw new Error(
                `[PstExtractorService] Cannot extract PST from an unknown path or file. Got "${pstFilePath}"`
            );
        }

        if (IS_MAIN) {
            const pstFile = new PSTFile(path.resolve(pstFilePath));
            const rootFolder = pstFile.getRootFolder();
            // eslint-disable-next-line prefer-const
            let count = { all: 0 };
            const content = this.processFolder(rootFolder, count);
            console.log("countAll", count.all);
            content.size = count.all;
            return content;
        }

        return (await ipcRenderer.invoke(
            PST_EXTRACT_EVENT,
            pstFilePath
        )) as PstContent;
    }

    private processFolder(
        folder: PSTFolder,
        count: { all: number }
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
                content.children.push(this.processFolder(childFolder, count));
            }
        }

        if (folder.contentCount) {
            for (const email of folderMailIterator(folder)) {
                if (!content.children) {
                    content.children = [];
                }

                const emailContent: PstContent = {
                    name: `${email.senderName} <${email.emailAddress}> ${email.originalSubject}`,
                };
                if (email.hasAttachments) {
                    emailContent.children = [];
                    for (let i = 0; i < email.numberOfAttachments; i++) {
                        const attachement = email.getAttachment(i);
                        console.log(
                            "Found attachement for",
                            folder.displayName,
                            emailContent.name,
                            `Attachement: ${attachement.displayName} - ${attachement.pathname}`
                        );
                        emailContent.children.push({
                            name: `Attachement: ${attachement.displayName} - ${attachement.pathname}`,
                        });
                    }
                }
                content.children.push(emailContent);
                count.all++;
            }
        }

        return content;
    }
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
