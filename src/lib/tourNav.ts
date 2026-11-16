/**
 * Tiny registry so the header can jump to a chapter regardless of which tour variant is mounted.
 * The pinned GSAP tour registers a navigator that scrolls to the chapter's timeline label;
 * the static (reduced-motion) tour falls back to the element with the chapter id.
 */
type Navigator = (id: string) => boolean;
let navigator: Navigator | null = null;

export function registerTourNavigator(fn: Navigator | null) {
  navigator = fn;
}

export function goToChapter(id: string) {
  const smooth = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (navigator?.(id)) {
    history.replaceState(null, '', `#${id}`);
    return;
  }
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
    history.replaceState(null, '', `#${id}`);
  }
}
