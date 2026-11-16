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

export const sslScan = {
  total: 18,
  summary: [
    { label: 'Valid', value: 14, status: 'ok' as Status },
    { label: 'Expiring soon', value: 2, status: 'warn' as Status },
    { label: 'Expired', value: 1, status: 'bad' as Status },
    { label: 'Unreachable', value: 1, status: 'info' as Status },
  ],
  rows: [
    { domain: 'shop.northwind.example', status: 'ok', label: 'Valid', issuer: "Let's Encrypt R11", expires: '12 Feb 2027', days: 88, tls: 'TLS 1.3' },
    { domain: 'harbourline.example', status: 'ok', label: 'Valid', issuer: 'Sectigo RSA DV', expires: '03 Sep 2027', days: 291, tls: 'TLS 1.3' },
    { domain: 'mail.kestrel.example', status: 'warn', label: 'Expires soon', issuer: "Let's Encrypt E6", expires: '25 Nov 2026', days: 9, tls: 'TLS 1.2' },
    { domain: 'atlas-studio.example', status: 'ok', label: 'Valid', issuer: 'GlobalSign GCC R6', expires: '19 Jun 2027', days: 215, tls: 'TLS 1.3' },
    { domain: 'legacy.fjordline.example', status: 'bad', label: 'Expired', issuer: "Let's Encrypt R10", expires: '02 Nov 2026', days: -14, tls: 'TLS 1.2' },
    { domain: 'portal.meridian.example', status: 'warn', label: 'Expires soon', issuer: 'DigiCert G2 TLS', expires: '29 Nov 2026', days: 13, tls: 'TLS 1.3' },
    { domain: 'cdn.northwind.example', status: 'ok', label: 'Valid', issuer: "Let's Encrypt E5", expires: '08 Jan 2027', days: 53, tls: 'TLS 1.3' },
  ] satisfies CertRow[],
};
