import { locale, type Lang } from './lang';

/** Euro amounts in the visitor's language: "€ 4.100" (nl) or "€4,100" (en). */
export const formatEur = (n: number, lang: Lang, digits = 0) =>
  new Intl.NumberFormat(locale[lang], { style: 'currency', currency: 'EUR', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
