import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { normalizeSiteUrl, robotsTxt, sitemapXml } from './scripts/seo.mjs';
import { renderHead } from './src/seo/head.ts';
import { langFromPath } from './src/i18n/lang.ts';

/**
 * Domain-aware SEO output, all derived from VITE_SITE_URL:
 * - emits robots.txt and sitemap.xml (and serves them in dev);
 * - in dev, fills <!--app-head--> and <html lang> for "/" (nl) and "/en/" (en).
 *   The production build does the same per language in scripts/prerender.mjs.
 */
function seo(siteUrl: string, noindex: boolean): Plugin {
  const files: Record<string, { type: string; body: () => string }> = {
    'robots.txt': { type: 'text/plain', body: () => robotsTxt(siteUrl, noindex) },
    'sitemap.xml': { type: 'application/xml', body: () => sitemapXml(siteUrl) },
  };
  return {
    name: 'stk-seo',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files[(req.url ?? '').replace(/^\//, '').split('?')[0]];
        if (!file) return next();
        res.setHeader('Content-Type', `${file.type}; charset=utf-8`);
        res.end(file.body());
      });
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html, ctx) {
        if (!ctx.server) return html; // build: prerender.mjs fills these per language
        const lang = langFromPath(ctx.originalUrl ?? ctx.path);
        return html.replace('<html lang="nl">', `<html lang="${lang}">`).replace('<!--app-head-->', renderHead(lang, siteUrl, noindex));
      },
    },
    generateBundle() {
      for (const [fileName, f] of Object.entries(files)) {
        this.emitFile({ type: 'asset', fileName, source: f.body() });
      }
    },
  };
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const siteUrl = normalizeSiteUrl(env.VITE_SITE_URL);

  return {
    base: '/',
    plugins: [react(), tailwindcss(), seo(siteUrl, env.VITE_NOINDEX === 'true')],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      assetsInlineLimit: 2048,
    },
  };
});
