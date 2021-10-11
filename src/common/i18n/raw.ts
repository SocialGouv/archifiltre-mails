export const SupportedLocales = ["de-DE", "en-GB", "fr-FR"] as const;
export type Locale = typeof SupportedLocales[number];
export const DEFAULT_LOCALE: Locale = "fr-FR";
export const validLocale = (locale: string): Locale => {
    console.log("GIVEN LOCALE", locale);
    return (SupportedLocales as readonly string[]).includes(locale)
        ? (locale as Locale)
        : DEFAULT_LOCALE;
};
