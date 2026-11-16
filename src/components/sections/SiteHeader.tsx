import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { site } from '../../config/site';
import { getChapters } from '../../data/chapters';
import { useLang, useT } from '../../i18n/context';
import { cn } from '../../lib/cn';
import { goToChapter } from '../../lib/tourNav';
import { LanguageSwitch } from './LanguageSwitch';

/**
 * Fixed site header.
 * - "Scrolled" state comes from an IntersectionObserver on a sentinel, not a scroll listener.
 * - The mobile menu is a native HTML popover: the browser provides Escape, light dismiss,
 *   aria-expanded on the trigger and focus return, so no keyboard behaviour is rebuilt by hand.
 * - Padding respects the device safe area (viewport-fit=cover).
 */
export function SiteHeader() {
  const lang = useLang();
  const t = useT().header;
  const chapters = getChapters(lang);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();
  const panel = useRef<HTMLDivElement>(null);
  const sentinel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = sentinel.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setScrolled(!entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    panel.current?.hidePopover?.();
    goToChapter(id);
  };

  return (
    <>
      <div ref={sentinel} aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-2" />
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 pt-[env(safe-area-inset-top)] transition-[background-color,box-shadow] duration-200 ease-out',
          (scrolled || open) && 'bg-white/90 shadow-xs backdrop-blur-md',
        )}
      >
        <a href="#main" className="sr-only-focusable btn btn-secondary absolute left-4 top-3 z-10">
          {t.skip}
        </a>
        <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-6 pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))] sm:px-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              panel.current?.hidePopover?.();
              window.scrollTo({ top: 0, behavior: 'smooth' });
              history.replaceState(null, '', location.pathname);
            }}
            className="flex items-center gap-2.5 rounded-lg"
            aria-label={t.home}
          >
            <img src="/icon-192.png" alt="" width={28} height={28} className="size-7 rounded-lg" />
            <span className="text-[15px] font-semibold">Support Toolkit</span>
          </a>

          <nav aria-label={t.tourNav} className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {chapters.map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} onClick={go(c.id)} className="rounded-full px-3 py-2 text-[13.5px] font-medium text-muted transition-colors duration-150 hover:bg-canvas hover:text-ink">
                    {c.nav}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <LanguageSwitch className="ml-auto lg:ml-0" />

          {site.appUrl && (
            <a href={site.appUrl} rel="noopener" className="btn btn-primary hidden !h-9 !px-4 !text-[13.5px] sm:inline-flex">
              {t.signIn} <ArrowUpRight size={15} aria-hidden />
            </a>
          )}

          <button
            type="button"
            popoverTarget={panelId}
            aria-label={open ? t.closeMenu : t.openMenu}
            className="grid size-10 place-items-center rounded-full text-ink hover:bg-canvas lg:hidden"
          >
            {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          </button>
        </div>
      </header>

      <div
        ref={panel}
        id={panelId}
        popover="auto"
        onToggle={(e) => setOpen((e.nativeEvent as ToggleEvent).newState === 'open')}
        className="fixed inset-x-0 bottom-auto top-[calc(60px+env(safe-area-inset-top))] m-0 w-full max-w-none border-0 border-t border-line bg-white px-4 pb-5 pt-2 shadow-lg lg:hidden"
      >
        <nav aria-label={t.tourNavMobile}>
          <ul className="flex flex-col">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} onClick={go(c.id)} className="flex items-center gap-3 border-b border-line-2 py-3.5 text-[15px] font-medium">
                  <span className="font-mono text-[12px] text-subtle">{String(i + 1).padStart(2, '0')}</span>
                  {c.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {site.appUrl && (
          <a href={site.appUrl} rel="noopener" className="btn btn-primary mt-4 w-full justify-center">
            {t.signInFull} <ArrowUpRight size={16} aria-hidden />
          </a>
        )}
      </div>
    </>
  );
}
