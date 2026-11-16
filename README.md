# Support Toolkit — product website

The public product site for Support Toolkit: a premium, light-mode scrollytelling page where a pinned, realistic
dashboard demonstrates each module as the visitor scrolls.

- **Live:** `https://support-toolkit.nl`
- **Previous domain:** `toolkit.rubenmuller.nl` (removed; see [docs/DOMAIN-MIGRATION.md](docs/DOMAIN-MIGRATION.md))

This repository holds the **marketing site only**. The Support Toolkit application (PHP, `Rubellioz/support-toolkit`)
is a separate repository with its own deployment and is not changed by anything here.

## Languages

The site is bilingual. **Dutch is the default at `/`**, **English lives at `/en/`**. Each language is a separate,
prerendered page with its own `<html lang>`, title, description, canonical URL, `hreflang` alternates and Open Graph
image, and both are listed in `sitemap.xml`. The NL | EN switch in the header links to the other page and keeps the
visitor's place (it carries the anchor of the chapter on screen, e.g. `/en/#security-audit`).

| What | Where |
|---|---|
| Interface copy (header, hero, CTA, footer, dashboard labels, SEO meta) | `src/i18n/messages.ts` (`en` defines the shape; `nl` must match, enforced by TypeScript) |
| Chapter copy of the tour | `src/data/chapters.ts` |
| Demo datasets (labels, dates) | `src/data/*.ts`, one `en` / `nl` variant each |
| Language helpers and routing | `src/i18n/lang.ts` |
| `<head>` per language | `src/seo/head.ts` |

To add a language: add it to `Lang`/`LANGS`/`langPath` in `src/i18n/lang.ts`, add a messages object and data
variants (TypeScript points out every missing string), and add the page to `PAGES` in `scripts/seo.mjs`.

## Stack

Vite · React 19 · TypeScript · Tailwind CSS 4 · GSAP + ScrollTrigger · Lucide icons · self-hosted fonts (Inter,
JetBrains Mono, Instrument Serif). The build prerenders the page to static HTML (SEO, fast first paint) and hydrates it.

## Commands

```bash
npm ci               # install
npm run dev          # dev server on http://localhost:5173
npm run build        # typecheck → build → prerender → verify (output in dist/)
npm run preview      # serve dist/ locally
npm run retarget-domain -- https://new-domain.tld   # point an existing dist/ at another domain, no rebuild
npm run verify-dist  # re-run the post-build checks
```

## Configuration

All configuration is environment-based (`.env`, documented in [.env.example](.env.example)):

| Variable | Purpose |
|---|---|
| `VITE_SITE_URL` | Public URL of this site. **The only place the domain is set.** Feeds canonical, `hreflang`, Open Graph, JSON-LD, `robots.txt`, `sitemap.xml` for both languages. |
| `VITE_APP_URL` | Sign-in link to the Support Toolkit application. Empty hides the buttons. |
| `VITE_CONTACT_EMAIL` | Optional "Request access" button. |
| `VITE_ANALYTICS_SRC` | Optional analytics script; the tracked domain is read from the browser at runtime. |
| `VITE_NOINDEX` | `true` → `noindex` meta + `Disallow: /` (useful for a staging copy). |

The JavaScript and CSS bundles never contain the site's own domain; internal links are relative. `npm run build`
fails if the bundle contains the site domain, if any SEO URL differs from the canonical origin, or if the future
domain `support-toolkit.nl` appears anywhere while it is not the active domain.

## Structure

```
src/
  config/site.ts            external integrations (env)
  i18n/                     languages, interface copy (nl + en), formatting
  seo/head.ts               per-language <head> tags
  data/                     ALL demo data + chapter copy (no JSX)
  components/dashboard/     the product UI: shell, primitives, one file per view
  components/sections/      ScrollStage (pinned GSAP timeline), StaticTour (reduced motion), header, CTA, footer
  hooks/, lib/              fit-to-frame scaling, reduced-motion, camera geometry, chapter navigation
scripts/                    SEO file generation, prerender, retarget-domain, verify-dist
public/                     .htaccess, 404.html, icons, og-image.png, webmanifest
```

### How the scroll experience works

`ScrollStage` pins one full-viewport stage and drives a single scrubbed GSAP timeline:
hero → the dashboard frame flies into place → per chapter: sidebar, breadcrumb and view switch, rows reveal
progressively, simulated scans run (SSL progress, security score, mediation stages), then a "camera" zooms into the
element the chapter is about (`data-focus` in the views) and pulls back. The dashboard is laid out at a fixed
1280×800 and scaled to fit, so it looks identical on every screen. Header links and `#chapter-id` deep links
scroll to the matching timeline label.

With `prefers-reduced-motion: reduce`, a static version is rendered instead (no pinning, scrubbing or camera moves).
The dashboard is decorative (`aria-hidden`, `inert`); the chapter text carries the content for assistive technology.

### Demo data

Everything in the dashboard is an illustrative simulation from `src/data/`. Domains use reserved `.example`
names, IPs come from documentation ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24, 2001:db8::/32) and the ASN is
the documentation ASN 64500. The UI marks this with "Demo data" / "Demo mode" badges and a notice. The security score
follows the application's real weighting method.

## UI baseline

The UI follows the [ui-skills](https://github.com/ibelick/ui-skills) rules `baseline-ui`, `fixing-accessibility`,
`fixing-metadata` and `fixing-motion-performance`:

- One accent colour (blue), no gradients or glow; Tailwind's default shadow scale and easing; no letter-spacing
  changes (large headings get their tighter fit from Inter's optical-size axis).
- Text colours meet WCAG AA (≥ 4.5:1); `text-balance` on headings, `text-pretty` on body copy, `tabular-nums` for data.
- `cn()` (clsx + tailwind-merge) for conditional classes.
- Mobile menu is a native HTML `popover` (Escape, light dismiss, focus return by the browser); icon buttons have an
  `aria-label`; the fixed header respects the safe area.
- Motion: only `transform`/`opacity` on large surfaces, `will-change` only while the tour is pinned, looping
  animations pause off-screen, no scroll listeners outside GSAP ScrollTrigger.

Deliberate deviations: the hero keeps its fading grid with a soft blue glow (requested explicitly; static, never
animated), GSAP stays the animation library (the skills say not to migrate libraries), and the pinned stage
uses `100svh` instead of `h-dvh` so the pin doesn't re-layout when a mobile toolbar shows or hides.

## Deployment

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).
