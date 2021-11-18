export const enum RecipientType {
    originator = 0x00000000,
    primary = 0x00000001,
    cc = 0x00000002,
    bcc = 0x00000003,
}

export const enum RecipientTags {
    sendable = 0x00000001,
}

/* eslint-disable @typescript-eslint/naming-convention */
export const enum AdditionalOutlookProperties {
    PR_RECIPIENT_DISPLAY_NAME = 0x5ff6,
}
/* eslint-enable @typescript-eslint/naming-convention */

// export type PstPropertyType = {
//     [T in keyof PSTObject]: T extends `get${infer R}Item`
//         ? R extends string
//             ? Lowercase<R>
//             : never
//         : never;
// }[keyof PSTObject];

// type AZ = __DEBUG_TYPE__<keyof PSTObject>;
// export const getCustomProperty = <T extends PSTObject>(obj: T) {

// };
