/** Supported languages. Dutch is the default and lives at "/", English at "/en/". */
export type Lang = 'nl' | 'en';
export const LANGS: Lang[] = ['nl', 'en'];
export const DEFAULT_LANG: Lang = 'nl';

/** Site-relative path of each language version. */
export const langPath = (lang: Lang) => (lang === 'nl' ? '/' : '/en/');

/** Language of a URL path ("/en", "/en/…" → en, everything else → nl). */
export const langFromPath = (path: string): Lang => (/^\/en(\/|$)/.test(path) ? 'en' : 'nl');

/** BCP 47 locale used for number formatting and Open Graph. */
export const locale: Record<Lang, string> = { nl: 'nl-NL', en: 'en-GB' };
