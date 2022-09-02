import type { ExporterType } from "../FileExporterModule";

export const PST_EXPORTER_EXPORT_MAILS_EVENT = "pstExporter.event.exportMails";
declare module "../../lib/ipc/event" {
    interface AsyncIpcMapping {
        [PST_EXPORTER_EXPORT_MAILS_EVENT]: IpcConfig<
            [type: ExporterType, deletedIds: string[], dest: string],
            void
        >;
    }
}

export {};
