import type { SimpleObject } from "../../utils/type";

/**
 * An exporter creates file in a certain type from a given json array.
 */
export interface Exporter {
    export: <T extends SimpleObject>(obj: T[], dest: string) => Promise<void>;
}
