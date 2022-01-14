export const SupportedLocales = ["de-DE", "en-GB", "fr-FR"] as const;
export type Locale = typeof SupportedLocales[number];
export const DEFAULT_LOCALE: Locale = "fr-FR";
export const KnownNamespaces = ["translation"] as const;
export type Namespace = typeof KnownNamespaces[number];

export type { default as translation } from "../../../static/locales/fr-FR/translation.json";

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
