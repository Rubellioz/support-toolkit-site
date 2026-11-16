# Deployment — toolkit.rubenmuller.nl

The site is static. Apache serves `dist/`; `public/.htaccess` (copied into `dist/`) handles HTTPS, caching,
security headers and the 404 page. Nothing in the server configuration names a domain.

## Option A (recommended): GitHub Actions → `deploy` branch → Plesk Git

1. Merge to `main`. The workflow `.github/workflows/deploy.yml` runs `npm ci && npm run build` and force-pushes the
   contents of `dist/` to the branch **`deploy`**.
2. In Plesk, for the subdomain `toolkit.rubenmuller.nl`:
   - **Websites & Domains → Add Subdomain** `toolkit` (if not yet present). Document root e.g. `/toolkit.rubenmuller.nl`.
   - **Git → Add repository**: `https://github.com/Rubellioz/support-toolkit-site.git`, branch **`deploy`**,
     deployment mode **Automatic**, deployment path = the document root.
     (Private repo: use the SSH URL and add Plesk's public key as a read-only deploy key on GitHub.)
   - Optionally add the webhook URL Plesk shows to GitHub (Settings → Webhooks) so each publish deploys instantly.
3. **SSL/TLS Certificates → Let's Encrypt** for `toolkit.rubenmuller.nl`, then enable
   *Permanent SEO-safe 301 redirect from HTTP to HTTPS* (the `.htaccess` rule is a fallback for the same host).
4. **Apache & nginx Settings:** keep *Proxy mode* on; make sure "Serve static files directly by nginx" does not
   bypass `.htaccess` for `.html` (default Plesk settings are fine). `mod_rewrite`/`mod_headers` are enabled by default.

The application at `support-toolkit.rubenmuller.nl` keeps its own Git deployment from `Rubellioz/support-toolkit`.
The two sites share no files, routes or configuration.

## Option B: manual upload

```bash
npm ci && npm run build
```
Upload the **contents** of `dist/` (including the hidden `.htaccess`) to the document root.

## Routing

The site has two static pages: `/` (Dutch) and `/en/` (English, served from `en/index.html`), each with anchor
navigation (`/#ssl-monitor` …), so no SPA fallback is needed. Unknown paths return a
real **404** with `404.html` (no soft-404s). If client-side routes are added later, switch to `FallbackResource /index.html`
(see the comment in `.htaccess`).

## Verification checklist

Run after every deployment (replace the host if testing elsewhere):

```bash
curl -sI https://toolkit.rubenmuller.nl/ | head -1                  # HTTP/2 200
```
```bash
curl -sI http://toolkit.rubenmuller.nl/ | grep -i location           # https://toolkit.rubenmuller.nl/ (same host)
```
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://toolkit.rubenmuller.nl/does-not-exist   # 404
```
```bash
curl -s -o /dev/null -w '%{http_code}\n' https://toolkit.rubenmuller.nl/en/        # 200 (English)
```
```bash
curl -s https://toolkit.rubenmuller.nl/robots.txt https://toolkit.rubenmuller.nl/sitemap.xml
```
```bash
curl -s https://toolkit.rubenmuller.nl/ | grep -c 'support-toolkit\.nl'   # 0
```
```bash
curl -sI https://toolkit.rubenmuller.nl/assets/ 2>/dev/null | head -1     # 403/404, no listing
```

In a browser: scroll the full tour on desktop, tablet and phone in both languages; use the NL | EN switch; check the header links, `#security-audit` deep link,
keyboard navigation (Tab from the top: skip link, logo, nav, sign-in) and the OS "reduce motion" setting.
`npm run build` already checks asset paths, SEO URLs and future-domain references locally.
