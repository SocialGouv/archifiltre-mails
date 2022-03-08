import { randomBytes } from "crypto";

import type { Any } from "./type";

/**
 * Generate a random string of 20 hex char by default.
 *
 * **Should not be used for unique id purpose** => use `symbol`, `unique symbol`, the `uuid` lib instead.
 *
 * @param length Length of the generated string. 20 by default.
 * @returns The generated random string in hex char.
 */
export const randomString = (length = 20): string =>
    randomBytes(length).toString("hex");

/**
 * Split a string into chunks with defined length.
 *
 * @param input The input string to split
 * @param length The length of each chunk
 * @returns An array of chunks
 *
 * @example
 * ```ts
 *   chunkString("ABCDEFG", 2); // ['AB', 'CD', 'EF', 'G']
 *   chunkString("ABCDEFG", 7); // ['ABCDEFG']
 * ```
 */
export const chunkString = (input: string, length: number): string[] => {
    if (input.length <= length) {
        return [input];
    }

    const result = [];
    let tmp = input;
    let chunk = "";
    while ((chunk = tmp.substr(0, length))) {
        result.push(chunk);
        tmp = tmp.substring(length);
    }

    return result;
};

/**
 * Stub function to use like "noop" but as a safe guard when a feature is not implemented.
 */
export const notImplemented = (..._args: Any[]): Any | Promise<Any> => {
    throw new Error("Not implemented");
};

// TODO do propre things ...
export const toDecimalsFloat = (n: number, decimals: number): number => {
    const mult = Math.pow(10, decimals);
    return Math.round(n * mult) / mult;
};
export const toOneDecimalsFloat = (n: number): number =>
    Math.round(n * 10) / 10;
export const toTwoDecimalsFloat = (n: number): number =>
    Math.round(n * 100) / 100;

export const getPercentage = (
    current: number,
    total: number,
    decimals = 2
): number => toDecimalsFloat((current / total) * 100, decimals);

export const bytesToGigabytes = (bytes: number, decimals = 1): number =>
    toDecimalsFloat(bytes / 1.0e9, decimals);

export const bytesToMegabytes = (bytes: number, decimals = 1): number =>
    toDecimalsFloat(bytes / 1.0e6, decimals);

export const bytesToKilobytes = (bytes: number, decimals = 1): number =>
    toDecimalsFloat(bytes / 1000, decimals);
