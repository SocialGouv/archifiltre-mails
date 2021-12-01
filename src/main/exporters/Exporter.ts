import type { SimpleObject } from "@common/utils/type";

import { csvExporter } from "./CsvExporter";
import { jsonExporter } from "./JsonExporter";
import { xlsxExporter } from "./XslxExporter";

/**
 * An exporter creates file in a certain {@link exporterType} from a given json array.
 */
export interface Exporter {
    export: <T extends SimpleObject>(obj: T[], path: string) => Promise<void>;
}

export const exporterType = ["csv", "json", "xlsx"] as const;
export type ExporterType = typeof exporterType[number];

/**
 * Map {@link Exporter}'s to their corresponding type.
 */
export const exporters: Record<ExporterType, Exporter> = {
    csv: csvExporter,
    json: jsonExporter,
    xlsx: xlsxExporter,
};
