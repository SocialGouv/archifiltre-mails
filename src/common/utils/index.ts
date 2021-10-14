import { randomBytes } from "crypto";

export const randomString = (length = 20): string =>
    randomBytes(length).toString("hex");
