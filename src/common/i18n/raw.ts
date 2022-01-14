export const SupportedLocales = ["fr-FR", "en-GB", "de-DE"] as const;
export type Locale = typeof SupportedLocales[number];
export const DEFAULT_LOCALE: Locale = "fr-FR";

/* eslint-disable @typescript-eslint/consistent-type-imports */
export interface NamespacesKeys {
    translation: keyof typeof import("../../../static/locales/fr-FR/translation.json");
}
/* eslint-enable @typescript-eslint/consistent-type-imports */
export type Namespace = keyof NamespacesKeys;

/**
 * Valid a given locale or return the default.
 *
 * Locale should have the format: **"en-GB"**
 *
 * @param locale Some string locale
 * @returns Formated locale or {@link DEFAULT_LOCALE} if not valid
 * @see {@link SupportedLocales}
 */
export const validLocale = (locale: string): Locale =>
    (SupportedLocales as readonly string[]).includes(locale)
        ? (locale as Locale)
        : DEFAULT_LOCALE;

// declare module "i18next" {
//     type GetNamespaceKeysFromOptions<
//         T extends TOptions,
//         TKeys extends TFunctionKeys = Namespace
//     > = T["ns"] extends undefined
//         ? NamespacesKeys["translation"]
//         : T["ns"] extends Namespace
//         ? NamespacesKeys[T["ns"]]
//         : T["ns"] extends Namespace[]
//         ? NamespacesKeys[T["ns"][number]]
//         : TKeys | TKeys[];
//     interface TFunction {
//         // basic usage
//         // eslint-disable-next-line prettier/prettier
//         <TResult extends TFunctionResult = string, TKeys extends TFunctionKeys = Namespace, TInterpolationMap extends object = StringMap>(
//             key: typeof options extends infer R
//                 ? R extends string
//                     ? TKeys | TKeys[]
//                     : R extends undefined
//                     ? TKeys | TKeys[]
//                     : GetNamespaceKeysFromOptions<R>
//                 : never,
//             options?: TOptions<TInterpolationMap> | string
//         ): TResult;
//         // overloaded usage
//         <
//             TResult extends TFunctionResult = string,
//             TKeys extends TFunctionKeys = string,
//             TInterpolationMap extends object = StringMap
//         >(
//             key: TKeys | TKeys[],
//             defaultValue?: string,
//             options?: TOptions<TInterpolationMap> | string
//         ): TResult;
//     }
// }
