import type { Lang } from '../i18n/lang';
import type { Status } from './types';

export type Priority = 'high' | 'medium' | 'low';

/** Mirrors the toolkit's weighted methodology: SSL 25, headers 20, DNS 15, files 15, server 10, tech 15. */
export const SECURITY_SCORE = 82;
export const securityCategoryScores = [96, 64, 80, 100, 70, 74];

const weights = [25, 20, 15, 15, 10, 15];
const checkStatus: { status: Status; risk: Priority | null }[] = [
  { status: 'ok', risk: null },
  { status: 'warn', risk: 'medium' },
  { status: 'ok', risk: null },
  { status: 'warn', risk: 'low' },
  { status: 'ok', risk: null },
  { status: 'bad', risk: 'medium' },
  { status: 'ok', risk: null },
];
const recPriority: Priority[] = ['medium', 'medium', 'low'];

const text = {
  en: {
    grade: 'Good',
    priority: { high: 'High', medium: 'Medium', low: 'Low' },
    categories: ['SSL / TLS', 'HTTP headers', 'DNS & e-mail', 'Public files', 'Server', 'Technology'],
    checks: [
      'HSTS with includeSubDomains',
      'Content-Security-Policy',
      'TLS 1.0 / 1.1 disabled',
      'DMARC policy p=none',
      'Exposed .git or .env files',
      'Server version disclosed',
      'DNSSEC signed',
    ],
    recommendations: [
      'Hide the server version in response headers.',
      'Add a Content-Security-Policy, start in report-only mode.',
      'Move DMARC from p=none to p=quarantine.',
    ],
  },
  nl: {
    grade: 'Goed',
    priority: { high: 'Hoog', medium: 'Gemiddeld', low: 'Laag' },
    categories: ['SSL / TLS', 'HTTP-headers', 'DNS & e-mail', 'Openbare bestanden', 'Server', 'Technologie'],
    checks: [
      'HSTS met includeSubDomains',
      'Content-Security-Policy',
      'TLS 1.0 / 1.1 uitgeschakeld',
      'DMARC-beleid p=none',
      'Openbare .git- of .env-bestanden',
      'Serverversie zichtbaar',
      'DNSSEC ondertekend',
    ],
    recommendations: [
      'Verberg de serverversie in de response-headers.',
      'Voeg een Content-Security-Policy toe, begin in report-only.',
      'Zet DMARC van p=none naar p=quarantine.',
    ],
  },
};

export function getSecurityAudit(lang: Lang) {
  const t = text[lang];
  return {
    host: 'harbourline.example',
    score: SECURITY_SCORE,
    grade: t.grade,
    priorityLabel: t.priority,
    categories: t.categories.map((label, i) => ({ label, weight: weights[i], score: securityCategoryScores[i] })),
    checks: t.checks.map((label, i) => ({ label, ...checkStatus[i] })),
    recommendations: t.recommendations.map((text, i) => ({ priority: recPriority[i], text })),
  };
}
