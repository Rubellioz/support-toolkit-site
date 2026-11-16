import { site } from '../../config/site';
import { chapters, viewTitle } from '../../data/chapters';
import { DEMO_NOTICE } from '../../data/types';
import { goToChapter } from '../../lib/tourNav';

export function Footer() {
  return (
    <footer className="border-t border-line bg-white px-4 pb-10 pt-14 sm:px-8">
      <div className="mx-auto grid max-w-[1180px] gap-10 md:grid-cols-[1.3fr_1fr_1fr]">
        <div>
          <p className="flex items-center gap-2.5">
            <img src="/icon-192.png" alt="" width={28} height={28} className="size-7 rounded-[8px]" loading="lazy" />
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Support Toolkit</span>
          </p>
          <p className="mt-4 max-w-[360px] text-[0.9rem] leading-relaxed text-muted">{site.tagline} The workspace for hosting support teams.</p>
        </div>
        <nav aria-label="Modules">
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle">Modules</h2>
          <ul className="mt-4 space-y-2.5 text-[0.92rem]">
            {chapters.slice(0, 5).map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} onClick={(e) => { e.preventDefault(); goToChapter(c.id); }} className="text-ink-2 hover:text-blue">
                  {viewTitle[c.view]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-subtle">About this page</h2>
          <p className="mt-4 text-[0.85rem] leading-relaxed text-muted">{DEMO_NOTICE}</p>
          {site.appUrl && (
            <a href={site.appUrl} rel="noopener" className="mt-4 inline-block text-[0.92rem] font-medium text-blue hover:underline">
              Sign in to the toolkit →
            </a>
          )}
        </div>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1180px] flex-wrap justify-between gap-3 border-t border-line-2 pt-6 text-[0.8rem] text-subtle">
        <p>© {new Date().getFullYear()} Support Toolkit</p>
        <a href="#top" className="hover:text-ink">Back to top ↑</a>
      </div>
    </footer>
  );
}

