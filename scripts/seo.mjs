// Shared helpers for domain-aware SEO files. Used by vite.config.ts, prerender and the retarget script.

/** Validates and normalizes a site URL: https origin (http only for localhost), no trailing slash. */
export function normalizeSiteUrl(raw) {
  if (!raw) throw new Error('VITE_SITE_URL is not set. Copy .env.example to .env and set it.');
  let url;
  try {
    url = new URL(raw.trim());
  } catch {
    throw new Error(`VITE_SITE_URL is not a valid URL: "${raw}"`);
  }
  const local = ['localhost', '127.0.0.1'].includes(url.hostname);
  if (url.protocol !== 'https:' && !local) throw new Error(`VITE_SITE_URL must use https: "${raw}"`);
  if (url.pathname !== '/' || url.search || url.hash) {
    throw new Error(`VITE_SITE_URL must be an origin without path, query or hash: "${raw}"`);
  }
  return url.origin;
}

/** Public, indexable pages: one per language. Sections are anchors on each page. */
export const PAGES = [
  { path: '/', lang: 'nl' },
  { path: '/en/', lang: 'en' },
];

export function robotsTxt(siteUrl, noindex = false) {
  return noindex ? 'User-agent: *\nDisallow: /\n' : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

export function sitemapXml(siteUrl, lastmod = new Date().toISOString().slice(0, 10)) {
  const alternates = [
    ...PAGES.map((p) => `    <xhtml:link rel="alternate" hreflang="${p.lang}" href="${siteUrl}${p.path}" />`),
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${siteUrl}/" />`,
  ].join('\n');
  const urls = PAGES.map(
    (p) =>
      `  <url>\n    <loc>${siteUrl}${p.path}</loc>\n${alternates}\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>${p.path === '/' ? '1.0' : '0.9'}</priority>\n  </url>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`;
}
