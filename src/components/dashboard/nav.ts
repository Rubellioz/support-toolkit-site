import { LayoutDashboard, Globe, ShieldCheck, ScanSearch, ShieldAlert, Handshake, type LucideIcon } from 'lucide-react';
import type { ViewId } from '../../data/chapters';

export const navItems: { view: ViewId; label: string; icon: LucideIcon; crumb: string }[] = [
  { view: 'overview', label: 'Overview', icon: LayoutDashboard, crumb: 'Overview' },
  { view: 'domain', label: 'Domain Intelligence', icon: Globe, crumb: 'Domain & DNS' },
  { view: 'ssl', label: 'SSL Monitor', icon: ShieldCheck, crumb: 'Certificates' },
  { view: 'website', label: 'Website Intelligence', icon: ScanSearch, crumb: 'Websites' },
  { view: 'security', label: 'Security Audit', icon: ShieldAlert, crumb: 'Security' },
  { view: 'mediation', label: 'Domain Mediation', icon: Handshake, crumb: 'Domains' },
];
