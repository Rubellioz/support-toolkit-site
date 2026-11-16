#!/usr/bin/env node
// Post-build checks: domain consistency, no future-domain leakage, assets resolvable, prerender present.
//   node scripts/verify-dist.mjs [distDir]
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, resolve, relative } from 'node:path';

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

const index = readFileSync(join(dist, 'index.html'), 'utf8');
const canonical = index.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical) errors.push('index.html: missing canonical link');
const origin = canonical ? new URL(canonical).origin : '';

for (const file of files) {
  if (!/\.(html|txt|xml|js|css|json|webmanifest)$/.test(file)) continue;
  const rel = relative(dist, file);
  const text = readFileSync(file, 'utf8');
  // 1. The future domain must not appear unless it is the active domain.
  if (origin !== `https://${FUTURE}` && new RegExp(`(?<![\\w-])${FUTURE.replace('.', '\\.')}`).test(text)) {
    errors.push(`${rel}: references the future domain ${FUTURE}`);
  }
  // 2. Bundles must stay domain-agnostic.
  const ownHost = origin && new RegExp(`(?<![\\w.-])${new URL(origin).host.replaceAll('.', '\\.')}`);
  if (/\.(js|css)$/.test(file) && ownHost && ownHost.test(text)) {
    errors.push(`${rel}: bundle contains the site domain (use relative URLs)`);
  }
}

// 3. Every site-URL in the SEO metadata uses the canonical origin.
const seoUrls = [
  ...index.matchAll(/<meta (?:property|name)="(?:og:url|og:image|twitter:image)" content="([^"]+)"/g),
  ...index.matchAll(/"(?:url|image)": "([^"]+)"/g),
].map((m) => m[1]);
if (seoUrls.length < 5) errors.push(`index.html: expected 5 domain-aware SEO URLs, found ${seoUrls.length}`);
const robots = existsSync(join(dist, 'robots.txt')) ? readFileSync(join(dist, 'robots.txt'), 'utf8') : '';
const sitemapRef = robots.match(/Sitemap: (\S+)/)?.[1];
if (sitemapRef) seoUrls.push(sitemapRef);
for (const u of seoUrls) if (!u.startsWith(origin + '/')) errors.push(`SEO URL ${u} does not use canonical origin ${origin}`);

// 4. Local asset references resolve.
for (const m of index.matchAll(/(?:src|href)="(\/[^"#?]*)"/g)) {
  if (m[1] === '/') continue;
  if (!existsSync(join(dist, m[1]))) errors.push(`index.html: missing asset ${m[1]}`);
}
// 5. Prerendered content and required SEO files.
if (!/<h1[^>]*>/.test(index)) errors.push('index.html: no prerendered <h1> (prerender step failed?)');
for (const f of ['robots.txt', 'sitemap.xml', '404.html', '.htaccess', 'og-image.png']) {
  if (!existsSync(join(dist, f))) errors.push(`missing ${f}`);
}
if (existsSync(join(dist, 'sitemap.xml')) && !readFileSync(join(dist, 'sitemap.xml'), 'utf8').includes(`<loc>${origin}/</loc>`)) {
  errors.push('sitemap.xml: <loc> does not match canonical origin');
}

if (errors.length) {
  console.error(`✗ dist verification failed (${errors.length}):\n  - ${errors.join('\n  - ')}`);
  process.exit(1);
}
console.log(`✓ dist verified · canonical ${origin} · ${files.length} files`);
