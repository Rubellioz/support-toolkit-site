import { FileDown } from 'lucide-react';
import { securityAudit as s } from '../../../data/security';
import { Card, PageHead, Pill, StatusIcon } from '../primitives';

export const RING_R = 64;
export const RING_C = 2 * Math.PI * RING_R;

const prioTone: Record<string, string> = {
  High: 'bg-bad-50 text-bad',
  Medium: 'bg-warn-50 text-warn',
  Low: 'bg-blue-50 text-blue',
};

export function SecurityView() {
  return (
    <div className="flex h-full flex-col">
      <PageHead crumb="Security" title={<>Security Audit <span className="mono text-[15px] font-medium text-muted">· {s.host}</span></>}>
        <span className="flex h-9 items-center gap-2 rounded-[10px] border border-line bg-white px-3.5 text-[12.5px] font-semibold shadow-[var(--shadow-card)]">
          <FileDown size={14} aria-hidden /> Export report
        </span>
      </PageHead>

      <div className="grid min-h-0 flex-1 grid-cols-[380px_1fr] gap-3">
        <Card title="Security score" action={<span className="text-[11.5px] text-subtle">38 checks · non-destructive</span>} data-focus="security-score">
          <div className="flex items-center gap-5 px-5 pt-5">
            <div className="relative size-[150px] shrink-0">
              <svg viewBox="0 0 150 150" className="size-full -rotate-90" aria-hidden>
                <defs>
                  <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="var(--color-blue)" />
                    <stop offset="100%" stopColor="var(--color-cyan)" />
                  </linearGradient>
                </defs>
                <circle cx="75" cy="75" r={RING_R} fill="none" stroke="var(--color-line-2)" strokeWidth="11" />
                <circle
                  data-score-ring
                  cx="75"
                  cy="75"
                  r={RING_R}
                  fill="none"
                  stroke="url(#ring-grad)"
                  strokeWidth="11"
                  strokeLinecap="round"
                  strokeDasharray={RING_C}
                  strokeDashoffset={RING_C * (1 - s.score / 100)}
                />
              </svg>
              <div className="absolute inset-0 grid place-items-center text-center">
                <div>
                  <p className="tabular text-[40px] font-semibold leading-none tracking-[-0.04em]" data-score-num>
                    {s.score}
                  </p>
                  <p className="mt-1 text-[11px] text-subtle">out of 100</p>
                </div>
              </div>
            </div>
            <div>
              <Pill status="ok">{s.grade}</Pill>
              <p className="mt-2 text-[12px] leading-snug text-muted">
                Weighted across six categories. A proven high risk would cap the total at 74.
              </p>
            </div>
          </div>
          <ul className="mt-auto space-y-2.5 px-5 pb-5 pt-4">
            {s.categories.map((c) => (
              <li key={c.label} data-reveal>
                <div className="flex justify-between text-[11.5px]">
                  <span className="font-medium">
                    {c.label} <span className="text-subtle">· {c.weight}%</span>
                  </span>
                  <span className="mono tabular font-semibold">{c.score}</span>
                </div>
                <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line-2">
                  <div
                    data-cat-bar
                    className={`h-full origin-left rounded-full ${c.score >= 90 ? 'bg-ok' : c.score >= 75 ? 'bg-blue' : 'bg-warn'}`}
                    style={{ transform: `scaleX(${c.score / 100})` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex min-w-0 flex-col gap-3">
          <Card title="Check results" action={<span className="text-[11.5px] text-subtle">4 passed · 2 warnings · 1 failed</span>} data-focus="security-checks">
            <ul className="divide-y divide-line-2 px-4">
              {s.checks.map((c) => (
                <li key={c.label} className="flex items-center gap-3 py-[9px]" data-reveal>
                  <StatusIcon status={c.status} size={15} />
                  <span className="text-[12px] font-medium">{c.label}</span>
                  {c.risk && <span className={`ml-auto rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${prioTone[c.risk]}`}>{c.risk} risk</span>}
                  {!c.risk && <span className="ml-auto text-[11.5px] text-subtle">Passed</span>}
                </li>
              ))}
            </ul>
          </Card>
          <Card title="Recommendations" className="min-h-0 flex-1">
            <ol className="space-y-2 p-3">
              {s.recommendations.map((r, i) => (
                <li key={i} className="flex items-center gap-3 rounded-[10px] border border-line-2 bg-canvas px-3 py-2.5" data-reveal>
                  <span className="mono grid size-6 shrink-0 place-items-center rounded-full bg-white text-[11px] font-semibold shadow-[var(--shadow-card)]">{i + 1}</span>
                  <span className="text-[12px] font-medium">{r.text}</span>
                  <span className={`ml-auto shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${prioTone[r.priority]}`}>{r.priority}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}
