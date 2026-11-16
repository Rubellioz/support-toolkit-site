import { Check } from 'lucide-react';
import { viewTitle, type Chapter } from '../../data/chapters';

export function ChapterText({ chapter, index, total, compact = false }: { chapter: Chapter; index: number; total: number; compact?: boolean }) {
  return (
    <>
      <p className="eyebrow">
        {String(index + 1).padStart(2, '0')} <span className="text-subtle">/ {String(total).padStart(2, '0')}</span> · {viewTitle[chapter.view]}
      </p>
      <h2 className="display mt-3 text-[clamp(1.6rem,3.4vw,3.1rem)] text-ink lg:mt-4">
        {chapter.title} <span className="serif-accent text-gradient pr-[0.06em] text-[1.06em]">{chapter.accent}</span>
      </h2>
      <p className={`mt-3 max-w-[460px] leading-relaxed text-muted lg:mt-5 ${compact ? 'text-[0.95rem]' : 'text-[1.02rem]'}`}>{chapter.body}</p>
      <ul className={`mt-6 space-y-2.5 ${compact ? 'hidden' : 'hidden lg:block'}`}>
        {chapter.points.map((p) => (
          <li key={p} className="flex items-center gap-3 text-[0.95rem] text-ink-2">
            <span className="grid size-5 place-items-center rounded-full bg-blue-50 text-blue">
              <Check size={12} strokeWidth={3} aria-hidden />
            </span>
            {p}
          </li>
        ))}
      </ul>
    </>
  );
}

