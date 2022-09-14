import { writeFile } from "fs/promises";

import type { SimpleObject } from "../../utils/type";
import type { JsonExporter } from "./Exporter";

/**
 * Export JSON to .json file.
 */
export const jsonExporter: JsonExporter = {
    async export<T extends SimpleObject>(obj: T[], dest: string): pvoid {
        const data = JSON.stringify(obj, null, 2);

        await writeFile(dest, data, {
            encoding: "utf-8",
        });
    },
};
