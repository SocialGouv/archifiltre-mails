export const SupportedLocales = ["fr-FR", "en-GB", "de-DE"] as const;
export type Locale = typeof SupportedLocales[number];
export const DEFAULT_LOCALE: Locale = "fr-FR";

/* eslint-disable @typescript-eslint/consistent-type-imports */
export interface LocaleFileResources {
    translation: typeof import("../../../static/locales/fr-FR/translation.json");
    common: typeof import("../../../static/locales/fr-FR/common.json");
}
/* eslint-enable @typescript-eslint/consistent-type-imports */
export type Namespace = keyof LocaleFileResources;

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

// https://react.i18next.com/latest/typescript
declare module "react-i18next" {
    interface CustomTypeOptions {
        resources: LocaleFileResources;
    }
}
