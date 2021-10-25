import { IS_MAIN } from "@common/config";
import { ipcMain, ipcRenderer } from "electron";
import path from "path";
import type { PSTFolder } from "pst-extractor";
import { PSTFile } from "pst-extractor";

import { IsomorphicService } from "./ContainerModule";
import { IsomorphicModule } from "./Module";
import type { PstContent, PSTExtractorEmail } from "./pst-extractor/type";

export class PstExtractorModule extends IsomorphicModule {
    public service = new InnerPstExtractorService();

    private inited = false;

    public async init(): Promise<void> {
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
                "pstExtractorService.extract",
                async (_event, [pstFilePath]: [string]) =>
                    this.extract(pstFilePath)
            );
        }
        await Promise.resolve();
        this.inited = true;
    }

    public async extract(
        pstFilePath = "/Users/lsagetlethias/Downloads/PST/archive.pst"
    ): Promise<PstContent> {
        if (IS_MAIN) {
            const pstFile = new PSTFile(path.resolve(pstFilePath));
            const rootFolder = pstFile.getRootFolder();
            return this.processFolder(rootFolder);
        }

        return (await ipcRenderer.invoke(
            "pstExtractorService.extract",
            pstFilePath
        )) as PstContent;
    }

    private processFolder(folder: PSTFolder): PstContent {
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
                content.children.push(this.processFolder(childFolder));
            }
        }

        if (folder.contentCount) {
            for (const email of folderMailIterator(folder)) {
                if (!content.children) {
                    content.children = [];
                }

                content.children.push({
                    name: email.senderName,
                    size: 1,
                });
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
