import type { Lang } from '../i18n/lang';
import type { Status } from './types';

export interface CertRow {
  domain: string;
  status: Status;
  label: string;
  issuer: string;
  expires: string;
  days: number | null;
  tls: string;
}

const label = {
  en: { ok: 'Valid', warn: 'Expires soon', bad: 'Expired', valid: 'Valid', soon: 'Expiring soon', expired: 'Expired', unreachable: 'Unreachable' },
  nl: { ok: 'Geldig', warn: 'Verloopt bijna', bad: 'Verlopen', valid: 'Geldig', soon: 'Verloopt bijna', expired: 'Verlopen', unreachable: 'Onbereikbaar' },
};
const months = {
  en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  nl: ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec'],
};

const rows: { domain: string; status: 'ok' | 'warn' | 'bad'; issuer: string; date: [number, number, number]; days: number; tls: string }[] = [
  { domain: 'shop.northwind.example', status: 'ok', issuer: "Let's Encrypt R11", date: [12, 2, 2027], days: 88, tls: 'TLS 1.3' },
  { domain: 'harbourline.example', status: 'ok', issuer: 'Sectigo RSA DV', date: [3, 9, 2027], days: 291, tls: 'TLS 1.3' },
  { domain: 'mail.kestrel.example', status: 'warn', issuer: "Let's Encrypt E6", date: [25, 11, 2026], days: 9, tls: 'TLS 1.2' },
  { domain: 'atlas-studio.example', status: 'ok', issuer: 'GlobalSign GCC R6', date: [19, 6, 2027], days: 215, tls: 'TLS 1.3' },
  { domain: 'legacy.fjordline.example', status: 'bad', issuer: "Let's Encrypt R10", date: [2, 11, 2026], days: -14, tls: 'TLS 1.2' },
  { domain: 'portal.meridian.example', status: 'warn', issuer: 'DigiCert G2 TLS', date: [29, 11, 2026], days: 13, tls: 'TLS 1.3' },
  { domain: 'cdn.northwind.example', status: 'ok', issuer: "Let's Encrypt E5", date: [8, 1, 2027], days: 53, tls: 'TLS 1.3' },
];

export const SSL_TOTAL = 18;

export function getSslScan(lang: Lang) {
  const l = label[lang];
  return {
    total: SSL_TOTAL,
    summary: [
      { label: l.valid, value: 14, status: 'ok' as Status },
      { label: l.soon, value: 2, status: 'warn' as Status },
      { label: l.expired, value: 1, status: 'bad' as Status },
      { label: l.unreachable, value: 1, status: 'info' as Status },
    ],
    rows: rows.map(
      (r): CertRow => ({
        domain: r.domain,
        status: r.status,
        label: l[r.status],
        issuer: r.issuer,
        expires: `${String(r.date[0]).padStart(2, '0')} ${months[lang][r.date[1] - 1]} ${r.date[2]}`,
        days: r.days,
        tls: r.tls,
      }),
    ),
  };
}
