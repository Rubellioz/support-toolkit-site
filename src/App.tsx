import { lazy, Suspense } from 'react';
import { SiteHeader } from './components/sections/SiteHeader';
import { ScrollStage } from './components/sections/ScrollStage';
import { FinalCta } from './components/sections/FinalCta';
import { Footer } from './components/sections/Footer';
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion';

// Only loaded for visitors who prefer reduced motion.
const StaticTour = lazy(() => import('./components/sections/StaticTour'));

export function App() {
  const reduced = usePrefersReducedMotion();
  return (
    <>
      <SiteHeader />
      <main id="main" tabIndex={-1} className="outline-none">
        {reduced ? (
          <Suspense fallback={<div className="h-[100svh]" />}>
            <StaticTour />
          </Suspense>
        ) : (
          <ScrollStage />
        )}
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
