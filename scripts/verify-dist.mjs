#!/usr/bin/env node
// Post-build checks: per-language pages, domain consistency, no future-domain leakage, assets resolvable.
//   node scripts/verify-dist.mjs [distDir]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';
import { PAGES } from './seo.mjs';

const dist = resolve(process.argv[2] ?? 'dist');
const FUTURE = 'support-toolkit.nl';
const errors = [];
const files = [];
(function walk(dir) {
  for (const f of readdirSync(dir)) {
    const p = join(dir, f);
    statSync(p).isDirectory() ? walk(p) : files.push(p);
  }
})(dist);

const read = (rel) => readFileSync(join(dist, rel), 'utf8');
const canonicalOf = (html) => html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
const rootCanonical = canonicalOf(read('index.html'));
if (!rootCanonical) errors.push('index.html: missing canonical link');
const origin = rootCanonical ? new URL(rootCanonical).origin : '';
const ownHost = origin && new RegExp(`(?<![\\w.-])${new URL(origin).host.replaceAll('.', '\\.')}`);

// 1. Every language page: right lang, canonical, hreflang set, prerendered content, consistent SEO URLs.
for (const page of PAGES) {
  const rel = `${page.path.slice(1)}index.html`;
  if (!existsSync(join(dist, rel))) {
    errors.push(`missing ${rel}`);
    continue;
  }
  const html = read(rel);
  if (!html.includes(`<html lang="${page.lang}">`)) errors.push(`${rel}: <html lang> is not "${page.lang}"`);
  if (canonicalOf(html) !== `${origin}${page.path}`) errors.push(`${rel}: canonical ${canonicalOf(html)} ≠ ${origin}${page.path}`);
  for (const p of PAGES) {
    if (!html.includes(`hreflang="${p.lang}" href="${origin}${p.path}"`)) errors.push(`${rel}: missing hreflang ${p.lang}`);
  }
  if (!/<h1[^>]*>/.test(html)) errors.push(`${rel}: no prerendered <h1>`);
  const seoUrls = [
    ...html.matchAll(/<meta (?:property|name)="(?:og:url|og:image|twitter:image)" content="([^"]+)"/g),
    ...html.matchAll(/"(?:url|image)":"([^"]+)"/g),
    ...html.matchAll(/hreflang="[^"]+" href="([^"]+)"/g),
  ].map((m) => m[1]);
  if (seoUrls.length < 8) errors.push(`${rel}: expected ≥ 8 domain-aware SEO URLs, found ${seoUrls.length}`);
  for (const u of seoUrls) if (!u.startsWith(origin + '/')) errors.push(`${rel}: SEO URL ${u} does not use ${origin}`);
  // Local asset references resolve (absolute paths, so they work from /en/ too).
  for (const m of html.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
    if (m[1] === '/' || m[1] === '/en/') continue;
    if (!existsSync(join(dist, m[1]))) errors.push(`${rel}: missing asset ${m[1]}`);
  }
}

// 2. No future domain anywhere; bundles stay domain-agnostic.
for (const file of files) {
  if (!/\.(html|txt|xml|js|css|json|webmanifest)$/.test(file)) continue;
  const rel = relative(dist, file);
  const text = readFileSync(file, 'utf8');
  if (origin !== `https://${FUTURE}` && new RegExp(`(?<![\\w-])${FUTURE.replace('.', '\\.')}`).test(text)) {
    errors.push(`${rel}: references the future domain ${FUTURE}`);
  }
  if (/\.(js|css)$/.test(file) && ownHost && ownHost.test(text)) errors.push(`${rel}: bundle contains the site domain`);
}

// 3. robots.txt, sitemap.xml and static files.
for (const f of ['robots.txt', 'sitemap.xml', '404.html', '.htaccess', 'og-image.png']) {
  if (!existsSync(join(dist, f))) errors.push(`missing ${f}`);
}
if (existsSync(join(dist, 'robots.txt'))) {
  const sm = read('robots.txt').match(/Sitemap: (\S+)/)?.[1];
  if (sm && sm !== `${origin}/sitemap.xml`) errors.push(`robots.txt: sitemap ${sm} does not use ${origin}`);
}
if (existsSync(join(dist, 'sitemap.xml'))) {
  const sm = read('sitemap.xml');
  for (const p of PAGES) if (!sm.includes(`<loc>${origin}${p.path}</loc>`)) errors.push(`sitemap.xml: missing <loc>${origin}${p.path}</loc>`);
}

if (errors.length) {
  console.error(`✗ dist verification failed (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log(`✓ dist verified · canonical ${origin} · ${PAGES.length} languages · ${files.length} files`);
