/**
 * Convert enum or readonly array to their mutable equivalent.
 */
export type MutableArray<T> = T extends readonly (infer U)[] ? U[] : never;

/**
 * Hack for union string litteral with string to keep autocomplete.
 */
export type UnknownMapping = string & { _?: never };

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

export type SimpleObject<T = unknown> = Record<string, T>;
export type AnyFunction = (...args: unknown[]) => unknown;
export type EveryFunction = (...args: Any[]) => Any;
export type VoidFunction = () => void;
export type VoidArgsFunction<TArgs extends Any[] = Any[]> = (
    ...args: TArgs
) => void;

export type UnboxPromise<T> = T extends Promise<infer R> ? UnboxPromise<R> : T;

export type StringKeyOf<T> = {
    [K in keyof T]: K extends string ? K : never;
}[keyof T];

// eslint-disable-next-line @typescript-eslint/ban-types -- target instance objects
export type MethodNames<T extends Object> = {
    [P in keyof T]: T[P] extends EveryFunction ? P : never;
}[keyof T];

export type Objectize<T> = { [K in keyof T]: T[K] };

export interface FixedLengthArray<T, TLength extends number> extends Array<T> {
    "0": T;
    length: TLength;
}

/**
 * When using abstract class, return a simulated extended class type without having to target a "real" sub class.
 */
export type ExtendedClass<T extends abstract new (...args: Any) => Any> =
    T extends abstract new (...args: infer TArgs) => infer TInstance
        ? new (...args: TArgs) => TInstance
        : never;
export type ImplementedClass<T> =
    | (abstract new (...args: Any[]) => T)
    | (new (...args: Any[]) => T);

export type UnionToIntersection<TUnion> = (
    TUnion extends Any ? (k: TUnion) => void : never
) extends (k: infer I) => void
    ? I
    : never;
type UnionToOverloads<TUnion> = UnionToIntersection<
    TUnion extends Any ? (f: TUnion) => void : never
>;
export type PopUnion<TUnion> = UnionToOverloads<TUnion> extends (
    a: infer A
) => void
    ? A
    : never;

export type UnionConcat<
    TUnion extends string,
    TSep extends string = ","
> = PopUnion<TUnion> extends infer Self
    ? Self extends string
        ? Exclude<TUnion, Self> extends never
            ? Self
            :
                  | Self
                  | UnionConcat<Exclude<TUnion, Self>, TSep>
                  | `${UnionConcat<Exclude<TUnion, Self>, TSep>}${TSep}${Self}`
        : never
    : never;

/**
 * Split literal strings with optional split char and return a tuple of literals.
 *
 * ```ts
 * // default split char: ","
 * type LitTuple1 = Split<"a,b,c,d"> // ["a","b","c","d"]
 * // defined split char
 * type LitTuple2 = Split<"a.b.c.d", "."> // ["a","b","c","d"]
 * // missing split char
 * type LitTuple3 = Split<"a.b.c.d"> // ["a.b.c.d"]
 * ```
 */
export type Split<
    T extends string,
    TSep extends string = ","
> = T extends `${infer Part}${TSep}${infer Rest}`
    ? [Part, ...Split<Rest, TSep>]
    : T extends string
    ? [T]
    : never;

/**
 * Hacky type to remove readonly on each property
 */
export type UnReadOnly<T> = {
    -readonly [K in keyof T]: T[K];
};

// ===== Dummy type fonction and guards
export const unreadonly = <T>(value: T): UnReadOnly<T> => value;
