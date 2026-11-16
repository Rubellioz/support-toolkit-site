import { ArrowDown, ArrowUpRight } from 'lucide-react';
import { site } from '../../config/site';
import { chapterIds } from '../../data/chapters';
import { useT } from '../../i18n/context';
import { goToChapter } from '../../lib/tourNav';

export function HeroCopy({ className = '' }: { className?: string }) {
  const t = useT().hero;
  return (
    <div className={`mx-auto max-w-[1080px] px-4 text-center ${className}`}>
      <p className="eyebrow inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 backdrop-blur">
        <span className="size-1.5 rounded-full bg-cyan" />
        {t.eyebrow}
      </p>
      <h1 id="hero-title" className="display mt-6 text-[clamp(2.2rem,9vw,6rem)] text-ink">
        {t.line1}
        <br />
        <span className="serif-accent text-gradient pr-[0.06em] text-[1.08em]">{t.line2}</span>
      </h1>
      <p className="mx-auto mt-5 max-w-[560px] text-[clamp(1rem,1.6vw,1.15rem)] leading-relaxed text-muted">
        {t.body}
      </p>
      <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
        <a
          href={`#${chapterIds[0]}`}
          className="btn btn-primary"
          onClick={(e) => {
            e.preventDefault();
            goToChapter(chapterIds[0]);
          }}
        >
          {t.tour} <ArrowDown size={16} aria-hidden />
        </a>
        {site.appUrl && (
          <a href={site.appUrl} className="btn btn-secondary" rel="noopener">
            {t.signIn} <ArrowUpRight size={16} aria-hidden />
          </a>
        )}
      </div>
    </div>
  );
}
