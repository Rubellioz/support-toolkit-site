import { Globe, ShieldCheck, ScanSearch, ShieldAlert, Handshake, ArrowUpRight, type LucideIcon } from 'lucide-react';
import { getOverview, expiryBars } from '../../../data/overview';
import { useLang, useT } from '../../../i18n/context';
import { Card, PageHead, Pill, StatusIcon } from '../primitives';
import { cn } from '../../../lib/cn';

const moduleIcons: Record<string, LucideIcon> = {
  domain: Globe,
  ssl: ShieldCheck,
  website: ScanSearch,
  security: ShieldAlert,
  mediation: Handshake,
};

export function OverviewView() {
  const lang = useLang();
  const t = useT().dash.overview;
  const { kpis, modules, activity } = getOverview(lang);
  const max = Math.max(...expiryBars);
  return (
    <div className="flex h-full flex-col">
      <PageHead crumb={t.date} title={t.greeting}>
        <span className="flex items-center gap-2 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-medium text-ink-2 shadow-xs">
          <span className="live-dot size-2 rounded-full bg-ok" />
          {t.status}
        </span>
      </PageHead>

      <div className="grid grid-cols-4 gap-3" data-focus="overview-kpis">
        {kpis.map((k) => (
          <div key={k.id} className="dash-card p-4" data-reveal>
            <p className="text-[11.5px] font-medium text-muted">{k.label}</p>
            <p className="mt-2 flex items-baseline gap-1.5">
              <span className="tabular-nums text-[26px] font-semibold">{k.value}</span>
              {k.suffix && <span className="text-[13px] text-subtle">{k.suffix}</span>}
            </p>
            <p className={cn('mt-1 text-[11.5px]', k.status === 'warn' ? 'text-warn' : k.status === 'ok' ? 'text-ok' : 'text-subtle')}>{k.delta}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 grid grid-cols-5 gap-3" data-focus="overview-modules">
        {modules.map((m) => {
          const Icon = moduleIcons[m.id];
          return (
            <div key={m.id} className="dash-card relative overflow-hidden p-3.5" data-reveal data-module={m.id}>
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-[9px] bg-blue-50 text-blue">
                  <Icon size={16} strokeWidth={2} aria-hidden />
                </span>
                <StatusIcon status={m.status} size={14} />
              </div>
              <p className="mt-3 text-[12px] font-semibold">{m.name}</p>
              <p className="mt-1 flex items-baseline gap-1">
                <span className="tabular-nums text-[17px] font-semibold">{m.metric}</span>
              </p>
              <p className="text-[11px] text-subtle">{m.unit}</p>
              <p className="mt-2 border-t border-line-2 pt-2 text-[11px] text-muted">{m.note}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1.55fr_1fr] gap-3">
        <Card title={t.activity} action={<span className="flex items-center gap-1 text-[11.5px] font-medium text-blue">{t.viewAll} <ArrowUpRight size={12} aria-hidden /></span>}>
          <ul className="flex-1 divide-y divide-line-2 px-4">
            {activity.map((a) => (
              <li key={a.time + a.target} className="flex items-center gap-3 py-[9px]" data-reveal>
                <StatusIcon status={a.status} size={14} />
                <span className="mono w-10 shrink-0 text-subtle">{a.time}</span>
                <span className="w-[132px] shrink-0 truncate text-[12px] font-medium">{a.who}</span>
                <span className="truncate text-[12px] text-muted">
                  {a.text} <span className="mono text-ink-2">{a.target}</span>
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={t.expiring} action={<Pill status="warn">{t.nextWeeks}</Pill>}>
          <div className="flex flex-1 items-end gap-2.5 px-4 pb-3 pt-4">
            {expiryBars.map((v, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
                <span className="tabular-nums text-[11px] font-medium text-muted">{v}</span>
                <div
                  data-bar
                  className="w-full origin-bottom rounded-[6px] bg-blue"
                  style={{ height: `${(v / max) * 130}px`, opacity: i === 0 ? 1 : 0.55 + (v / max) * 0.45 }}
                />
                <span className="text-[10.5px] text-subtle">{t.week}{i + 47 > 52 ? i - 5 : i + 47}</span>
              </div>
            ))}
          </div>
          <p className="border-t border-line-2 px-4 py-2.5 text-[11.5px] text-muted">
            <span className="font-semibold text-ink">{t.renewals}</span> {t.renewalsTail}
          </p>
        </Card>
      </div>
    </div>
  );
}
