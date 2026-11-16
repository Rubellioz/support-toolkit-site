/**
 * Central site configuration.
 *
 * The site's own domain is intentionally NOT read here: the JavaScript bundle never needs an absolute
 * URL of this website. Internal links are relative, and canonical / Open Graph / sitemap URLs are
 * written into the static files from VITE_SITE_URL at build time (see vite.config.ts), where
 * `npm run retarget-domain` can rewrite them without a rebuild.
 *
 * Only external integrations are configured below, all optional.
 */
const clean = (v: string | undefined) => (v ?? '').trim();

export const site = {
  name: 'Support Toolkit',
  tagline: 'Support smarter. Work faster.',
  /** Sign-in URL of the existing Support Toolkit application. */
  appUrl: clean(import.meta.env.VITE_APP_URL),
  /** Contact address for access requests. */
  contactEmail: clean(import.meta.env.VITE_CONTACT_EMAIL),
  /** Optional analytics script; the tracked domain is resolved from the browser at runtime. */
  analyticsSrc: clean(import.meta.env.VITE_ANALYTICS_SRC),
} as const;

/** Canonical URL of the current page as declared in the document head (domain-aware, no hardcoding). */
export function canonicalUrl(): string {
  if (typeof document === 'undefined') return '/';
  return document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.href ?? window.location.origin + '/';
}
