import {
  BookOpenIcon,
  BrainIcon,
  FileTextIcon,
  FlaskConicalIcon,
  GitCompareIcon,
  LayoutDashboardIcon,
  LineChartIcon,
  RotateCcwIcon,
  SlidersHorizontalIcon,
  ZapIcon } from
'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  to: string;
  icon: LucideIcon;
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
    icon: FlaskConicalIcon
  },
  { label: 'Engine Health', to: '/engine-health', icon: ZapIcon }]

},
{
  label: 'Help',
  items: [
  { label: 'User Guide', to: '/user-guide', icon: BookOpenIcon },
  {
    label: 'Restart Welcome Tour',
    to: '/welcome-tour',
    icon: RotateCcwIcon
  }]

}];