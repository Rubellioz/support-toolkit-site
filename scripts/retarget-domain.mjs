#!/usr/bin/env node
// Points an already built site at a new domain WITHOUT rebuilding.
//
//   node scripts/retarget-domain.mjs https://support-toolkit.nl [distDir]
//
// The JS/CSS bundles never contain the site's own domain; only the static SEO files do
// (index.html, 404.html, robots.txt, sitemap.xml). This rewrites exactly those.
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { normalizeSiteUrl } from './seo.mjs';

const [, , rawUrl, distArg = 'dist'] = process.argv;
if (!rawUrl) {
  console.error('Usage: node scripts/retarget-domain.mjs <https://new-domain> [distDir]');
  process.exit(1);
}
const next = normalizeSiteUrl(rawUrl);
const dist = resolve(distArg);
const indexPath = join(dist, 'index.html');
if (!existsSync(indexPath)) throw new Error(`No build found at ${dist}. Run "npm run build" first.`);

const canonical = readFileSync(indexPath, 'utf8').match(/<link rel="canonical" href="([^"]+)"/)?.[1];
if (!canonical) throw new Error('Could not find the canonical URL in index.html.');
const current = new URL(canonical).origin;
if (current === next) {
  console.log(`Already targeting ${next}. Nothing to do.`);
  process.exit(0);
}

const targets = readdirSync(dist).filter((f) => /\.(html|txt|xml|webmanifest)$/.test(f));
let changed = 0;
for (const file of targets) {
  const path = join(dist, file);
  const before = readFileSync(path, 'utf8');
  const after = before.split(current).join(next);
  if (after !== before) {
    writeFileSync(path, after);
    changed++;
    console.log(`  ${file}`);
  }
}
console.log(`✓ Retargeted ${changed} file(s): ${current} → ${next}`);
