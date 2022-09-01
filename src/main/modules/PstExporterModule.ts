import { ipcMain } from "@common/lib/ipc";
import type { GetAsyncIpcConfig } from "@common/lib/ipc/event";
import type { FileExporterService } from "@common/modules/FileExporterModule";
import {
    FileExporterError,
    isExporterAsFolderType,
} from "@common/modules/FileExporterModule";
import type { I18nService } from "@common/modules/I18nModule";
import type { PstEmail } from "@common/modules/pst-extractor/type";
import type { SimpleObject } from "@common/utils/type";

import { MainModule } from "./MainModule";
import type { PstExtractorMainService } from "./PstExtractorModule";

type ExportMailsFunction = (
    ...args: GetAsyncIpcConfig<"pstExporter.event.exportMails">["args"]
) => Promise<void>;

export class PstExporterModule extends MainModule {
    private inited = false;

    constructor(
        private readonly fileExporterService: FileExporterService,
        private readonly pstExporterService: PstExtractorMainService,
        private readonly i18nService: I18nService
    ) {
        super();
    }

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        await this.i18nService.wait();

        await this.fileExporterService.wait();

        ipcMain.handle(
            "pstExporter.event.exportMails",
            async (_, type, indexes, deletedIds, dest) => {
                return this.exportMails(type, indexes, deletedIds, dest);
            }
        );

        this.inited = true;
        return Promise.resolve();
    }

    private readonly exportMails: ExportMailsFunction = async (
        type,
        indexes,
        deletedIds,
        dest
    ) => {
        if (!this.inited) {
            throw new FileExporterError(
                "Can't export to desired type as the module is not inited."
            );
        }

        if (isExporterAsFolderType(type)) {
        }
        const emails = await this.pstExporterService.getEmails(indexes);

        const obj = this.formatEmails(emails, deletedIds);
        await this.fileExporterService.export(type, obj, dest);
    };

    /**
     * Format the given emails list into a "readable" JSON for exporters to use.
     */
    private formatEmails(
        emails: PstEmail[],
        deletedIds: string[]
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
            [tKeys.tag]: deletedIds.includes(email.id) ? deleteTag : untagTag,
            [tKeys.elementPath]: email.elementPath,
        }));
    }
}
