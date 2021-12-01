/* eslint-disable @typescript-eslint/naming-convention */
import { chunkString } from "@common/utils";
import type { SimpleObject } from "@common/utils/type";
import type { WorkBook } from "xlsx";
import { utils, writeFile } from "xlsx";

import type { Exporter } from "./Exporter";

const MAX_CELL_LENGTH = 32767;

/**
 * Export JSON to Excel .xslx file.
 */
export const xlsxExporter: Exporter = {
    async export<T extends SimpleObject>(obj: T[], path: string) {
        console.log("Generate XLSX");
        const sheet = utils.json_to_sheet(sanitize(obj), {
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

type PossiblyChunkedObject<T extends SimpleObject> = T & {
    [K in keyof T as K extends string
        ? T[K] extends string
            ? `${K} (${number})`
            : K
        : K]: T[K];
};

/**
 * Cut properties into multiple if string size is greater than max cell length.
 */
const sanitize = <T extends SimpleObject>(
    obj: T[]
): PossiblyChunkedObject<T>[] => {
    if (!obj[0]) {
        return [];
    }
    const keys = Object.keys(obj[0]);
    return obj.map((item) => {
        const result = {} as SimpleObject;
        for (const key of keys) {
            const value = item[key];
            if (typeof value === "string") {
                if (value.length <= MAX_CELL_LENGTH) {
                    result[key] = value;
                } else {
                    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
                    delete result[key];
                    chunkString(value, MAX_CELL_LENGTH).forEach(
                        (chunk, index) => {
                            result[`${key} (${index + 1})`] = chunk;
                        }
                    );
                }
            } else {
                result[key] = value;
            }
        }

        return result as PossiblyChunkedObject<T>;
    });
};
