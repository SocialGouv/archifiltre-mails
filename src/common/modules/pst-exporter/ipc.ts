import type { ExporterType } from "../FileExporterModule";

export const PST_EXPORTER_EXPORT_MAILS_EVENT = "pstExporter.event.exportMails";
export interface ExportMailsOptions {
    deletedIds?: string[];
    dest: string;
    type: ExporterType;
}
export type ExportMailsFunction = (options: ExportMailsOptions) => pvoid;

declare module "../../lib/ipc/event" {
    interface AsyncIpcMapping {
        [PST_EXPORTER_EXPORT_MAILS_EVENT]: IpcConfigFromFunction<ExportMailsFunction>;
    }
}
