import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MousePointer2 } from 'lucide-react';
import { getChapters, type ViewId } from '../../data/chapters';
import { useLang, useT } from '../../i18n/context';
import { navItems } from '../dashboard/nav';
import { Dashboard, DASH_W, DASH_H } from '../dashboard/Dashboard';
import { RING_C } from '../dashboard/views/SecurityView';
import { SECURITY_SCORE, securityCategoryScores } from '../../data/security';
import { SSL_TOTAL } from '../../data/ssl';
import { HeroCopy } from './HeroCopy';
import { ChapterText } from './ChapterText';
import { useFitScale, useIsoLayoutEffect } from '../../hooks/useFitScale';
import { offsetRect, clamp } from '../../lib/geometry';
import { registerTourNavigator, registerCurrentAnchor } from '../../lib/tourNav';

gsap.registerPlugin(ScrollTrigger);

/** Timeline units. Scroll distance = total duration × UNIT of viewport height. */
const UNIT = 0.11;
const NAV_STEP = 36; // sidebar item pitch in dashboard px

/**
 * Hero + product tour as one pinned stage. A single scrubbed GSAP timeline drives:
 * hero → frame flight, view switching, sidebar + breadcrumb, progressive reveals,
 * simulated scans, and a camera that zooms into the element each chapter is about.
 */
