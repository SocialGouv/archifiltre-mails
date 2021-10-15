import { randomBytes } from "crypto";

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
