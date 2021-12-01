import { writeFile } from "fs/promises";
import { Parser } from "json2csv";

import type { Exporter } from "./Exporter";
// eslint-disable-next-line unused-imports/no-unused-imports
import type { xlsxExporter } from "./XslxExporter";

/**
 * Export JSON to .csv file. For Excel, use {@link xlsxExporter} instead.
 */
export const csvExporter: Exporter = {
    async export<T>(obj: T, path: string): Promise<void> {
        console.log("Generate CSV...");
        const parser = new Parser<T>({
            excelStrings: true,
        });

        const data = parser.parse(obj);
        console.log("Export...");
        await writeFile(path, data, {
            encoding: "utf-8",
        });
        console.info("Done!");
    },
};
