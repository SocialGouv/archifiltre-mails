import { ipcMain } from "@common/lib/ipc";
import type { FileExporterService } from "@common/modules/FileExporterModule";
import {
    FileExporterError,
    isExporterAsFolderType,
} from "@common/modules/FileExporterModule";
import type { I18nService } from "@common/modules/I18nModule";
import type { ExportMailsFunction } from "@common/modules/pst-exporter/ipc";
import { PST_EXPORTER_EXPORT_MAILS_EVENT } from "@common/modules/pst-exporter/ipc";
import type {
    PstElement,
    PstEmail,
    PstFolder,
    PstShallowFolder,
} from "@common/modules/pst-extractor/type";
import type { SimpleObject } from "@common/utils/type";
import path from "path";

import { MainModule } from "./MainModule";
import type {
    PstCacheMainService,
    PstExtractorMainService,
} from "./PstExtractorModule";

export class PstExporterModule extends MainModule {
    private inited = false;

    constructor(
        private readonly fileExporterService: FileExporterService,
        private readonly pstExtractorService: PstExtractorMainService,
        private readonly i18nService: I18nService,
        private readonly pstCacheService: PstCacheMainService
    ) {
        super();
    }

    public async init(): pvoid {
        if (this.inited) {
            return;
        }

        await this.i18nService.wait();
        await this.fileExporterService.wait();

        ipcMain.handle(PST_EXPORTER_EXPORT_MAILS_EVENT, async (_, options) => {
            return this.exportMails(options);
        });

        this.inited = true;
        return Promise.resolve();
    }

    private readonly exportMails: ExportMailsFunction = async ({
        type,
        deletedIds,
        dest,
    }) => {
        if (!this.inited) {
            throw new FileExporterError(
                "Can't export to desired type as the module is not inited."
            );
        }

        let destPath = dest;

        const indexes = await this.pstCacheService.getPstMailIndexes();
        const emails = await this.pstExtractorService.getEmails([
            ...indexes.values(),
        ]);
        let obj = null;
        if (isExporterAsFolderType(type)) {
            const pstFilename = await this.pstCacheService.getAddtionalDatas(
                "pstFilename"
            );
            destPath = path.join(dest, `/${pstFilename}-${type}-export`);
            const folderStruct = await this.pstCacheService.getAddtionalDatas(
                "folderStructure"
            );
            obj = this.composePstElement(folderStruct, emails);
        } else obj = this.formatEmails(emails, deletedIds);

        await this.fileExporterService.export(type, obj, destPath);
    };

    /**
     * Format the given emails list into a "readable" JSON for exporters to use.
     */
    private formatEmails(
        emails: PstEmail[],
        deletedIds?: string[]
    ): SimpleObject[] {
        const { t } = this.i18nService.i18next;
        const deleteTag = t("exporter.table.tag.delete");
        const untagTag = t("exporter.table.tag.untag");

        const tKeys = {
            attachmentCount: t("exporter.table.attachment-count"),
            attachmentsFilename: t("exporter.table.attachments.filename"),
            attachmentsFilesize: t("exporter.table.attachments.filesize"),
            bccEmail: t("exporter.table.bcc.email"),
            bccName: t("exporter.table.bcc.name"),
            ccEmail: t("exporter.table.cc.email"),
            ccName: t("exporter.table.cc.name"),
            contentText: t("exporter.table.content-text"),
            elementPath: t("exporter.table.element-path"),
            fromEmail: t("exporter.table.from.email"),
            fromName: t("exporter.table.from.name"),
            id: t("exporter.table.id"),
            receivedDate: t("exporter.table.received-date"),
            sentTime: t("exporter.table.send-time"),
            subject: t("exporter.table.subject"),
            tag: t("exporter.table.tag"),
            toEmail: t("exporter.table.to.email"),
            toName: t("exporter.table.to.name"),
        };

        return emails.map((email) => ({
            [tKeys.id]: email.id,
            [tKeys.receivedDate]: email.receivedDate,
            [tKeys.sentTime]: email.sentTime,
            [tKeys.fromName]: email.from.name,
            [tKeys.fromEmail]: email.from.email ?? "",
            [tKeys.toName]: email.to.map((to) => to.name).join(","),
            [tKeys.toEmail]: email.to.map((to) => to.email).join(","),
            [tKeys.ccName]: email.cc.map((cc) => cc.name).join(","),
            [tKeys.ccEmail]: email.cc.map((cc) => cc.email).join(","),
            [tKeys.bccName]: email.bcc.map((bcc) => bcc.name).join(","),
            [tKeys.bccEmail]: email.bcc.map((bcc) => bcc.email).join(","),
            [tKeys.subject]: email.subject,
            [tKeys.attachmentCount]: email.attachmentCount,
            [tKeys.attachmentsFilesize]: email.attachments
                .map((attachement) => attachement.filesize)
                .join(","),
            [tKeys.attachmentsFilename]: email.attachments
                .map((attachement) => attachement.filename)
                .join(","),
            [tKeys.contentText]: email.contentText,
            [tKeys.tag]: deletedIds?.includes(email.id) ? deleteTag : untagTag,
            [tKeys.elementPath]: email.elementPath,
        }));
    }

    private composePstElement(
        folderStructure: PstShallowFolder,
        emails: PstEmail[]
    ): PstElement {
        let root = true;
        const rec = (shallowFolder: PstShallowFolder) => {
            const pstFolder: PstFolder = {
                elementPath: shallowFolder.elementPath,
                emailCount: shallowFolder.mails.length,
                id: shallowFolder.id,
                name: shallowFolder.name,
                size: shallowFolder.mails.length || 1,
                type: "folder",
            };
            if (root) {
                root = false;
                pstFolder.type = "rootFolder";
            }

            if (shallowFolder.hasSubfolders) {
                for (const childFolder of shallowFolder.subfolders) {
                    if (!pstFolder.children) {
                        pstFolder.children = [];
                    }

                    pstFolder.children.push(rec(childFolder));
                }
            }

            for (const emailId of shallowFolder.mails) {
                const email = emails.find((message) => message.id === emailId);
                if (!email) continue;
                if (!pstFolder.children) {
                    pstFolder.children = [];
                }

                email.elementPath = shallowFolder.elementPath;

                pstFolder.children.push(email);
            }

            return pstFolder;
        };

        return rec(folderStructure);
    }
}
