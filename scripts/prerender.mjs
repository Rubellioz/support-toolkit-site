// Prerenders the React app into dist/index.html so crawlers and first paint get real content.
// Runs after `vite build`. The client bundle hydrates this markup.
import { build } from 'vite';
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const outDir = resolve(root, 'node_modules/.prerender');

await build({
  root,
  logLevel: 'warn',
  build: { ssr: 'src/entry-server.tsx', outDir, emptyOutDir: true, copyPublicDir: false },
  ssr: { noExternal: true },
});

const { render } = await import(pathToFileURL(resolve(outDir, 'entry-server.js')).href);
const indexPath = resolve(root, 'dist/index.html');
const template = readFileSync(indexPath, 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('dist/index.html has no <!--app-html--> placeholder');
writeFileSync(indexPath, template.replace('<!--app-html-->', render()));
rmSync(outDir, { recursive: true, force: true });
console.log('✓ prerendered dist/index.html');
