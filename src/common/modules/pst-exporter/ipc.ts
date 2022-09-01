import type { ExporterType } from "../FileExporterModule";
import type { PstMailIndex } from "../pst-extractor/type";

declare module "../../lib/ipc/event" {
    interface AsyncIpcMapping {
        "pstExporter.event.exportMails": IpcConfig<
            [
                type: ExporterType,
                indexes: PstMailIndex[],
                deletedIds: string[],
                dest: string
            ],
            void
        >;
    }
}

export {};
