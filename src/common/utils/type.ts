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

export type Nothing = never | 0 | null | undefined;
/**
 * Stub to trick eslint.
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Any = any;

/**
 * Force expand a type for debug purpose. Don't work on every type.
 * @deprecated
 */
// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/ban-types
export type __DEBUG_TYPE__<T> = { [P in keyof T]: T[P] } & {};
