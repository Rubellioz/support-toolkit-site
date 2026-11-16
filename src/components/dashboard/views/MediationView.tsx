import { Check } from 'lucide-react';
import { getMediation } from '../../../data/mediation';
import { formatEur } from '../../../i18n/format';
import { useLang, useT } from '../../../i18n/context';
import { Card, PageHead, Pill } from '../primitives';
import { cn } from '../../../lib/cn';

export function MediationView() {
  const lang = useLang();
  const m = getMediation(lang);
  const t = useT().dash;
  const mt = t.mediation;
  const eur = (n: number, digits = 0) => formatEur(n, lang, digits);
  const { conservative, market, premium } = m.valuation;
  const lo = 1000;
  const hi = 8000;
  const pos = (v: number) => `${((v - lo) / (hi - lo)) * 100}%`;
  const stagePct = (m.activeStage / (m.stages.length - 1)) * 100;
  const maxOffer = Math.max(...m.offers.map((o) => o.amount));

  return (
    <div className="flex h-full flex-col">
      <PageHead crumb={t.nav.mediation.crumb} title={<>{t.nav.mediation.label} <span className="mono text-[15px] font-medium text-muted">· {m.domain}</span></>}>
        <Pill status="info">{mt.dossier}</Pill>
      </PageHead>

      <div className="dash-card px-6 pb-4 pt-5" data-focus="mediation-stages">
        <div className="relative">
          <div className="absolute left-3 right-3 top-3 h-[3px] rounded-full bg-line-2" />
          <div className="absolute left-3 right-3 top-3 h-[3px]">
            <div data-stage-fill className="h-full origin-left rounded-full bg-blue" style={{ width: `${stagePct}%` }} />
          </div>
          <ol className="relative flex justify-between">
            {m.stages.map((st, i) => {
              const done = i < m.activeStage;
              const active = i === m.activeStage;
              return (
                <li key={st} className="flex w-24 flex-col items-center gap-2 first:items-start last:items-end" data-stage={i}>
                  <span
                    className={cn('grid size-[27px] place-items-center rounded-full border-2 text-[11px] font-semibold', done ? 'border-blue bg-blue text-white' : active ? 'border-blue bg-white text-blue ring-4 ring-blue-100' : 'border-line bg-white text-subtle')}
                  >
                    {done ? <Check size={13} strokeWidth={3} aria-hidden /> : i + 1}
                  </span>
                  <span className={cn('text-[11.5px] font-medium', active ? 'text-blue' : done ? 'text-ink' : 'text-subtle')}>{st}</span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1fr_1.25fr_0.85fr] gap-3">
        <Card title={mt.valuation} action={<Pill status="warn">{m.valuation.confidence} {mt.confidence}</Pill>} data-focus="mediation-valuation">
          <div className="space-y-3 p-4">
            {[
              { l: mt.conservative, v: conservative, c: 'text-muted', main: false },
              { l: mt.market, v: market, c: 'text-ink', main: true },
              { l: mt.premium, v: premium, c: 'text-muted', main: false },
            ].map((x) => (
              <div key={x.l} className="flex items-baseline justify-between" data-reveal>
                <span className="text-[12px] text-muted">{x.l}</span>
                <span className={cn('tabular-nums font-semibold', x.main ? 'text-[22px]' : 'text-[15px]', x.c)}>{eur(x.v)}</span>
              </div>
            ))}
            <div className="pt-2" data-reveal>
              <div className="relative h-2 rounded-full bg-line-2">
                <div className="absolute inset-y-0 rounded-full bg-blue-100" style={{ left: pos(conservative), right: `calc(100% - ${pos(premium)})` }} />
                <span className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white bg-ink shadow" style={{ left: pos(market) }} />
              </div>
              <div className="mt-1.5 flex justify-between text-[10.5px] text-subtle">
                <span>{eur(lo)}</span>
                <span>{eur(hi)}</span>
              </div>
            </div>
            <p className="border-t border-line-2 pt-3 text-[11.5px] text-muted" data-reveal>
              {mt.basedOn} {m.valuation.basis}. {mt.basis}
            </p>
          </div>
        </Card>

        <Card title={mt.offers} action={<span className="text-[11.5px] text-subtle">{mt.gap} {eur(1000)}</span>} data-focus="mediation-offers">
          <ul className="space-y-1 p-3">
            {m.offers.map((o, i) => {
              const buyer = o.buyer;
              return (
                <li key={i} className="grid grid-cols-[46px_1fr_auto] items-center gap-3 rounded-[10px] px-2 py-[7px]" data-offer>
                  <span className="mono text-[11px] text-subtle">{o.date}</span>
                  <div className="min-w-0">
                    <p className="text-[12px] font-medium">
                      {o.kind} <span className={cn('ml-1 text-[11px]', buyer ? 'text-blue' : 'text-ink-2')}>{o.party}</span>
                    </p>
                    <div className="mt-1 h-1.5 rounded-full bg-line-2">
                      <div className={cn('h-full rounded-full', buyer ? 'bg-blue' : 'bg-ink-2')} style={{ width: `${(o.amount / maxOffer) * 100}%` }} />
                    </div>
                  </div>
                  <span className="tabular-nums text-[13px] font-semibold">{eur(o.amount)}</span>
                </li>
              );
            })}
          </ul>
        </Card>

        <Card title={mt.fees} action={<span className="text-[11.5px] text-subtle">{mt.estimate}</span>}>
          <dl className="space-y-2.5 p-4">
            {m.fees.map((f) => (
              <div key={f.label} className="flex justify-between gap-2" data-reveal>
                <dt className="text-[12px] text-muted">{f.label}</dt>
                <dd className="tabular-nums text-[12px] font-medium">{eur(f.value, 2)}</dd>
              </div>
            ))}
            <div className="flex justify-between gap-2 border-t border-line-2 pt-2.5" data-reveal>
              <dt className="text-[12px] font-semibold">{mt.feeTotal}</dt>
              <dd className="tabular-nums text-[13px] font-semibold">{eur(m.fees[1].value + m.fees[2].value, 2)}</dd>
            </div>
          </dl>
        </Card>
      </div>
    </div>
  );
}
