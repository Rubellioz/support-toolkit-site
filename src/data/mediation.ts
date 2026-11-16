export const mediation = {
  domain: 'harbourline.example',
  valuation: { conservative: 2400, market: 4100, premium: 6800, confidence: 'Medium', basis: '4 verified comparable sales' },
  stages: ['Intake', 'Valuation', 'Outreach', 'Negotiation', 'Agreement', 'Transfer'],
  activeStage: 3,
  offers: [
    { date: '28 Oct', party: 'Buyer', kind: 'Opening bid', amount: 1800 },
    { date: '30 Oct', party: 'Owner', kind: 'Counter-offer', amount: 5500 },
    { date: '04 Nov', party: 'Buyer', kind: 'Revised bid', amount: 2750 },
    { date: '09 Nov', party: 'Owner', kind: 'Counter-offer', amount: 4600 },
    { date: '14 Nov', party: 'Buyer', kind: 'Latest bid', amount: 3600 },
  ],
  fees: [
    { label: 'Expected deal', value: 3900 },
    { label: 'Mediation fee (10%)', value: 390 },
    { label: 'VAT (21%)', value: 81.9 },
  ],
};

export const eur = (n: number, digits = 0) =>
  new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR', maximumFractionDigits: digits, minimumFractionDigits: digits }).format(n);
