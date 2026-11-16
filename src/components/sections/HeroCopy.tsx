import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { site } from '../../config/site';
import { chapters } from '../../data/chapters';
import { goToChapter } from '../../lib/tourNav';

export function HeroCopy({ className = '' }: { className?: string }) {
  return (
    <div className={`mx-auto max-w-[880px] px-4 text-center ${className}`}>
      <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 backdrop-blur">
        <span className="size-1.5 rounded-full bg-cyan" />
        The workspace for hosting support
      </p>
      <h1 id="hero-title" className="display mt-6 text-[clamp(2.6rem,7.4vw,6.2rem)] text-ink">
        Support smarter.
        <br />
        <span className="serif-accent text-gradient pr-[0.06em] text-[1.08em]">Work faster.</span>
      </h1>
      <p className="mx-auto mt-5 max-w-[560px] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-muted">
        Domain intelligence, SSL monitoring, website diagnostics, security audits and domain mediation. One calm, fast workspace
        for every ticket.
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`#${chapters[0].id}`}
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            goToChapter(chapters[0].id);
          }}
        >
          Take the tour <ArrowDown size={16} aria-hidden />
        </a>
        {site.appUrl && (
          <a href={site.appUrl} className="btn btn-secondary" rel="noopener">
            Sign in <ArrowUpRight size={16} aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
