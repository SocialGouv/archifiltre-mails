import { writeFile } from "fs/promises";

import type { Exporter } from "./Exporter";

/**
 * Export JSON to .json file.
 */
export const jsonExporter: Exporter = {
    async export<T>(obj: T[], path: string): Promise<void> {
        const data = JSON.stringify(obj, null, 2);

        await writeFile(path, data, {
            encoding: "utf-8",
        });
    },
};
