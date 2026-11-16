import { defineConfig, loadEnv, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { normalizeSiteUrl, robotsTxt, sitemapXml } from './scripts/seo.mjs';

/**
 * Emits robots.txt and sitemap.xml for the configured VITE_SITE_URL and serves them in dev.
 * index.html receives the URL through Vite's built-in %VITE_SITE_URL% replacement.
 */
function seoFiles(siteUrl: string, noindex: boolean): Plugin {
  const files: Record<string, { type: string; body: () => string }> = {
    'robots.txt': { type: 'text/plain', body: () => robotsTxt(siteUrl, noindex) },
    'sitemap.xml': { type: 'application/xml', body: () => sitemapXml(siteUrl) },
  };
  return {
    name: 'stk-seo-files',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const file = files[(req.url ?? '').replace(/^\//, '').split('?')[0]];
        if (!file) return next();
        res.setHeader('Content-Type', `${file.type}; charset=utf-8`);
        res.end(file.body());
      });
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
  process.env.VITE_SITE_URL = siteUrl; // normalized value for %VITE_SITE_URL% in index.html
  process.env.VITE_ROBOTS = env.VITE_NOINDEX === 'true' ? 'noindex, nofollow' : 'index, follow';

  return {
    base: '/',
    plugins: [react(), tailwindcss(), seoFiles(siteUrl, env.VITE_NOINDEX === 'true')],
    build: {
      target: 'es2020',
      cssCodeSplit: true,
      assetsInlineLimit: 2048,
    },
  };
});
