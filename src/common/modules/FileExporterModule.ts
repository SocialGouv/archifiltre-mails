import { Use } from "@lsagetlethias/tstrait";
import { ipcMain, ipcRenderer } from "electron";

import { IS_MAIN } from "../config";
import { WaitableTrait } from "../utils/WaitableTrait";
import { IsomorphicService } from "./ContainerModule";
import { csvExporter } from "./exporters/CsvExporter";
import type { Exporter } from "./exporters/Exporter";
import { jsonExporter } from "./exporters/JsonExporter";
import { xlsxExporter } from "./exporters/XslxExporter";
import { IsomorphicModule } from "./Module";

const exporterTypes = ["csv", "json", "xlsx"] as const;
export type ExporterType = typeof exporterTypes[number];

const exporters: Record<ExporterType, Exporter> = {
    csv: csvExporter,
    json: jsonExporter,
    xlsx: xlsxExporter,
};

const FILE_EXPORTER_EXPORT_EVENT = "fileExporter.event.export";

type ExportFunction = (
    type: ExporterType,
    ...args: Parameters<Exporter["export"]>
) => Promise<void>;

export class FileExporterModule extends IsomorphicModule {
    private inited = false;

    private _service?: FileExporterService;

    public async init(): Promise<void> {
        if (this.inited) {
            return;
        }

        if (IS_MAIN) {
            ipcMain.handle(
                FILE_EXPORTER_EXPORT_EVENT,
                async (_, [type, obj, dest]: Parameters<ExportFunction>) => {
                    return this.export(type, obj, dest);
                }
            );
        }

        this.service.resolve();
        this.inited = true;
        return Promise.resolve();
    }

    public get service(): FileExporterService {
        return (
            this._service ??
            (this._service = new InnerFileExporterService(
                this.export
            ) as FileExporterService)
        );
    }

    private readonly export: ExportFunction = async (type, obj, dest) => {
        if (!this.inited) {
            throw new Error(
                "[FileExporterService] Can't export to desired type as the module is not inited."
            ); // TODO: proper ERROR management
        }
        if (IS_MAIN) await exporters[type].export(obj, dest);
        else
            await ipcRenderer.invoke(FILE_EXPORTER_EXPORT_EVENT, [
                type,
                obj,
                dest,
            ]);
    };
}

@Use(WaitableTrait)
class InnerFileExporterService extends IsomorphicService {
    public name = "FileExporterService";

    public constructor(private readonly _export: ExportFunction) {
        super();
    }

    public get export(): ExportFunction {
        return this._export;
    }

    /**
     * Map {@link Exporter}'s to their corresponding type.
     */
    public get exporterTypes(): typeof exporterTypes {
        return exporterTypes;
    }
}

export type FileExporterService = InnerFileExporterService & WaitableTrait;
