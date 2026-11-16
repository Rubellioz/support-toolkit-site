import { useLayoutEffect, useEffect, type RefObject } from 'react';

const useIsoLayoutEffect = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** Scales a fixed-size child (via the `--fit` CSS variable on `ref`) to the width of `ref`. */
export function useFitScale(ref: RefObject<HTMLElement | null>, nativeWidth: number) {
  useIsoLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const apply = () => el.style.setProperty('--fit', String(el.clientWidth / nativeWidth));
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref, nativeWidth]);
}

export { useIsoLayoutEffect };
