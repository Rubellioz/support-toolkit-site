import type { Lang } from '../i18n/lang';

export type ViewId = 'overview' | 'domain' | 'ssl' | 'website' | 'security' | 'mediation';

export interface Chapter {
  /** Anchor id, identical in every language so "/#ssl-monitor" and "/en/#ssl-monitor" match. */
  id: string;
  view: ViewId;
  /** Short navigation label (site header). */
  nav: string;
  /** Full product name shown in the chapter eyebrow and footer. */
  name: string;
  title: string;
  /** Second, accented part of the title. */
  accent: string;
  body: string;
  points: string[];
  /** data-focus key of the element the camera moves to; null keeps the full view. */
  focus: string | null;
}

/** Language-independent structure of the tour. */
const structure: { id: string; view: ViewId; focus: string | null }[] = [
  { id: 'domain-intelligence', view: 'domain', focus: 'dns-records' },
  { id: 'ssl-monitor', view: 'ssl', focus: 'ssl-table' },
  { id: 'website-intelligence', view: 'website', focus: 'web-facts' },
  { id: 'security-audit', view: 'security', focus: 'security-score' },
  { id: 'domain-mediation', view: 'mediation', focus: 'mediation-offers' },
  { id: 'complete-toolkit', view: 'overview', focus: null },
];

type Copy = Omit<Chapter, 'id' | 'view' | 'focus'>;

const copy: Record<Lang, Copy[]> = {
  en: [
    {
      nav: 'Domain',
      name: 'Domain Intelligence',
      title: 'Every answer about a domain.',
      accent: 'One lookup.',
      body: 'Registration, nameservers, DNS records and the network behind every IP. Assembled in seconds, in a single view, ready for the customer on the line.',
      points: ['WHOIS and registrar status', 'Full DNS record set with TTLs', 'Propagation across resolvers', 'Reverse DNS, ASN and location'],
    },
    {
      nav: 'SSL',
      name: 'SSL Monitor',
      title: 'Certificates, watched.',
      accent: 'Before they expire.',
      body: 'Scan a whole portfolio at once. See which certificates are valid, which are about to lapse, who issued them and which TLS versions they negotiate.',
      points: ['Batch scanning with live progress', 'Expiry countdown per domain', 'Issuer and chain validation', 'TLS protocol detection'],
    },
    {
      nav: 'Website',
      name: 'Website Intelligence',
      title: 'Know what runs a site.',
      accent: 'Without logging in.',
      body: 'Follow every redirect, read the HTTP status, detect the CMS and PHP version, and surface the technical details that explain why a site misbehaves.',
      points: ['Redirect chain with status codes', 'CMS, plugins and PHP detection', 'Performance and caching analysis', 'SSRF-protected fetching'],
    },
    {
      nav: 'Security',
      name: 'Security Audit',
      title: 'A security score',
      accent: 'you can explain.',
      body: 'A transparent, weighted score from non-destructive external checks. Every point lost traces back to a finding, and every finding comes with a recommendation.',
      points: ['Score from 0 to 100 across six categories', 'Headers, TLS, DNS and exposed files', 'Risk level per finding', 'Prioritised recommendations'],
    },
    {
      nav: 'Mediation',
      name: 'Domain Mediation',
      title: 'Domain deals,',
      accent: 'mediated with clarity.',
      body: 'Value a domain from verified comparable sales, then guide buyer and owner through every offer to a signed agreement and a clean transfer.',
      points: ['Valuation with confidence level', 'Complete offer history', 'Stage-by-stage progress', 'Fee and VAT calculation'],
    },
    {
      nav: 'Toolkit',
      name: 'Complete toolkit',
      title: 'Five tools.',
      accent: 'One workspace.',
      body: 'Domain, certificate, website, security and mediation work, connected in one dashboard. One search bar, one activity feed, one place to start every ticket.',
      points: ['Unified dashboard and activity feed', 'One search for domains, IPs and customers', 'Works on desktop, tablet and phone', 'Built for hosting support teams'],
    },
  ],
  nl: [
    {
      nav: 'Domein',
      name: 'Domain Intelligence',
      title: 'Alles over een domein.',
      accent: 'In één opzoeking.',
      body: 'Registratie, nameservers, DNS-records en het netwerk achter elk IP-adres. In seconden bij elkaar, in één overzicht, klaar voor de klant aan de lijn.',
      points: ['WHOIS en registrarstatus', 'Alle DNS-records met TTL', 'Propagatie over meerdere resolvers', 'Reverse DNS, ASN en locatie'],
    },
    {
      nav: 'SSL',
      name: 'SSL Monitor',
      title: 'Certificaten onder controle.',
      accent: 'Voordat ze verlopen.',
      body: 'Scan een complete portfolio in één keer. Zie welke certificaten geldig zijn, welke bijna verlopen, wie ze heeft uitgegeven en welke TLS-versies ze ondersteunen.',
      points: ['Batchscan met live voortgang', 'Aftellen tot de verloopdatum per domein', 'Controle van uitgever en keten', 'Herkenning van TLS-protocollen'],
    },
    {
      nav: 'Website',
      name: 'Website Intelligence',
      title: 'Weet wat een site draait.',
      accent: 'Zonder in te loggen.',
      body: 'Volg elke doorverwijzing, lees de HTTP-status, herken het CMS en de PHP-versie en zie de technische details die verklaren waarom een site hapert.',
      points: ['Doorverwijzingen met statuscodes', 'Herkenning van CMS, plugins en PHP', 'Analyse van snelheid en caching', 'Ophalen met SSRF-bescherming'],
    },
    {
      nav: 'Beveiliging',
      name: 'Security Audit',
      title: 'Een beveiligingsscore',
      accent: 'die je kunt uitleggen.',
      body: 'Een transparante, gewogen score op basis van externe, niet-destructieve controles. Elk verloren punt is terug te voeren op een bevinding, en bij elke bevinding hoort een aanbeveling.',
      points: ['Score van 0 tot 100 over zes categorieën', 'Headers, TLS, DNS en openbare bestanden', 'Risiconiveau per bevinding', 'Aanbevelingen op volgorde van prioriteit'],
    },
    {
      nav: 'Bemiddeling',
      name: 'Domeinbemiddeling',
      title: 'Domeinverkoop,',
      accent: 'helder bemiddeld.',
      body: 'Waardeer een domein op basis van geverifieerde vergelijkbare verkopen en begeleid koper en eigenaar via elk bod naar een getekend akkoord en een nette overdracht.',
      points: ['Waardering met betrouwbaarheid', 'Volledige biedingsgeschiedenis', 'Voortgang per fase', 'Berekening van kosten en btw'],
    },
    {
      nav: 'Toolkit',
      name: 'Complete toolkit',
      title: 'Vijf tools.',
      accent: 'Eén werkplek.',
      body: 'Domeinen, certificaten, websites, beveiliging en bemiddeling, verbonden in één dashboard. Eén zoekbalk, één activiteitenoverzicht, één startpunt voor elk ticket.',
      points: ['Eén dashboard en activiteitenoverzicht', 'Eén zoekbalk voor domeinen, IP’s en klanten', 'Werkt op desktop, tablet en telefoon', 'Gemaakt voor hostingsupportteams'],
    },
  ],
};

export const getChapters = (lang: Lang): Chapter[] => structure.map((s, i) => ({ ...s, ...copy[lang][i] }));

/** Anchor ids, the same in every language. */
export const chapterIds = structure.map((s) => s.id);
