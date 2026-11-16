// Prerenders one static page per language: dist/index.html (nl) and dist/en/index.html (en).
// Runs after `vite build`. The client bundle hydrates this markup.
import { build, loadEnv } from 'vite';
import { readFileSync, writeFileSync, mkdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';
import { normalizeSiteUrl } from './seo.mjs';

const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'node_modules/.prerender');
const env = loadEnv('production', root, 'VITE_');
const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);
const noindex = env.VITE_NOINDEX === 'true';

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir, emptyOutDir: true, copyPublicDir: false },
  ssr: { noExternal: true },
});

const { render, renderHead, LANGS, langPath } = await import(pathToFileURL(resolve(outDir, 'entry-server.js')).href);
const template = readFileSync(resolve(root, 'dist/index.html'), 'utf8');
for (const marker of ['<!--app-head-->', '<!--app-html-->', '<html lang="nl">']) {
  if (!template.includes(marker)) throw new Error(`dist/index.html is missing ${marker}`);
}

for (const lang of LANGS) {
  const html = template
    .replace('<html lang="nl">', `<html lang="${lang}">`)
    .replace('<!--app-head-->', renderHead(lang, siteUrl, noindex))
    .replace('<!--app-html-->', render(lang));
  const file = resolve(root, 'dist', `.${langPath(lang)}index.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, html);
  console.log(`✓ prerendered ${langPath(lang)} (${lang})`);
}
rmSync(outDir, { recursive: true, force: true });
