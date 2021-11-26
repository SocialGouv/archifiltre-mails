/* eslint-disable @typescript-eslint/naming-convention */
import type { WorkBook } from "xlsx";
import { utils, writeFile } from "xlsx";

import type { Exporter } from "./Exporter";

/**
 * Export JSON to Excel .xslx file.
 */
export const xlsxExporter: Exporter = {
    async export<T>(obj: T[], path: string) {
        console.log("Generate XLSX");
        const sheet = utils.json_to_sheet(obj, {
            WTF: true,
            cellDates: true,
            dateNF: "dd/MM/yyyy hh:mm",
        });
        const Sheets: WorkBook["Sheets"] = {
            "Export PST": sheet,
        };
        const book: WorkBook = {
            SheetNames: Object.keys(Sheets),
            Sheets,
        };

        console.log("And write");
        return Promise.resolve(writeFile(book, path));
    },
};
