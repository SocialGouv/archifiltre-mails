import { csvExporter } from "./CsvExporter";
import { jsonExporter } from "./JsonExporter";
import { xlsxExporter } from "./XslxExporter";

export interface Exporter {
    export: <T>(obj: T[], path: string) => Promise<void>;
}

export const exporterType = ["csv", "json", "xlsx"] as const;
export type ExporterType = typeof exporterType[number];

export const exporters: Record<ExporterType, Exporter> = {
    csv: csvExporter,
    json: jsonExporter,
    xlsx: xlsxExporter,
};
