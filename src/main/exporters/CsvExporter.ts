import { writeFile } from "fs/promises";
import { Parser } from "json2csv";

import type { Exporter } from "./Exporter";

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
