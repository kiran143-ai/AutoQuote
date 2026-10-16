import {
  BookOpenIcon,
  BrainIcon,
  FileTextIcon,
  FlaskConicalIcon,
  GitCompareIcon,
  ClipboardCheckIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  PaletteIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  ZapIcon } from
'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { Role } from '../utils/permissions';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
  adminOnly?: boolean;
  hiddenForRoles?: Role[];
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const navGroups: NavGroup[] = [
{
  label: 'Main',
  items: [
  { label: 'Dashboard', to: '/', icon: LayoutDashboardIcon },
  { label: 'Quotes', to: '/quotes', icon: FileTextIcon },
  { label: 'Approvals', to: '/approvals', icon: ClipboardCheckIcon, hiddenForRoles: ['ACTUARY'] },
  { label: 'Analytics', to: '/analytics', icon: LineChartIcon },
  { label: 'Case Compare', to: '/case-compare', icon: GitCompareIcon },
  { label: 'BRD References', to: '/brd-references', icon: BookOpenIcon },
  {
    label: 'Sheet Configuration',
    to: '/sheet-configuration',
    icon: SlidersHorizontalIcon
  },
  { label: 'AI Insights', to: '/ai-insights', icon: BrainIcon }]

},
{
  label: 'Administration',
  items: [
  {
    label: 'Actuarial Admin',
    to: '/actuarial-admin',
    icon: FlaskConicalIcon,
    adminOnly: true
  },
  { label: 'Engine Health', to: '/engine-health', icon: ZapIcon, adminOnly: true }]

},
{
  label: 'Help',
  items: [
  { label: 'User Guide', to: '/user-guide', icon: BookOpenIcon },
  {
    label: 'Restart Welcome Tour',
    to: '/welcome-tour',
    icon: RotateCcwIcon
  },
  { label: 'Design System', to: '/design-system', icon: PaletteIcon }]

}];