export function ScrollStage() {
  const root = useRef<HTMLElement>(null);
  const t = useT();
  const chapters = getChapters(useLang());
  const fit = useRef<HTMLDivElement>(null);
  useFitScale(fit, DASH_W);

  useIsoLayoutEffect(() => {
    const stage = root.current!;
    const q = <T extends Element = HTMLElement>(sel: string) => stage.querySelector<T>(sel)!;
    const qa = <T extends Element = HTMLElement>(sel: string, scope: ParentNode = stage) => Array.from(scope.querySelectorAll<T>(sel));

    const frame = q('[data-frame]');
    const camera = q('[data-camera]');
    const dash = q('[data-dash]');
    const heroCopy = q('[data-hero]');
    const narrative = q('[data-narrative]');
    const hint = q('[data-hint]');
    const articles = qa('[data-chapter]');
    const railBars = qa('[data-rail]');
    const view = (v: ViewId) => q(`[data-view="${v}"]`);
    const navEl = (v: ViewId) => q(`[data-nav-item="${v}"]`);
    const navIdx = (v: ViewId) => navItems.findIndex((n) => n.view === v);

    // Measure the narrative so the frame sits right below it on small screens.
    let lastNt = '';
    const measure = () => {
      const nt = `${Math.max(...articles.map((a) => a.offsetHeight)) + 8}px`;
      if (nt === lastNt) return;
      const first = lastNt === '';
      lastNt = nt;
      stage.style.setProperty('--nt', nt);
      if (!first) ScrollTrigger.refresh(); // narrative reflowed (fonts, resize): re-measure the pin
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(narrative);

    const cleanups: (() => void)[] = [];
    const ctx = gsap.context(() => {
      /* ---------- camera ---------- */
      const cameraFor = (key: string | null) => {
        if (!key) return { x: 0, y: 0, scale: 1 };
        const el = dash.querySelector<HTMLElement>(`[data-focus="${key}"]`);
        if (!el) return { x: 0, y: 0, scale: 1 };
        const r = offsetRect(el, dash);
        const fw = frame.offsetWidth;
        const maxZoom = fw < 520 ? 2.4 : fw < 900 ? 1.9 : 1.55;
        const s = Math.max(1, Math.min(maxZoom, (DASH_W * 0.94) / r.w, (DASH_H * 0.94) / r.h));
        const x = clamp(DASH_W / 2 - s * (r.x + r.w / 2), DASH_W - s * DASH_W, 0);
        const y = clamp(DASH_H / 2 - s * (r.y + r.h / 2), DASH_H - s * DASH_H, 0);
        return { x, y, scale: s };
      };
      const camTo = (key: string | null) => ({
        x: () => cameraFor(key).x,
        y: () => cameraFor(key).y,
        scale: () => cameraFor(key).scale,
      });

      /* ---------- hero geometry: frame flies from below the headline into its tour slot ---------- */
      const heroFrame = () => {
        const sw = stage.clientWidth;
        const fw = frame.offsetWidth;
        const targetW = Math.min(sw - (sw < 640 ? 32 : 96), 1180);
        const scale = targetW / fw;
        const targetTop = heroCopy.offsetTop + heroCopy.offsetHeight + (sw < 640 ? 36 : 56);
        return {
          x: sw / 2 - (frame.offsetLeft + fw / 2),
          y: targetTop - frame.offsetTop,
          scale,
        };
      };

      /* ---------- initial state ---------- */
      gsap.set(frame, { transformOrigin: '50% 0%', transformPerspective: 1800 });
      gsap.set(camera, { transformOrigin: '0 0' });
      gsap.set(articles.slice(1), { opacity: 0, y: 24 });
      gsap.set(railBars, { scaleX: 0, transformOrigin: '0 50%' });
      for (const ch of chapters) {
        if (ch.view === 'overview') continue;
        gsap.set(qa('[data-reveal]', view(ch.view)), { autoAlpha: 0, y: 10 });
      }
      // SSL scan: everything pending
      const scanRows = qa('[data-scan-row]');
      gsap.set(qa('[data-result]', view('ssl')), { autoAlpha: 0 });
      gsap.set(qa('[data-pending]', view('ssl')), { autoAlpha: 1 });
      gsap.set(q('[data-scan-bar]'), { scaleX: 0 });
      const scanCount = q('[data-scan-count]');
      const scanLabel = q('[data-scan-label]');
      const scanText = { busy: scanLabel.dataset.busy ?? '', done: scanLabel.dataset.done ?? '' };
      scanLabel.textContent = scanText.busy;
      scanCount.textContent = '0';
      // Security: empty ring & bars
      const ring = q<SVGCircleElement>('[data-score-ring]');
      const scoreNum = q('[data-score-num]');
      gsap.set(ring, { attr: { 'stroke-dashoffset': RING_C } });
      gsap.set(qa('[data-cat-bar]'), { scaleX: 0 });
      scoreNum.textContent = '0';
      // Mediation: empty stage track, offers hidden
      gsap.set(q('[data-stage-fill]'), { scaleX: 0 });
      gsap.set(qa('[data-offer]'), { autoAlpha: 0, x: -10 });

      /* ---------- master timeline ---------- */
      const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' } });

      // Hero → first chapter
      tl.addLabel('top', 0);
      tl.fromTo(
        frame,
        { x: () => heroFrame().x, y: () => heroFrame().y, scale: () => heroFrame().scale, rotationX: 16 },
        { x: 0, y: 0, scale: 1, rotationX: 0, duration: 6, immediateRender: true },
        0,
      );
      tl.to(heroCopy, { autoAlpha: 0, y: -60, duration: 3, ease: 'power1.in' }, 0);
      tl.to(hint, { autoAlpha: 0, duration: 1 }, 0);
      tl.to(narrative, { opacity: 1, duration: 2 }, 4.5);

      let prev: ViewId = 'overview';
      chapters.forEach((ch, i) => {
        const start = i === 0 ? 6.5 : tl.duration() + 0.5;
        const v = view(ch.view);

        // --- switch: narrative, rail, sidebar, breadcrumb, view
        if (i > 0) {
          tl.to(articles[i - 1], { opacity: 0, y: -24, duration: 1.2 }, start);
          tl.fromTo(articles[i], { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 1.4, immediateRender: false }, start + 0.6);
        }
        tl.addLabel(ch.id, start + 1.6);
        tl.to(railBars[i], { scaleX: 1, duration: 1.4 }, start);

        tl.to(q('[data-nav-indicator]'), { y: navIdx(ch.view) * NAV_STEP, duration: 1.2 }, start);
        tl.to(navEl(prev), { color: '#5b6a84', duration: 0.8 }, start);
        tl.to(q(`[data-nav-item="${prev}"] [data-nav-icon]`), { color: '#5b6a84', duration: 0.8 }, start);
        tl.to(navEl(ch.view), { color: '#0a1834', duration: 0.8 }, start + 0.3);
        tl.to(q(`[data-nav-item="${ch.view}"] [data-nav-icon]`), { color: '#1765f5', duration: 0.8 }, start + 0.3);
        tl.to(q(`[data-crumb="${prev}"]`), { autoAlpha: 0, y: -8, duration: 0.8 }, start);
        tl.fromTo(q(`[data-crumb="${ch.view}"]`), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.8, immediateRender: false }, start + 0.4);

        if (prev !== ch.view) {
          tl.to(view(prev), { autoAlpha: 0, duration: 1 }, start);
          tl.fromTo(v, { autoAlpha: 0, y: 14 }, { autoAlpha: 1, y: 0, duration: 1.2, immediateRender: false }, start + 0.5);
        }

        // --- progressive content
        let t = start + 1.2;
        const reveals = qa('[data-reveal]', v);
        if (ch.view === 'overview') {
          tl.fromTo(reveals, { autoAlpha: 0.25, y: 8 }, { autoAlpha: 1, y: 0, duration: 1, stagger: 0.12, immediateRender: false }, t);
          tl.fromTo(qa('[data-bar]', v), { scaleY: 0.2 }, { scaleY: 1, duration: 1.4, stagger: 0.1, ease: 'power3.out', immediateRender: false }, t + 0.6);
          t += 2.6;
        } else {
          tl.to(reveals, { autoAlpha: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power2.out' }, t);
          t += Math.min(2.4, 0.9 + reveals.length * 0.09);
        }

        if (ch.view === 'ssl') {
          const counter = { n: 0 };
          const dur = 4.2;
          tl.to(q('[data-scan-bar]'), { scaleX: 1, duration: dur, ease: 'none' }, t);
          tl.to(
            counter,
            {
              n: SSL_TOTAL,
              duration: dur,
              ease: 'none',
              onUpdate: () => {
                const n = Math.round(counter.n);
                scanCount.textContent = String(n);
                scanLabel.textContent = n >= SSL_TOTAL ? scanText.done : scanText.busy;
              },
            },
            t,
          );
          scanRows.forEach((row, r) => {
            const at = t + (r / scanRows.length) * dur + 0.3;
            tl.to(qa('[data-pending]', row), { autoAlpha: 0, duration: 0.3 }, at);
            tl.to(qa('[data-result]', row), { autoAlpha: 1, duration: 0.4 }, at + 0.15);
          });
          t += dur;
        }

        if (ch.view === 'security') {
          const counter = { n: 0 };
          tl.to(ring, { attr: { 'stroke-dashoffset': RING_C * (1 - SECURITY_SCORE / 100) }, duration: 2.6, ease: 'power2.out' }, start + 1.2);
          tl.to(
            counter,
            { n: SECURITY_SCORE, duration: 2.6, ease: 'power2.out', onUpdate: () => (scoreNum.textContent = String(Math.round(counter.n))) },
            start + 1.2,
          );
          qa('[data-cat-bar]').forEach((bar, b) => {
            tl.to(bar, { scaleX: securityCategoryScores[b] / 100, duration: 1.4, ease: 'power2.out' }, start + 1.6 + b * 0.18);
          });
          t = Math.max(t, start + 4);
        }

        if (ch.view === 'mediation') {
          tl.to(q('[data-stage-fill]'), { scaleX: 1, duration: 2, ease: 'power1.inOut' }, start + 1.2);
          tl.to(qa('[data-offer]'), { autoAlpha: 1, x: 0, duration: 0.8, stagger: 0.45, ease: 'power2.out' }, start + 1.8);
          t = Math.max(t, start + 1.8 + 0.45 * 5 + 0.8);
        }

        // --- camera: zoom into the subject, hold, release
        if (ch.focus) {
          tl.to(camera, { ...camTo(ch.focus), duration: 2.6 }, t - 0.6);
          tl.to(camera, { x: 0, y: 0, scale: 1, duration: 2 }, t + 3.6);
        } else {
          // Final chapter: pull back and present the whole product
          tl.fromTo(frame, { scale: 1 }, { scale: 1.035, duration: 3, ease: 'sine.inOut', immediateRender: false }, t - 1);
          tl.to({}, { duration: 2.5 }, t + 2);
        }
        prev = ch.view;
      });
      tl.to({}, { duration: 1 }); // breathing room before unpin

      const st = ScrollTrigger.create({
        trigger: stage,
        start: 'top top',
        end: () => `+=${Math.round(tl.duration() * UNIT * window.innerHeight)}`,
        pin: true,
        // will-change only while the stage is pinned and animating (fixing-motion-performance: layers).
        onToggle: (self) => gsap.set([frame, camera], { willChange: self.isActive ? 'transform' : 'auto' }),
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        animation: tl,
      });

      // Which chapter is on screen (used by the language switch to keep the visitor's place).
      registerCurrentAnchor(() => {
        if (window.scrollY > st.end) return null; // past the tour: generic lookup handles the CTA
        const label = tl.currentLabel();
        return label && label !== 'top' ? label : '';
      });

      registerTourNavigator((id) => {
        if (tl.labels[id] === undefined) return false;
        const y = st.labelToScroll(id);
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        window.scrollTo({ top: y, behavior: reduced ? 'auto' : 'smooth' });
        return true;
      });

      stage.classList.add('is-ready');

      // Pause looping CSS animations (spinner, live dot) while the stage is off-screen.
      const io = new IntersectionObserver(([entry]) => stage.classList.toggle('is-offscreen', !entry.isIntersecting));
      io.observe(stage);
      cleanups.push(() => io.disconnect());
      document.fonts?.ready.then(() => ScrollTrigger.refresh());

      // Deep links (#ssl-monitor) land on the right chapter once the pin is measured.
      const hash = decodeURIComponent(window.location.hash.slice(1));
      if (hash && tl.labels[hash] !== undefined) {
        requestAnimationFrame(() => window.scrollTo({ top: st.labelToScroll(hash), behavior: 'auto' }));
      }
    }, stage);

    return () => {
      ro.disconnect();
      cleanups.forEach((fn) => fn());
      registerTourNavigator(null);
      registerCurrentAnchor(null);
      ctx.revert();
      stage.classList.remove('is-ready');
    };
  }, []);

  return (
    <section ref={root} id="top" className="stage relative h-[100svh] overflow-hidden bg-white" aria-labelledby="hero-title">

      <div data-hero className="absolute inset-x-0 top-[calc(var(--hdr)+5svh)] z-10">
        <HeroCopy />
      </div>

      <div data-narrative className="stage-narrative z-10">
        <div className="mb-8 hidden gap-1.5 lg:flex" aria-hidden>
          {chapters.map((c) => (
            <span key={c.id} className="h-[3px] flex-1 overflow-hidden rounded-full bg-line">
              <span data-rail className="block h-full w-full rounded-full bg-blue" />
            </span>
          ))}
        </div>
        <div className="grid">
          {chapters.map((c, i) => (
            <article key={c.id} data-chapter={c.id} className="[grid-area:1/1]" aria-label={`${c.title} ${c.accent}`}>
              <ChapterText chapter={c} index={i} total={chapters.length} compact={false} />
            </article>
          ))}
        </div>
      </div>

      <div data-frame className="stage-frame z-0">
        <div className="absolute inset-0 overflow-hidden rounded-[14px] bg-white shadow-2xl ring-1 ring-ink/5 sm:rounded-[20px]" aria-hidden inert>
          <div ref={fit} className="absolute inset-0">
            <div className="stage-fit">
              <div data-camera>
                <Dashboard />
              </div>
            </div>
          </div>
        </div>
        <p className="absolute -bottom-7 left-0 right-0 hidden text-center text-[11.5px] text-subtle lg:block">{t.demoNoticeShort}</p>
      </div>

      <div data-hint className="pointer-events-none absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[12px] font-medium text-muted shadow-lg md:flex" aria-hidden>
        <MousePointer2 size={14} /> {t.stage.hint}
      </div>
    </section>
  );
}

