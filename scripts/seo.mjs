// Shared helpers for domain-aware SEO files. Used by vite.config.ts and the retarget script.

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

/** Public, indexable paths. Single-page site: sections are anchors on "/". */
export const PAGES = [{ path: '/', changefreq: 'monthly', priority: '1.0' }];

export function robotsTxt(siteUrl, noindex = false) {
  return noindex
    ? 'User-agent: *\nDisallow: /\n'
    : `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;
}

export function sitemapXml(siteUrl, lastmod = new Date().toISOString().slice(0, 10)) {
  const urls = PAGES.map(
    (p) =>
      `  <url>\n    <loc>${siteUrl}${p.path}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>${p.changefreq}</changefreq>\n    <priority>${p.priority}</priority>\n  </url>`,
  ).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
