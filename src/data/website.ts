import type { Status } from './types';

export const websiteScan = {
  url: 'https://shop.northwind.example',
  chain: [
    { code: 301, url: 'http://shop.northwind.example/', note: 'Redirect to HTTPS' },
    { code: 301, url: 'https://shop.northwind.example/', note: 'Trailing slash' },
    { code: 200, url: 'https://shop.northwind.example/home', note: 'OK · 182 ms' },
  ],
  facts: [
    { id: 'http', label: 'HTTP status', value: '200 OK', sub: 'HTTP/2 · 182 ms TTFB', status: 'ok' as Status },
    { id: 'cms', label: 'CMS detected', value: 'WordPress 6.6.2', sub: 'WooCommerce · Yoast SEO', status: 'ok' as Status },
    { id: 'php', label: 'PHP version', value: 'PHP 8.2.24', sub: 'Security support until Dec 2026', status: 'warn' as Status },
    { id: 'server', label: 'Web server', value: 'nginx', sub: 'Behind reverse proxy', status: 'info' as Status },
  ],
  analysis: [
    { label: 'Compression', value: 'Brotli enabled', status: 'ok' as Status },
    { label: 'Caching headers', value: 'max-age=31536000 on assets', status: 'ok' as Status },
    { label: 'Mixed content', value: 'None found', status: 'ok' as Status },
    { label: 'PHP errors in output', value: '1 deprecation notice', status: 'warn' as Status },
    { label: 'robots.txt / sitemap', value: 'Both present', status: 'ok' as Status },
    { label: 'Page weight', value: '1.4 MB · 46 requests', status: 'info' as Status },
  ],
};
