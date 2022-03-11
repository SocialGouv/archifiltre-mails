import { Use } from "@lsagetlethias/tstrait";
import { ipcMain, ipcRenderer } from "electron";
import { stat } from "fs/promises";

import { IS_MAIN } from "../config";
import { AppError } from "../lib/error/AppError";
import { bytesToMegabytes } from "../utils";
import { WaitableTrait } from "../utils/WaitableTrait";
import { IsomorphicService } from "./ContainerModule";
import { csvExporter } from "./exporters/CsvExporter";
import type { Exporter } from "./exporters/Exporter";
import { jsonExporter } from "./exporters/JsonExporter";
import { xlsxExporter } from "./exporters/XslxExporter";
import { IsomorphicModule } from "./Module";
import type { TrackerService } from "./TrackerModule";

export class FileExporterError extends AppError {}

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

/**
 * Isomorphic module responsible for handling exports capabilities of the app.
 *
 * An export is a conversion from an data input to a file output.
 */
export class FileExporterModule extends IsomorphicModule {
    private inited = false;

    private _service?: FileExporterService;

    constructor(private readonly trackerService: TrackerService) {
        super();
    }

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

    public async uninit(): Promise<void> {
        this.inited = false;
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
            throw new FileExporterError(
                "Can't export to desired type as the module is not inited."
            );
        }
        if (IS_MAIN) {
            await exporters[type].export(obj, dest);

            const sizeRaw = (await stat(dest)).size;
            this.trackerService.getProvider().track("Export Generated", {
                size: bytesToMegabytes(sizeRaw, 2),
                sizeRaw,
                type,
            });
        } else
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
