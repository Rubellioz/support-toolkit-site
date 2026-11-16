import { chapters } from '../../data/chapters';
import { DEMO_NOTICE } from '../../data/types';
import { ScaledDashboard } from '../dashboard/ScaledDashboard';
import { ChapterText } from './ChapterText';
import { HeroCopy } from './HeroCopy';

/** Reduced-motion variant: same story and product views, no pinning, scrubbing or camera moves. */
export default function StaticTour() {
  return (
    <>
      <section id="top" className="relative bg-white px-4 pb-16 pt-28 sm:px-8" aria-labelledby="hero-title">
        <HeroCopy />
        <div className="mx-auto mt-14 max-w-[1180px]">
          <ScaledDashboard view="overview" />
          <p className="mt-3 text-center text-[12px] text-subtle">{DEMO_NOTICE}</p>
        </div>
      </section>
      {chapters.map((c, i) => (
        <section key={c.id} id={c.id} className="scroll-mt-16 border-t border-line-2 px-4 py-16 sm:px-8 lg:py-24" aria-labelledby={`${c.id}-title`}>
          <div className="mx-auto grid max-w-[1320px] items-center gap-10 lg:grid-cols-[0.75fr_1.6fr] lg:gap-16">
            <div id={`${c.id}-title`}>
              <ChapterText chapter={c} index={i} total={chapters.length} />
            </div>
            <ScaledDashboard view={c.view} />
          </div>
        </section>
      ))}
    </>
  );
}
