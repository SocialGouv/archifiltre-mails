/* eslint-disable @typescript-eslint/naming-convention */
import type { WorkBook } from "xlsx";
import { utils, writeFile } from "xlsx";

import { logger } from "../../logger";
import { chunkString } from "../../utils";
import type { SimpleObject } from "../../utils/type";
import type { JsonExporter } from "./Exporter";

const MAX_CELL_LENGTH = 32767;

/**
 * Export JSON to Excel .xslx file.
 */
export const xlsxExporter: JsonExporter = {
    async export<T extends SimpleObject>(obj: T[], dest: string) {
        logger.info("[XlsxExporter] Generate XLSX");
        const sheet = utils.json_to_sheet(sanitize(obj), {
            WTF: true,
            cellDates: true,
            dateNF: "dd/MM/yyyy hh:mm", // TODO: i18n
        });
        const Sheets: WorkBook["Sheets"] = {
            "Export PST": sheet,
        };
        const book: WorkBook = {
            SheetNames: Object.keys(Sheets),
            Sheets,
        };

        logger.info("[XlsxExporter] And write");
        await writeFile(book, dest);
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
