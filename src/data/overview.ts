import type { Lang } from '../i18n/lang';
import type { Status } from './types';

const data = {
  en: {
    kpis: [
      { id: 'domains', label: 'Domains monitored', value: '248', delta: '+12 this month', status: 'info' as Status },
      { id: 'certs', label: 'Valid certificates', value: '236', suffix: '/ 241', delta: '3 expiring in 14 days', status: 'warn' as Status },
      { id: 'score', label: 'Avg. security score', value: '86', suffix: '/ 100', delta: '+4 since last audit', status: 'ok' as Status },
      { id: 'mediation', label: 'Open mediations', value: '3', delta: '1 awaiting counter-offer', status: 'info' as Status },
    ],
    modules: [
      { id: 'domain', name: 'Domain Intelligence', metric: '1,284', unit: 'lookups this week', status: 'ok' as Status, note: 'All resolvers healthy' },
      { id: 'ssl', name: 'SSL Monitor', metric: '241', unit: 'certificates watched', status: 'warn' as Status, note: '3 renewals due' },
      { id: 'website', name: 'Website Intelligence', metric: '182 ms', unit: 'median response', status: 'ok' as Status, note: '97% sites on PHP 8.1+' },
      { id: 'security', name: 'Security Audit', metric: '86', unit: 'average score', status: 'ok' as Status, note: '2 critical resolved' },
      { id: 'mediation', name: 'Domain Mediation', metric: '€14.2k', unit: 'in active negotiations', status: 'info' as Status, note: '3 dossiers open' },
    ],
    activity: [
      { time: '09:42', who: 'SSL Monitor', text: 'Certificate renewed for', target: 'shop.northwind.example', status: 'ok' as Status },
      { time: '09:31', who: 'Security Audit', text: 'Score improved to 91 for', target: 'harbourline.example', status: 'ok' as Status },
      { time: '09:17', who: 'Domain Intelligence', text: 'Nameserver change detected on', target: 'atlas-studio.example', status: 'warn' as Status },
      { time: '08:58', who: 'Domain Mediation', text: 'Counter-offer received for', target: 'harbourline.example', status: 'info' as Status },
      { time: '08:40', who: 'Website Intelligence', text: 'PHP 7.4 end-of-life on', target: 'legacy.fjordline.example', status: 'bad' as Status },
      { time: '08:12', who: 'SSL Monitor', text: 'Expires in 9 days:', target: 'mail.kestrel.example', status: 'warn' as Status },
    ],
  },
  nl: {
    kpis: [
      { id: 'domains', label: 'Gemonitorde domeinen', value: '248', delta: '+12 deze maand', status: 'info' as Status },
      { id: 'certs', label: 'Geldige certificaten', value: '236', suffix: '/ 241', delta: '3 verlopen binnen 14 dagen', status: 'warn' as Status },
      { id: 'score', label: 'Gem. beveiligingsscore', value: '86', suffix: '/ 100', delta: '+4 sinds laatste audit', status: 'ok' as Status },
      { id: 'mediation', label: 'Open bemiddelingen', value: '3', delta: '1 wacht op tegenbod', status: 'info' as Status },
    ],
    modules: [
      { id: 'domain', name: 'Domain Intelligence', metric: '1.284', unit: 'opzoekingen deze week', status: 'ok' as Status, note: 'Alle resolvers in orde' },
      { id: 'ssl', name: 'SSL Monitor', metric: '241', unit: 'certificaten bewaakt', status: 'warn' as Status, note: '3 verlengingen nodig' },
      { id: 'website', name: 'Website Intelligence', metric: '182 ms', unit: 'mediane reactietijd', status: 'ok' as Status, note: '97% van de sites op PHP 8.1+' },
      { id: 'security', name: 'Security Audit', metric: '86', unit: 'gemiddelde score', status: 'ok' as Status, note: '2 kritieke opgelost' },
      { id: 'mediation', name: 'Domeinbemiddeling', metric: '€ 14,2k', unit: 'in lopende onderhandelingen', status: 'info' as Status, note: '3 dossiers open' },
    ],
    activity: [
      { time: '09:42', who: 'SSL Monitor', text: 'Certificaat vernieuwd voor', target: 'shop.northwind.example', status: 'ok' as Status },
      { time: '09:31', who: 'Security Audit', text: 'Score gestegen naar 91 voor', target: 'harbourline.example', status: 'ok' as Status },
      { time: '09:17', who: 'Domain Intelligence', text: 'Nameserverwijziging op', target: 'atlas-studio.example', status: 'warn' as Status },
      { time: '08:58', who: 'Domeinbemiddeling', text: 'Tegenbod ontvangen voor', target: 'harbourline.example', status: 'info' as Status },
      { time: '08:40', who: 'Website Intelligence', text: 'PHP 7.4 niet meer ondersteund op', target: 'legacy.fjordline.example', status: 'bad' as Status },
      { time: '08:12', who: 'SSL Monitor', text: 'Verloopt over 9 dagen:', target: 'mail.kestrel.example', status: 'warn' as Status },
    ],
  },
};

export const getOverview = (lang: Lang) => data[lang];

/** Certificates expiring per week, next 8 weeks. */
export const expiryBars = [3, 1, 4, 2, 6, 2, 5, 3];
