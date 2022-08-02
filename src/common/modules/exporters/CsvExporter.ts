import { writeFile } from "fs/promises";
import { Parser } from "json2csv";

import type { SimpleObject } from "../../utils/type";
import type { JsonExporter } from "./Exporter";
// eslint-disable-next-line unused-imports/no-unused-imports
import type { xlsxExporter } from "./XslxExporter";

/**
 * Export JSON to .csv file. For Excel, use {@link xlsxExporter} instead.
 */
export const csvExporter: JsonExporter = {
    async export<T extends SimpleObject>(obj: T[], dest: string) {
        console.log("Generate CSV...");
        const parser = new Parser<T>({
            excelStrings: true,
        });

        const data = parser.parse(obj);
        console.log("Export...");
        await writeFile(dest, data, {
            encoding: "utf-8",
        });
        console.info("Done!");
    },
};
