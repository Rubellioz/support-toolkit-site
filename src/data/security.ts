import type { Status } from './types';

/** Mirrors the toolkit's weighted methodology: SSL 25, headers 20, DNS 15, files 15, server 10, tech 15. */
export const securityAudit = {
  host: 'harbourline.example',
  score: 82,
  grade: 'Good',
  categories: [
    { label: 'SSL / TLS', weight: 25, score: 96 },
    { label: 'HTTP headers', weight: 20, score: 64 },
    { label: 'DNS & e-mail', weight: 15, score: 80 },
    { label: 'Public files', weight: 15, score: 100 },
    { label: 'Server', weight: 10, score: 70 },
    { label: 'Technology', weight: 15, score: 74 },
  ],
  checks: [
    { label: 'HSTS with includeSubDomains', status: 'ok' as Status, risk: '' },
    { label: 'Content-Security-Policy', status: 'warn' as Status, risk: 'Medium' },
    { label: 'TLS 1.0 / 1.1 disabled', status: 'ok' as Status, risk: '' },
    { label: 'DMARC policy p=none', status: 'warn' as Status, risk: 'Low' },
    { label: 'Exposed .git or .env files', status: 'ok' as Status, risk: '' },
    { label: 'Server version disclosed', status: 'bad' as Status, risk: 'Medium' },
    { label: 'DNSSEC signed', status: 'ok' as Status, risk: '' },
  ],
  recommendations: [
    { priority: 'Medium', text: 'Hide the server version in response headers.' },
    { priority: 'Medium', text: 'Add a Content-Security-Policy, start in report-only mode.' },
    { priority: 'Low', text: 'Move DMARC from p=none to p=quarantine.' },
  ],
};
