/** Shared status vocabulary for every demo view. */
export type Status = 'ok' | 'warn' | 'bad' | 'info' | 'pending';

/** Picks the localized variant: L({ en: 'Valid', nl: 'Geldig' }). */
export type Localized<T> = { en: T; nl: T };
