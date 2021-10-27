/**
 * Convert enum or readonly array to their mutable equivalent.
 */
export type MutableArray<T> = T extends readonly (infer U)[] ? U[] : never;

/**
 * Hack for union string litteral with string to keep autocomplete.
 */
export type UnknownMapping = string & { _?: never };

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface long {
    high: number;
    low: number;
    unsigned: boolean;
}
