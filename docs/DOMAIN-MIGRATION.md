# Domain migration: toolkit.rubenmuller.nl → support-toolkit.nl

Status: `VITE_SITE_URL` is set to `https://support-toolkit.nl`. The steps below document the move from
`toolkit.rubenmuller.nl`.

## What depends on the domain

Only static files written at build time: `index.html` and `en/index.html` (canonical, `hreflang`, `og:url`,
`og:image`, `twitter:image`, JSON-LD), `robots.txt` and `sitemap.xml`. The JS/CSS bundles, `.htaccess`, `404.html` and all internal links are domain-agnostic.

## Steps

1. **DNS.** Point `support-toolkit.nl` (and `www`) at the hosting server (A/AAAA records). Lower the TTL a day ahead.
2. **Hosting.** In Plesk add `support-toolkit.nl` as a domain, or as an alias of the current site. Use the same
   document root/Git deployment as `toolkit.rubenmuller.nl`.
3. **SSL.** Issue a Let's Encrypt certificate for `support-toolkit.nl` + `www.support-toolkit.nl` and verify:
   ```bash
   curl -sI https://support-toolkit.nl/ | head -1
   ```
4. **Site URL.** Choose one:
   - *No rebuild* — on the server or in CI, rewrite the existing build:
     ```bash
     npm run retarget-domain -- https://support-toolkit.nl
     ```
   - *Next build* — set `VITE_SITE_URL=https://support-toolkit.nl` in `.env` (or the GitHub Actions variable
     `SITE_URL`) and push; the next deployment carries the new domain.
5. **Canonical & sitemap.** Check that `https://support-toolkit.nl/` and `/en/` (canonical, `hreflang`, `og:url`),
   `/robots.txt` and `/sitemap.xml` all show the new domain:
   ```bash
   npm run verify-dist
   ```
6. **Redirects.** Once the new domain works, redirect the old host with its path intact:
   - In Plesk, open **toolkit.rubenmuller.nl → Git** and set the deployment mode to **Disabled** (or remove the repository).
   - In **File Manager**, empty the document root of `toolkit.rubenmuller.nl` and upload
     [`docs/old-domain-redirect.htaccess`](old-domain-redirect.htaccess) there as **`.htaccess`**.
   - Keep the subdomain and its certificate, so `https://toolkit.rubenmuller.nl/...` links keep working (they redirect).
   - Set **Hosting Settings → Preferred domain** of `support-toolkit.nl` to `support-toolkit.nl` so `www.` redirects too.
7. **SEO & analytics.** Add `support-toolkit.nl` to Google Search Console, submit the sitemap, and use *Change of
   address* from the old property. Analytics picks up the new hostname automatically (`data-domain` is set at runtime);
   add the new domain in your analytics dashboard. If the analytics script lives on another host, ensure it is
   allowed in the `.htaccess` Content-Security-Policy.

Rollback: retarget back (`npm run retarget-domain -- https://toolkit.rubenmuller.nl`) and remove the redirect.
