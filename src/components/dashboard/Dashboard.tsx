import { Bell, Command, Search, Settings, StickyNote, Users, ChevronDown, FlaskConical } from 'lucide-react';
import type { ViewId } from '../../data/chapters';
import { navItems } from './nav';
import { useT } from '../../i18n/context';
import { OverviewView } from './views/OverviewView';
import { DomainView } from './views/DomainView';
import { SslView } from './views/SslView';
import { WebsiteView } from './views/WebsiteView';
import { SecurityView } from './views/SecurityView';
import { MediationView } from './views/MediationView';

/** Native design size. The dashboard is always laid out at this size and scaled to fit its frame. */
export const DASH_W = 1280;
export const DASH_H = 800;

const views: Record<ViewId, () => React.JSX.Element> = {
  overview: OverviewView,
  domain: DomainView,
  ssl: SslView,
  website: WebsiteView,
  security: SecurityView,
  mediation: MediationView,
};

/**
 * The product dashboard. In the scroll experience all views are rendered stacked and GSAP switches
 * between them; with `only` set, a single fully revealed view is rendered (reduced motion / static).
 */
export function Dashboard({ only }: { only?: ViewId }) {
  const t = useT().dash;
  const active = only ?? 'overview';
  // Sidebar always lists every module; the content area only renders what is needed.
  const list = only ? navItems.filter((n) => n.view === only) : navItems;

  return (
    <div className="dash relative flex overflow-hidden rounded-[18px] bg-canvas" style={{ width: DASH_W, height: DASH_H }} data-dash>
      {/* Sidebar */}
      <aside className="flex w-[228px] shrink-0 flex-col border-r border-line bg-white/70 px-3 py-4">
        <div className="flex items-center gap-2.5 px-2 pb-5">
          <img src="/icon-192.png" alt="" width={28} height={28} className="size-7 rounded-[8px]" />
          <div className="leading-tight">
            <p className="text-[13.5px] font-semibold tracking-[-0.02em]">Support Toolkit</p>
            <p className="text-[11px] text-subtle">{t.workspaceName}</p>
          </div>
        </div>
        <p className="px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-subtle">{t.workspace}</p>
        <nav className="relative flex flex-col">
          <span
            data-nav-indicator
            className="absolute left-0 top-0 h-[34px] w-full rounded-[9px] border border-line bg-white shadow-[var(--shadow-card)]"
            style={{ transform: `translateY(${navItems.findIndex((n) => n.view === active) * 36}px)` }}
          />
          {navItems.map(({ view, icon: Icon }) => (
            <span
              key={view}
              data-nav-item={view}
              className={`relative flex h-[34px] items-center gap-2.5 rounded-[9px] px-2.5 text-[12.5px] font-medium ${view === active ? 'text-ink' : 'text-muted'}`}
              style={{ marginBottom: 2 }}
            >
              <Icon size={15} strokeWidth={2} aria-hidden className={view === active ? 'text-blue' : ''} data-nav-icon />
              {t.nav[view].label}
            </span>
          ))}
        </nav>
        <p className="mt-6 px-2.5 pb-1.5 text-[10.5px] font-semibold uppercase tracking-[0.08em] text-subtle">{t.tools}</p>
        {[Users, StickyNote, Settings].map((Icon, i) => ({ Icon, label: t.toolItems[i] })).map(({ Icon, label }) => (
          <span key={label} className="flex h-[32px] items-center gap-2.5 px-2.5 text-[12.5px] font-medium text-muted">
            <Icon size={15} strokeWidth={2} aria-hidden />
            {label}
          </span>
        ))}
        <div className="mt-auto rounded-[12px] border border-line bg-gradient-to-br from-blue-50 to-cyan-50 p-3">
          <p className="flex items-center gap-1.5 text-[11.5px] font-semibold text-blue">
            <FlaskConical size={13} aria-hidden /> {t.demoModeTitle}
          </p>
          <p className="mt-1 text-[11px] leading-snug text-muted">{t.demoModeText}</p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-14 shrink-0 items-center gap-4 border-b border-line bg-white/80 px-6">
          <div className="relative h-5 w-[170px] overflow-hidden text-[12.5px]">
            {list.map((n) => (
              <span key={n.view} data-crumb={n.view} className="absolute inset-0 flex items-center gap-1.5 whitespace-nowrap" style={{ opacity: n.view === active ? 1 : 0 }}>
                <span className="text-subtle">{t.workspace}</span>
                <span className="text-line">/</span>
                <span className="font-medium">{t.nav[n.view].crumb}</span>
              </span>
            ))}
          </div>
          <div className="mx-auto flex h-9 w-[380px] items-center gap-2 rounded-[10px] border border-line bg-canvas px-3 text-subtle">
            <Search size={14} aria-hidden />
            <span className="text-[12.5px]">{t.search}</span>
            <span className="ml-auto flex items-center gap-0.5 rounded-[6px] border border-line bg-white px-1.5 py-0.5 text-[10.5px] font-medium">
              <Command size={10} aria-hidden />K
            </span>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-warn/25 bg-warn-50 px-2.5 py-1 text-[11px] font-semibold text-warn">
            <FlaskConical size={12} aria-hidden /> {t.demoData}
          </span>
          <span className="relative grid size-9 place-items-center rounded-[10px] border border-line bg-white text-muted">
            <Bell size={15} aria-hidden />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-bad" />
          </span>
          <span className="flex items-center gap-2">
            <span className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-blue to-cyan text-[11px] font-semibold text-white">ST</span>
            <ChevronDown size={14} className="text-subtle" aria-hidden />
          </span>
        </header>

        <div className="relative flex-1">
          {list.map(({ view }) => {
            const View = views[view];
            return (
              <div key={view} data-view={view} className="absolute inset-0 p-6" style={{ opacity: view === active ? 1 : 0, visibility: view === active ? 'visible' : 'hidden' }}>
                <View />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
