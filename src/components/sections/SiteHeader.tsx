import { useEffect, useId, useRef, useState } from 'react';
import { ArrowUpRight, Menu, X } from 'lucide-react';
import { site } from '../../config/site';
import { chapters } from '../../data/chapters';
import { goToChapter } from '../../lib/tourNav';

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const panelId = useId();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        button.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    goToChapter(id);
  };

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,backdrop-filter] duration-300 ${
        scrolled || open ? 'bg-white/80 shadow-[0_1px_0_var(--color-line)] backdrop-blur-xl backdrop-saturate-150' : ''
      }`}
    >
      <a href="#main" className="sr-only-focusable btn btn-secondary absolute left-4 top-3 z-10">
        Skip to content
      </a>
      <div className="mx-auto flex h-[60px] max-w-[1400px] items-center gap-6 px-4 sm:px-8">
        <a href="#top" onClick={(e) => { e.preventDefault(); setOpen(false); window.scrollTo({ top: 0, behavior: 'smooth' }); history.replaceState(null, '', location.pathname); }} className="flex items-center gap-2.5 rounded-lg" aria-label="Support Toolkit, back to top">
          <img src="/icon-192.png" alt="" width={28} height={28} className="size-7 rounded-[8px]" />
          <span className="text-[15px] font-semibold tracking-[-0.02em]">Support Toolkit</span>
        </a>

        <nav aria-label="Product tour" className="ml-auto hidden md:block">
          <ul className="flex items-center gap-1">
            {chapters.map((c) => (
              <li key={c.id}>
                <a href={`#${c.id}`} onClick={go(c.id)} className="rounded-full px-3 py-2 text-[13.5px] font-medium text-muted transition-colors hover:bg-canvas hover:text-ink">
                  {c.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {site.appUrl && (
          <a href={site.appUrl} rel="noopener" className="btn btn-primary ml-auto hidden !h-9 !px-4 !text-[13.5px] sm:inline-flex md:ml-0">
            Sign in <ArrowUpRight size={15} aria-hidden />
          </a>
        )}

        <button
          ref={button}
          type="button"
          className="ml-auto grid size-10 place-items-center rounded-full text-ink hover:bg-canvas sm:ml-0 md:hidden"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={20} aria-hidden /> : <Menu size={20} aria-hidden />}
          <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div id={panelId} hidden={!open} className="border-t border-line bg-white px-4 pb-5 pt-2 md:hidden">
        <nav aria-label="Product tour (mobile)">
          <ul className="flex flex-col">
            {chapters.map((c, i) => (
              <li key={c.id}>
                <a href={`#${c.id}`} onClick={go(c.id)} className="flex items-center gap-3 border-b border-line-2 py-3.5 text-[15px] font-medium">
                  <span className="font-mono text-[12px] text-subtle">{String(i + 1).padStart(2, '0')}</span>
                  {c.nav === 'Toolkit' ? 'Complete toolkit' : c.nav}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {site.appUrl && (
          <a href={site.appUrl} rel="noopener" className="btn btn-primary mt-4 w-full justify-center">
            Sign in to Support Toolkit <ArrowUpRight size={16} aria-hidden />
          </a>
        )}
      </div>
    </header>
  );
}
