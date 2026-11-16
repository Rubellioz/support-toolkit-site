import { RefreshCw, Lock } from 'lucide-react';
import { sslScan } from '../../../data/ssl';
import { Card, PageHead, Pill, StatusIcon } from '../primitives';

export function SslView() {
  return (
    <div className="flex h-full flex-col">
      <PageHead crumb="Certificates" title="SSL Monitor">
        <span className="flex h-9 items-center gap-2 rounded-[10px] bg-blue px-3.5 text-[12.5px] font-semibold text-white shadow-[0_6px_14px_-6px_rgb(23_101_245/0.7)]">
          <RefreshCw size={14} aria-hidden /> Scan all {sslScan.total} domains
        </span>
      </PageHead>

      <div className="dash-card mb-3 flex items-center gap-6 px-5 py-4" data-focus="ssl-progress">
        <div className="w-[320px] shrink-0">
          <div className="flex items-baseline justify-between">
            <p className="text-[12.5px] font-semibold">
              <span data-scan-label>Scanning portfolio…</span>
            </p>
            <p className="mono tabular text-[12px] text-muted">
              <span data-scan-count>0</span> / {sslScan.total}
            </p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-line-2">
            <div data-scan-bar className="h-full w-full origin-left rounded-full bg-gradient-to-r from-blue to-cyan" style={{ transform: 'scaleX(1)' }} />
          </div>
        </div>
        <div className="grid flex-1 grid-cols-4 gap-2">
          {sslScan.summary.map((s) => (
            <div key={s.label} className="rounded-[10px] border border-line-2 bg-canvas px-3 py-2" data-reveal>
              <p className="tabular text-[18px] font-semibold tracking-[-0.02em]">{s.value}</p>
              <Pill status={s.status} className="!px-0 !bg-transparent">
                {s.label}
              </Pill>
            </div>
          ))}
        </div>
      </div>

      <Card title="Certificates" action={<span className="text-[11.5px] text-subtle">Sorted by urgency</span>} className="min-h-0 flex-1" data-focus="ssl-table">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b border-line-2">
              <th className="dash-th w-[34%] py-2.5 pl-4">Domain</th>
              <th className="dash-th w-[17%] py-2.5">Status</th>
              <th className="dash-th w-[20%] py-2.5">Issuer</th>
              <th className="dash-th w-[13%] py-2.5">Expires</th>
              <th className="dash-th w-[8%] py-2.5 text-right">Days</th>
              <th className="dash-th w-[8%] py-2.5 pr-4 text-right">TLS</th>
            </tr>
          </thead>
          <tbody>
            {sslScan.rows.map((r) => (
              <tr key={r.domain} className="relative border-b border-line-2 last:border-0" data-scan-row>
                <td className="py-[11px] pl-4">
                  <span className="flex items-center gap-2">
                    <Lock size={12} className="shrink-0 text-subtle" aria-hidden />
                    <span className="mono truncate text-[12px] font-medium">{r.domain}</span>
                  </span>
                </td>
                <td className="relative py-[11px]">
                  <span data-pending className="absolute inset-y-0 left-0 flex items-center gap-1.5 text-[11.5px] text-subtle" style={{ opacity: 0 }}>
                    <StatusIcon status="pending" size={13} /> Checking…
                  </span>
                  <span data-result>
                    <Pill status={r.status}>{r.label}</Pill>
                  </span>
                </td>
                <td className="truncate py-[11px] text-[12px] text-muted" data-result>
                  {r.issuer}
                </td>
                <td className="mono py-[11px] text-[11.5px]" data-result>
                  {r.expires}
                </td>
                <td
                  className={`mono tabular py-[11px] text-right text-[11.5px] font-semibold ${r.status === 'bad' ? 'text-bad' : r.status === 'warn' ? 'text-warn' : 'text-ink-2'}`}
                  data-result
                >
                  {r.days}
                </td>
                <td className="py-[11px] pr-4 text-right" data-result>
                  <span className="mono rounded-[6px] bg-line-2 px-1.5 py-0.5 text-[10.5px] font-medium text-ink-2">{r.tls.replace('TLS ', '')}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="mt-auto flex items-center gap-2 border-t border-line-2 px-4 py-2.5 text-[11.5px] text-muted">
          <StatusIcon status="info" size={13} /> Showing 7 of 18 · sample portfolio, sorted by urgency.
        </p>
      </Card>
    </div>
  );
}
