import type { SimpleObject } from "../../utils/type";
import type { PstElement } from "../pst-extractor/type";

export type ExportFunction<TSource> = <T extends TSource>(
    obj: T,
    dest: string
) => pvoid;

/**
 * An exporter creates file in a certain type from anything.
 */
export interface Exporter {
    export: ExportFunction<Any>;
}

/**
 * An json exporter creates file in a certain type from a given json array.
 */
export interface JsonExporter extends Exporter {
    export: ExportFunction<SimpleObject[]>;
}

/**
 * An pst exporter creates file in a certain type from a given json array of pst elements.
 */
export interface PstExporter extends Exporter {
    export: ExportFunction<PstElement>;
}
