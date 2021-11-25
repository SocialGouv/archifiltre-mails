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

/**
 * Get direct subkeys of a given non array object and/or unpack a subarray type to use its keys as subkeys.
 *
 * @example
 * ```ts
 *  interface MyObject {
 *      foo: {
 *          bar: string;
 *      };
 *      baz: {
 *          qux: string
 *      }[];
 *  }
 *
 *  // DirectOrUnpackedChainedSubKeyOf<MyObject> = "foo.bar" | "baz.qux"; (and not "baz.length" | "baz.push" | ...)
 * ```
 */
export type DirectOrUnpackedChainedSubKeyOf<T> = {
    [Key in keyof T]: Key extends string
        ? T[Key] extends object // eslint-disable-line @typescript-eslint/ban-types
            ? T[Key] extends (infer R)[]
                ? R extends object // eslint-disable-line @typescript-eslint/ban-types
                    ? {
                          [SubArrayKey in keyof R]: SubArrayKey extends string
                              ? `${Key}.${SubArrayKey}`
                              : never;
                      }[keyof R]
                    : never
                : {
                      [SubKey in keyof T[Key]]: SubKey extends string
                          ? `${Key}.${SubKey}`
                          : never;
                  }[keyof T[Key]]
            : never
        : never;
}[keyof T];

export type KeyAndSubKeyOf<T> = DirectOrUnpackedChainedSubKeyOf<T> | keyof T;
