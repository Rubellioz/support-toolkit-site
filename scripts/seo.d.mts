export function normalizeSiteUrl(raw: string | undefined): string;
export const PAGES: { path: string; lang: string }[];
export function robotsTxt(siteUrl: string, noindex?: boolean): string;
export function sitemapXml(siteUrl: string, lastmod?: string): string;
