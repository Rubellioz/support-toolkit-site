export type ViewId = 'overview' | 'domain' | 'ssl' | 'website' | 'security' | 'mediation';

/** Full product name of each view. */
export const viewTitle: Record<ViewId, string> = {
  overview: 'Complete toolkit',
  domain: 'Domain Intelligence',
  ssl: 'SSL Monitor',
  website: 'Website Intelligence',
  security: 'Security Audit',
  mediation: 'Domain Mediation',
};

export interface Chapter {
  id: string;
  view: ViewId;
  /** Navigation label (sidebar + site header). */
  nav: string;
  title: string;
  /** Second, accented part of the title. */
  accent: string;
  body: string;
  points: string[];
  /** data-focus key of the element the camera moves to; null keeps the full view. */
  focus: string | null;
}

export const chapters: Chapter[] = [
  {
    id: 'domain-intelligence',
    view: 'domain',
    nav: 'Domain',
    title: 'Every answer about a domain.',
    accent: 'One lookup.',
    body: 'Registration, nameservers, DNS records and the network behind every IP. Assembled in seconds, in a single view, ready for the customer on the line.',
    points: ['WHOIS and registrar status', 'Full DNS record set with TTLs', 'Propagation across resolvers', 'Reverse DNS, ASN and location'],
    focus: 'dns-records',
  },
  {
    id: 'ssl-monitor',
    view: 'ssl',
    nav: 'SSL',
    title: 'Certificates, watched.',
    accent: 'Before they expire.',
    body: 'Scan a whole portfolio at once. See which certificates are valid, which are about to lapse, who issued them and which TLS versions they negotiate.',
    points: ['Batch scanning with live progress', 'Expiry countdown per domain', 'Issuer and chain validation', 'TLS protocol detection'],
    focus: 'ssl-table',
  },
  {
    id: 'website-intelligence',
    view: 'website',
    nav: 'Website',
    title: 'Know what runs a site.',
    accent: 'Without logging in.',
    body: 'Follow every redirect, read the HTTP status, detect the CMS and PHP version, and surface the technical details that explain why a site misbehaves.',
    points: ['Redirect chain with status codes', 'CMS, plugins and PHP detection', 'Performance and caching analysis', 'SSRF-protected fetching'],
    focus: 'web-facts',
  },
  {
    id: 'security-audit',
    view: 'security',
    nav: 'Security',
    title: 'A security score',
    accent: 'you can explain.',
    body: 'A transparent, weighted score from non-destructive external checks. Every point lost traces back to a finding, and every finding comes with a recommendation.',
    points: ['Score from 0 to 100 across six categories', 'Headers, TLS, DNS and exposed files', 'Risk level per finding', 'Prioritised recommendations'],
    focus: 'security-score',
  },
  {
    id: 'domain-mediation',
    view: 'mediation',
    nav: 'Mediation',
    title: 'Domain deals,',
    accent: 'mediated with clarity.',
    body: 'Value a domain from verified comparable sales, then guide buyer and owner through every offer to a signed agreement and a clean transfer.',
    points: ['Valuation with confidence level', 'Complete offer history', 'Stage-by-stage progress', 'Fee and VAT calculation'],
    focus: 'mediation-offers',
  },
  {
    id: 'complete-toolkit',
    view: 'overview',
    nav: 'Toolkit',
    title: 'Five tools.',
    accent: 'One workspace.',
    body: 'Domain, certificate, website, security and mediation work, connected in one dashboard. One search bar, one activity feed, one place to start every ticket.',
    points: ['Unified dashboard and activity feed', 'One search for domains, IPs and customers', 'Works on desktop, tablet and phone', 'Built for hosting support teams'],
    focus: null,
  },
];
