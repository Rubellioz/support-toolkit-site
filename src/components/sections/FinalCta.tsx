import { ArrowUpRight, Mail, ShieldCheck, LockKeyhole, Zap } from 'lucide-react';
import { site } from '../../config/site';
import { useT } from '../../i18n/context';

const principleIcons = [ShieldCheck, LockKeyhole, Zap];

export function FinalCta() {
  const t = useT();
  const c = t.cta;
  return (
    <section id="get-started" className="relative overflow-hidden border-t border-line-2 bg-canvas px-4 py-24 sm:px-8 lg:py-32" aria-labelledby="cta-title">
      <div className="relative mx-auto max-w-[1180px]">
        <div className="mx-auto max-w-[760px] text-center">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 id="cta-title" className="display mt-4 text-[clamp(2.2rem,5.4vw,4.4rem)]">
            {c.title} <span className="serif-accent pr-[0.06em] text-[1.06em]">{c.accent}</span>
          </h2>
          <p className="mx-auto mt-5 max-w-[520px] text-[1.05rem] leading-relaxed text-muted">
            {c.body}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {site.appUrl && (
              <a href={site.appUrl} rel="noopener" className="btn btn-primary">
                {t.header.signInFull} <ArrowUpRight size={16} aria-hidden />
              </a>
            )}
            {site.contactEmail && (
              <a href={`mailto:${site.contactEmail}?subject=${encodeURIComponent(c.mailSubject)}`} className="btn btn-secondary">
                <Mail size={16} aria-hidden /> {c.requestAccess}
              </a>
            )}
            {!site.appUrl && !site.contactEmail && (
              <a href="#top" className="btn btn-primary">
                {c.backToTour}
              </a>
            )}
          </div>
        </div>

        <ul className="mt-20 grid gap-4 md:grid-cols-3">
          {c.principles.map(({ title, text }, i) => {
            const Icon = principleIcons[i];
            return (
            <li key={title} className="rounded-[20px] border border-line bg-white p-6 shadow-xs">
              <span className="grid size-10 place-items-center rounded-[12px] bg-blue-50 text-blue">
                <Icon size={19} aria-hidden />
              </span>
              <h3 className="mt-5 text-[1.05rem] font-semibold">{title}</h3>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{text}</p>
            </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
