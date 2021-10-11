/**
 * Convert enum or readonly array to their mutable equivalent
 */
export type MutableArray<T> = T extends readonly (infer U)[] ? U[] : never;
