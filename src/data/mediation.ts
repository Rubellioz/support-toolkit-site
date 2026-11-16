import type { Lang } from '../i18n/lang';

const amounts = [1800, 5500, 2750, 4600, 3600];
const parties = ['buyer', 'owner', 'buyer', 'owner', 'buyer'] as const;

const text = {
  en: {
    confidence: 'Medium',
    basis: '4 verified comparable sales',
    stages: ['Intake', 'Valuation', 'Outreach', 'Negotiation', 'Agreement', 'Transfer'],
    party: { buyer: 'Buyer', owner: 'Owner' },
    dates: ['28 Oct', '30 Oct', '04 Nov', '09 Nov', '14 Nov'],
    kinds: ['Opening bid', 'Counter-offer', 'Revised bid', 'Counter-offer', 'Latest bid'],
    fees: ['Expected deal', 'Mediation fee (10%)', 'VAT (21%)'],
  },
  nl: {
    confidence: 'Gemiddelde',
    basis: '4 geverifieerde vergelijkbare verkopen',
    stages: ['Intake', 'Waardering', 'Benadering', 'Onderhandeling', 'Akkoord', 'Overdracht'],
    party: { buyer: 'Koper', owner: 'Eigenaar' },
    dates: ['28 okt', '30 okt', '04 nov', '09 nov', '14 nov'],
    kinds: ['Openingsbod', 'Tegenbod', 'Herzien bod', 'Tegenbod', 'Laatste bod'],
    fees: ['Verwachte deal', 'Bemiddelingskosten (10%)', 'Btw (21%)'],
  },
};

export function getMediation(lang: Lang) {
  const t = text[lang];
  return {
    domain: 'harbourline.example',
    valuation: { conservative: 2400, market: 4100, premium: 6800, confidence: t.confidence, basis: t.basis },
    stages: t.stages,
    activeStage: 3,
    offers: amounts.map((amount, i) => ({ date: t.dates[i], buyer: parties[i] === 'buyer', party: t.party[parties[i]], kind: t.kinds[i], amount })),
    fees: [3900, 390, 81.9].map((value, i) => ({ label: t.fees[i], value })),
  };
}
