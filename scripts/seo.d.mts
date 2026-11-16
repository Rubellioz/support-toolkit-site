export function normalizeSiteUrl(raw: string | undefined): string;
export const PAGES: { path: string; changefreq: string; priority: string }[];
export function robotsTxt(siteUrl: string, noindex?: boolean): string;
export function sitemapXml(siteUrl: string, lastmod?: string): string;
