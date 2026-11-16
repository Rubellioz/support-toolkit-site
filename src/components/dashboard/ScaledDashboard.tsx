import { useRef } from 'react';
import type { ViewId } from '../../data/chapters';
import { useFitScale } from '../../hooks/useFitScale';
import { Dashboard, DASH_W } from './Dashboard';

/** A single, fully revealed dashboard view scaled to its container (static / reduced-motion tour). */
export function ScaledDashboard({ view }: { view: ViewId }) {
  const ref = useRef<HTMLDivElement>(null);
  useFitScale(ref, DASH_W);
  return (
    <div ref={ref} className="relative aspect-[1280/800] w-full overflow-hidden rounded-[14px] bg-white shadow-[var(--shadow-frame)] sm:rounded-[20px]" aria-hidden inert>
      <div className="stage-fit absolute left-0 top-0">
        <Dashboard only={view} />
      </div>
    </div>
  );
}
