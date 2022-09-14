import { ipcRenderer } from "@common/lib/ipc";
import type { Service } from "@common/modules/container/type";
import type { ExportMailsFunction } from "@common/modules/pst-exporter/ipc";
import { PST_EXPORTER_EXPORT_MAILS_EVENT } from "@common/modules/pst-exporter/ipc";

export interface PstExporterService extends Service {
    exportMails: ExportMailsFunction;
}

export const pstExporterService: PstExporterService = {
    async exportMails(options) {
        return ipcRenderer.invoke(PST_EXPORTER_EXPORT_MAILS_EVENT, options);
    },

    name: "PstExporterService",
};
