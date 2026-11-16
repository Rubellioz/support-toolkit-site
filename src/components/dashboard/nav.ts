import { LayoutDashboard, Globe, ShieldCheck, ScanSearch, ShieldAlert, Handshake, type LucideIcon } from 'lucide-react';
import type { ViewId } from '../../data/chapters';

/** Sidebar order and icons. Labels come from messages (dash.nav). */
export const navItems: { view: ViewId; icon: LucideIcon }[] = [
  { view: 'overview', icon: LayoutDashboard },
  { view: 'domain', icon: Globe },
  { view: 'ssl', icon: ShieldCheck },
  { view: 'website', icon: ScanSearch },
  { view: 'security', icon: ShieldAlert },
  { view: 'mediation', icon: Handshake },
];
