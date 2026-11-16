import { ArrowUpRight, Mail, ShieldCheck, LockKeyhole, Zap } from 'lucide-react';
import { site } from '../../config/site';

const principles = [
  {
    icon: ShieldCheck,
    title: 'Non-destructive by design',
    text: 'Audits use ordinary requests only. No exploits, no brute force, no changes. Every fetch passes SSRF protection.',
  },
  {
    icon: LockKeyhole,
    title: 'Private by default',
    text: 'Customer records and notes are encrypted at rest, scoped per account and checked server-side on every request.',
  },
  {
    icon: Zap,
    title: 'Built for the support desk',
    text: 'One search bar, slash commands and a focus mode. The answer is on screen before the customer finishes the question.',
  },
];

export function FinalCta() {
  return (
    <section id="get-started" className="relative overflow-hidden border-t border-line-2 bg-canvas px-4 py-24 sm:px-8 lg:py-32" aria-labelledby="cta-title">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(23_101_245/0.10),transparent)]" aria-hidden />
      <div className="relative mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="eyebrow">Get started</p>
          <h2 id="cta-title" className="display mt-4 text-[clamp(2.2rem,5.4vw,4.4rem)]">
            Every ticket starts <span className="serif-accent text-gradient pr-[0.06em] text-[1.06em]">in one place.</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[1.05rem] leading-relaxed text-muted">
            Support Toolkit gives your team the answers behind every domain, certificate and website, in the time it takes to say hello.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {site.appUrl && (
              <a href={site.appUrl} rel="noopener" className="btn btn-primary">
                Sign in to Support Toolkit <ArrowUpRight size={16} aria-hidden />
              </a>
            )}
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent('Support Toolkit access')}`} className="btn btn-secondary">
                <Mail size={16} aria-hidden /> Request access
              </a>
            )}
            {!site.appUrl && !site.contactEmail && (
              <a href="#top" className="btn btn-primary">
                Back to the tour
              </a>
            )}
          </div>
        </div>

        <ul className="mt-20 grid gap-4 md:grid-cols-3">
          {principles.map(({ icon: Icon, title, text }) => (
            <li key={title} className="rounded-[20px] border border-line bg-white p-6 shadow-[var(--shadow-card)]">
              <span className="grid size-10 place-items-center rounded-[12px] bg-blue-50 text-blue">
                <Icon size={19} aria-hidden />
              </span>
              <h3 className="mt-5 text-[1.05rem] font-semibold tracking-[-0.02em]">{title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
