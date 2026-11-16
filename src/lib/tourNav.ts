/**
 * Tiny registry so the header can jump to a chapter regardless of which tour variant is mounted.
 * The pinned GSAP tour registers a navigator that scrolls to the chapter's timeline label;
 * the static (reduced-motion) tour falls back to the element with the chapter id.
 */
type Navigator = (id: string) => boolean;
/** Returns the anchor on screen: a chapter id, '' for "top of page", or null for "ask the DOM". */
type CurrentAnchor = () => string | null;

let navigator: Navigator | null = null;
let currentAnchor: CurrentAnchor | null = null;

export function registerTourNavigator(fn: Navigator | null) {
  navigator = fn;
}

export function registerCurrentAnchor(fn: CurrentAnchor | null) {
  currentAnchor = fn;
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

/** Anchor of the section currently on screen ('' = top), so another language version can open at the same place. */
export function getCurrentAnchor(): string {
  const fromTour = currentAnchor?.();
  if (fromTour != null) return fromTour;
  let found = '';
  for (const el of document.querySelectorAll<HTMLElement>('main section[id]')) {
    if (el.id !== 'top' && el.getBoundingClientRect().top <= window.innerHeight * 0.4) found = el.id;
  }
  return found;
}
