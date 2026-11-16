import { Link2, ArrowRight, Server, Code2, Layers, Activity } from 'lucide-react';
import { getWebsiteScan } from '../../../data/website';
import { useLang, useT } from '../../../i18n/context';
import { Card, PageHead, Pill, QueryBar, StatusIcon } from '../primitives';

const factIcons = { http: Activity, cms: Layers, php: Code2, server: Server } as const;

export function WebsiteView() {
  const w = getWebsiteScan(useLang());
  const t = useT().dash;
  return (
    <div className="flex h-full flex-col">
      <PageHead crumb={t.nav.website.crumb} title={t.nav.website.label}>
        <QueryBar icon={<Link2 size={14} aria-hidden />} value={w.url} action={t.website.analyse} />
      </PageHead>

      <Card title={t.website.chain} action={<span className="text-[11.5px] text-subtle">{t.website.chainMeta}</span>}>
        <ol className="flex items-center gap-2 p-3">
          {w.chain.map((c, i) => (
            <li key={i} className="flex min-w-0 flex-1 items-center gap-2" data-reveal>
              <div className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[10px] border border-line-2 bg-canvas px-3 py-2">
                <span className={`mono rounded-[6px] px-1.5 py-0.5 text-[11px] font-semibold ${c.code === 200 ? 'bg-ok-50 text-ok' : 'bg-blue-50 text-blue'}`}>{c.code}</span>
                <div className="min-w-0">
                  <p className="mono truncate text-[11.5px]">{c.url}</p>
                  <p className="text-[11px] text-subtle">{c.note}</p>
                </div>
              </div>
              {i < w.chain.length - 1 && <ArrowRight size={14} className="shrink-0 text-subtle" aria-hidden />}
            </li>
          ))}
        </ol>
      </Card>

      <div className="mt-3 grid grid-cols-4 gap-3" data-focus="web-facts">
        {w.facts.map((f) => {
          const Icon = factIcons[f.id as keyof typeof factIcons];
          return (
            <div key={f.id} className="dash-card p-4" data-reveal>
              <div className="flex items-center justify-between">
                <span className="grid size-8 place-items-center rounded-[9px] bg-blue-50 text-blue">
                  <Icon size={15} aria-hidden />
                </span>
                <StatusIcon status={f.status} size={14} />
              </div>
              <p className="mt-3 text-[11.5px] font-medium text-muted">{f.label}</p>
              <p className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em]">{f.value}</p>
              <p className="mt-0.5 text-[11.5px] text-subtle">{f.sub}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1.2fr_1fr] gap-3">
        <Card title={t.website.analysis} action={<Pill status="ok">{t.website.healthy}</Pill>}>
          <ul className="divide-y divide-line-2 px-4">
            {w.analysis.map((a) => (
              <li key={a.label} className="flex items-center gap-3 py-[9px]" data-reveal>
                <StatusIcon status={a.status} size={14} />
                <span className="text-[12px] font-medium">{a.label}</span>
                <span className="ml-auto text-[12px] text-muted">{a.value}</span>
              </li>
            ))}
          </ul>
        </Card>
        <Card title={t.website.preview} action={<span className="text-[11.5px] text-subtle">1440 × 900</span>}>
          <div className="flex-1 p-3" data-reveal>
            <div className="h-full overflow-hidden rounded-[10px] border border-line bg-white">
              <div className="flex items-center gap-1.5 border-b border-line-2 bg-canvas px-2.5 py-1.5">
                <span className="size-2 rounded-full bg-[#f1c2c2]" />
                <span className="size-2 rounded-full bg-[#f3dfae]" />
                <span className="size-2 rounded-full bg-[#bfe3cc]" />
                <span className="mono ml-2 truncate text-[10px] text-subtle">shop.northwind.example</span>
              </div>
              <div className="space-y-2.5 p-3">
                <div className="flex items-center justify-between">
                  <span className="h-2.5 w-16 rounded-full bg-ink/80" />
                  <span className="flex gap-2">
                    <span className="h-1.5 w-8 rounded-full bg-line" />
                    <span className="h-1.5 w-8 rounded-full bg-line" />
                    <span className="h-1.5 w-8 rounded-full bg-line" />
                  </span>
                </div>
                <div className="grid grid-cols-[1.2fr_1fr] gap-3 pt-1">
                  <div className="space-y-1.5 pt-2">
                    <span className="block h-3 w-full rounded-full bg-ink/75" />
                    <span className="block h-3 w-3/4 rounded-full bg-ink/75" />
                    <span className="block h-1.5 w-5/6 rounded-full bg-line" />
                    <span className="block h-1.5 w-2/3 rounded-full bg-line" />
                    <span className="mt-2 block h-4 w-16 rounded-full bg-blue" />
                  </div>
                  <div className="h-[88px] rounded-[8px] bg-gradient-to-br from-blue-100 via-cyan-50 to-white" />
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[0, 1, 2].map((i) => (
                    <div key={i} className="h-10 rounded-[6px] bg-canvas" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
