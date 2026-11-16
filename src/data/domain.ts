import type { Lang } from '../i18n/lang';

const shared = {
  query: 'northwind-hosting.example',
  nameservers: [
    { host: 'ns1.dns-example.net', ip: '198.51.100.10', ok: true },
    { host: 'ns2.dns-example.net', ip: '198.51.100.11', ok: true },
    { host: 'ns3.dns-example.org', ip: '203.0.113.53', ok: true },
  ],
  records: [
    { type: 'A', name: '@', value: '203.0.113.42', ttl: '3600' },
    { type: 'AAAA', name: '@', value: '2001:db8:4e::42', ttl: '3600' },
    { type: 'CNAME', name: 'www', value: 'northwind-hosting.example.', ttl: '3600' },
    { type: 'MX', name: '@', value: '10 mx1.mail-example.net.', ttl: '3600' },
    { type: 'MX', name: '@', value: '20 mx2.mail-example.net.', ttl: '3600' },
    { type: 'TXT', name: '@', value: 'v=spf1 include:_spf.mail-example.net -all', ttl: '3600' },
    { type: 'TXT', name: '_dmarc', value: 'v=DMARC1; p=quarantine; rua=mailto:…', ttl: '3600' },
    { type: 'CAA', name: '@', value: '0 issue "letsencrypt.org"', ttl: '86400' },
  ],
  propagation: [
    { resolver: 'Resolver A', ok: true },
    { resolver: 'Resolver B', ok: true },
    { resolver: 'Resolver C', ok: true },
    { resolver: 'Resolver D', ok: true },
    { resolver: 'Resolver E', ok: true },
    { resolver: 'Resolver F', ok: false },
  ],
};

const localized = {
  en: {
    overview: [
      { label: 'Registrar', value: 'Example Registrar B.V.' },
      { label: 'Status', value: 'Active · clientTransferProhibited' },
      { label: 'Registered', value: '14 Mar 2016' },
      { label: 'Expires', value: '14 Mar 2027' },
      { label: 'DNSSEC', value: 'Signed (ECDSA P-256)' },
      { label: 'Platform', value: 'Shared hosting · cluster 4' },
    ],
    ip: [
      { label: 'Address', value: '203.0.113.42' },
      { label: 'Reverse DNS', value: 'web04.cluster.example.net' },
      { label: 'Network', value: 'AS64500 · Example Hosting B.V.' },
      { label: 'Location', value: 'Amsterdam, NL' },
    ],
  },
  nl: {
    overview: [
      { label: 'Registrar', value: 'Example Registrar B.V.' },
      { label: 'Status', value: 'Actief · clientTransferProhibited' },
      { label: 'Geregistreerd', value: '14 mrt 2016' },
      { label: 'Verloopt', value: '14 mrt 2027' },
      { label: 'DNSSEC', value: 'Ondertekend (ECDSA P-256)' },
      { label: 'Platform', value: 'Shared hosting · cluster 4' },
    ],
    ip: [
      { label: 'Adres', value: '203.0.113.42' },
      { label: 'Reverse DNS', value: 'web04.cluster.example.net' },
      { label: 'Netwerk', value: 'AS64500 · Example Hosting B.V.' },
      { label: 'Locatie', value: 'Amsterdam, NL' },
    ],
  },
};

export const getDomainLookup = (lang: Lang) => ({ ...shared, ...localized[lang] });
