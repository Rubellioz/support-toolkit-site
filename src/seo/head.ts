/**
 * Language-specific <head> tags. Pure TypeScript (no DOM, no JSX), used by the Vite dev server and the
 * build-time prerender. It is not part of the browser bundle.
 *
 * Every absolute URL is derived from `siteUrl` (VITE_SITE_URL). Nothing here hardcodes a domain.
 */
import { messages } from '../i18n/messages.ts';
import { LANGS, langPath, locale, type Lang } from '../i18n/lang.ts';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');

export function renderHead(lang: Lang, siteUrl: string, noindex = false): string {
  const m = messages[lang].meta;
  const url = `${siteUrl}${langPath(lang)}`;
  const ogLocale = (l: Lang) => locale[l].replace('-', '_');
  const ogImage = `${siteUrl}/og-image${lang === 'nl' ? '' : `-${lang}`}.png`;
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Support Toolkit',
    url,
    image: ogImage,
    inLanguage: locale[lang],
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    description: m.ogDescription,
  };
  return [
    `<title>${esc(m.title)}</title>`,
    `<meta name="description" content="${esc(m.description)}" />`,
    `<meta name="robots" content="${noindex ? 'noindex, nofollow' : 'index, follow'}" />`,
    `<link rel="canonical" href="${url}" />`,
    ...LANGS.map((l) => `<link rel="alternate" hreflang="${l}" href="${siteUrl}${langPath(l)}" />`),
    `<link rel="alternate" hreflang="x-default" href="${siteUrl}${langPath('nl')}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="Support Toolkit" />`,
    `<meta property="og:locale" content="${ogLocale(lang)}" />`,
    ...LANGS.filter((l) => l !== lang).map((l) => `<meta property="og:locale:alternate" content="${ogLocale(l)}" />`),
    `<meta property="og:title" content="${esc(m.title)}" />`,
    `<meta property="og:description" content="${esc(m.ogDescription)}" />`,
    `<meta property="og:url" content="${url}" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${esc(m.ogImageAlt)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
    `<script type="application/ld+json">${JSON.stringify(jsonLd)}</script>`,
  ]
    .map((line) => `    ${line}`)
    .join('\n');
}
