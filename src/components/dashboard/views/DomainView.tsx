import { Globe, Server, MapPin, Copy } from 'lucide-react';
import { getDomainLookup } from '../../../data/domain';
import { useLang, useT } from '../../../i18n/context';
import { Card, PageHead, Pill, QueryBar, StatusIcon } from '../primitives';

const typeColor: Record<string, string> = {
  A: 'bg-blue-50 text-blue',
  AAAA: 'bg-blue-50 text-blue',
  CNAME: 'bg-cyan-50 text-[#0a8aa6]',
  MX: 'bg-[#f1edff] text-[#5b46d6]',
  TXT: 'bg-line-2 text-ink-2',
  CAA: 'bg-ok-50 text-ok',
};

export function DomainView() {
  const d = getDomainLookup(useLang());
  const t = useT().dash;
  return (
    <div className="flex h-full flex-col">
      <PageHead crumb={t.nav.domain.crumb} title={t.nav.domain.label}>
        <QueryBar icon={<Globe size={14} aria-hidden />} value={d.query} action={t.domain.lookup} />
      </PageHead>

      <div className="grid min-h-0 flex-1 grid-cols-[300px_1fr] gap-3">
        <div className="flex flex-col gap-3">
          <Card title={t.domain.overview} action={<Pill status="ok">{t.domain.active}</Pill>}>
            <dl className="px-4 py-1.5">
              {d.overview.map((o) => (
                <div key={o.label} className="flex justify-between gap-3 border-b border-line-2 py-2 last:border-0" data-reveal>
                  <dt className="text-[12px] text-muted">{o.label}</dt>
                  <dd className="text-right text-[12px] font-medium">{o.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
          <Card title={t.domain.ip} action={<MapPin size={14} className="text-subtle" aria-hidden />} data-focus="ip-info">
            <dl className="px-4 py-1.5">
              {d.ip.map((o) => (
                <div key={o.label} className="flex justify-between gap-3 border-b border-line-2 py-2 last:border-0" data-reveal>
                  <dt className="text-[12px] text-muted">{o.label}</dt>
                  <dd className="mono text-right text-[11.5px] font-medium">{o.value}</dd>
                </div>
              ))}
            </dl>
          </Card>
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <Card title={t.domain.nameservers} action={<span className="text-[11.5px] text-ok">{t.domain.responding}</span>}>
            <div className="grid grid-cols-3 gap-2 p-3">
              {d.nameservers.map((n) => (
                <div key={n.host} className="flex items-center gap-2.5 rounded-[10px] border border-line-2 bg-canvas px-3 py-2.5" data-reveal>
                  <Server size={14} className="text-blue" aria-hidden />
                  <div className="min-w-0">
                    <p className="mono truncate text-[11.5px] font-medium">{n.host}</p>
                    <p className="mono text-[11px] text-subtle">{n.ip}</p>
                  </div>
                  <span className="ml-auto">
                    <StatusIcon status="ok" size={13} />
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card
            title={t.domain.records}
            action={<span className="text-[11.5px] text-subtle">{t.domain.recordsMeta}</span>}
            className="min-h-0 flex-1"
            data-focus="dns-records"
          >
            <table className="w-full table-fixed text-left">
              <thead>
                <tr className="border-b border-line-2">
                  <th className="dash-th w-[84px] py-2 pl-4">{t.domain.cols[0]}</th>
                  <th className="dash-th w-[86px] py-2">{t.domain.cols[1]}</th>
                  <th className="dash-th py-2">{t.domain.cols[2]}</th>
                  <th className="dash-th w-[70px] py-2 pr-4 text-right">{t.domain.cols[3]}</th>
                </tr>
              </thead>
              <tbody>
                {d.records.map((r, i) => (
                  <tr key={i} className="border-b border-line-2 last:border-0" data-reveal>
                    <td className="py-[7px] pl-4">
                      <span className={`mono rounded-[6px] px-1.5 py-0.5 text-[10.5px] font-semibold ${typeColor[r.type]}`}>{r.type}</span>
                    </td>
                    <td className="mono py-[7px] text-[11.5px] text-muted">{r.name}</td>
                    <td className="py-[7px]">
                      <span className="mono flex items-center gap-2 truncate text-[11.5px]">
                        <span className="truncate">{r.value}</span>
                        {i === 0 && <Copy size={11} className="shrink-0 text-subtle" aria-hidden />}
                      </span>
                    </td>
                    <td className="mono py-[7px] pr-4 text-right text-[11.5px] text-subtle">{r.ttl}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div className="dash-card flex items-center gap-3 px-4 py-2.5">
            <span className="text-[12px] font-semibold">{t.domain.propagation}</span>
            <div className="flex flex-1 items-center gap-1.5">
              {d.propagation.map((p) => (
                <span
                  key={p.resolver}
                  data-reveal
                  className={`flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-medium ${p.ok ? 'bg-ok-50 text-ok' : 'bg-warn-50 text-warn'}`}
                >
                  <span className="size-1.5 rounded-full bg-current" />
                  {p.resolver}
                </span>
              ))}
            </div>
            <span className="text-[11.5px] text-muted">{t.domain.updated}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
