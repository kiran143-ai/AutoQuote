import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { ZapIcon, PaletteIcon } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { themeColors } from '../utils/theme';

interface Swatch {
  name: string;
  hex: string;
  usage: string;
  className: string;
}

function getBrandColors(theme: 'current' | 'client'): Swatch[] {
  const c = themeColors[theme];
  return [
  { name: 'Primary', hex: c.primary, usage: 'Buttons, links, active states, focus rings', className: 'bg-primary' },
  { name: 'Primary Hover', hex: c.primaryHover, usage: 'Hover state for primary buttons', className: 'bg-primary-hover' },
  { name: 'Primary Tint', hex: c.primaryTint, usage: 'Light backgrounds — selected rows, outline/ghost hover', className: 'bg-primary-tint border border-line' }];

}

function getNavColors(theme: 'current' | 'client'): Swatch[] {
  const c = themeColors[theme];
  return [
  { name: 'Nav Background', hex: c.nav, usage: 'Left sidebar background', className: 'bg-nav' },
  { name: 'Nav Hover', hex: c.navHover, usage: 'Sidebar item hover background', className: 'bg-nav-hover' },
  { name: 'Nav Text', hex: c.navText, usage: 'Sidebar item & section label text', className: 'bg-nav-text' },
  { name: 'Nav Active Background', hex: c.navActiveBg, usage: 'Highlight behind the active sidebar item', className: 'bg-navActive' },
  { name: 'Nav Active Text', hex: c.navActiveText, usage: 'Text on the active sidebar item', className: 'bg-navActive-text' }];

}

const coreColors: Swatch[] = [
{ name: 'Ink', hex: '#111827', usage: 'Primary body & heading text', className: 'bg-ink' },
{ name: 'Muted', hex: '#6B7280', usage: 'Secondary / helper text', className: 'bg-muted' },
{ name: 'Canvas', hex: '#F1F3F5', usage: 'Main page background', className: 'bg-canvas border border-line' },
{ name: 'Line', hex: '#E5E7EB', usage: 'Borders and dividers', className: 'bg-line' }];


const statusColors: Swatch[] = [
{ name: 'Success', hex: '#16A34A', usage: 'Positive states, confirmations', className: 'bg-success' },
{ name: 'Success Tint', hex: '#ECFDF3', usage: 'Success banner background', className: 'bg-success-tint border border-line' },
{ name: 'Warning', hex: '#F59E0B', usage: 'Caution, needs-attention states', className: 'bg-warning' },
{ name: 'Warning Tint', hex: '#FFFBEB', usage: 'Warning banner background', className: 'bg-warning-tint border border-line' },
{ name: 'Danger', hex: '#DC2626', usage: 'Errors, destructive actions', className: 'bg-danger' },
{ name: 'Danger Tint', hex: '#FEF2F2', usage: 'Error banner background', className: 'bg-danger-tint border border-line' }];


function SwatchGrid({ swatches }: {swatches: Swatch[];}): JSX.Element {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {swatches.map((s) =>
      <div key={s.name} className="flex items-start gap-3">
          <div className={`h-10 w-10 shrink-0 rounded-md ${s.className}`} />
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{s.name}</p>
            <p className="text-micro text-muted tnum">{s.hex}</p>
            <p className="mt-0.5 text-micro text-muted">{s.usage}</p>
          </div>
        </div>
      )}
    </div>);

}

function TypeRow({
  sizeLabel,
  sampleClassName,
  weight = 'font-normal'



}: {sizeLabel: string;sampleClassName: string;weight?: string;}): JSX.Element {
  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-line py-3 last:border-0">
      <p className={`${sampleClassName} ${weight} text-ink`}>
        The quick brown fox jumps over
      </p>
      <span className="shrink-0 text-micro text-muted tnum">{sizeLabel}</span>
    </div>);

}

export function DesignSystemPage(): JSX.Element {
  const { theme } = useTheme();
  const themeLabel = theme === 'current' ? 'Current' : 'Client';

  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <PageHeader
        title="Design System"
        subtitle="Reference for colors, typography, components, and layout used across AutoQuote. Purely informational — does not affect other pages." />


      <div className="mb-5 flex items-center gap-2.5 rounded-md border border-primary/30 bg-primary-tint px-3.5 py-2.5 text-[13px] text-primary">
        <PaletteIcon className="h-4 w-4 shrink-0" strokeWidth={1.75} aria-hidden="true" />
        Showing the <span className="font-semibold">{themeLabel}</span> theme palette — use the palette icon in the top bar to switch and see these swatches update live.
      </div>

      <div className="space-y-5">
        <Card
          accent="primary"
          title={`Brand Colors — ${themeLabel} theme`}
          meta="Switches with the top-bar theme toggle">

          <SwatchGrid swatches={getBrandColors(theme)} />
        </Card>

        <Card
          accent="primary"
          title={`Navigation Colors — ${themeLabel} theme`}
          meta="Left sidebar tokens, switches with the theme toggle">

          <SwatchGrid swatches={getNavColors(theme)} />
        </Card>

        <Card accent="primary" title="Core Colors" meta="Text and surface tokens — same across both themes">
          <SwatchGrid swatches={coreColors} />
        </Card>

        <Card accent="primary" title="Status Colors" meta="Success, warning, and danger states — same across both themes">
          <SwatchGrid swatches={statusColors} />
        </Card>

        <Card accent="primary" title="Typography" meta="Inter, with system-ui fallback">
          <TypeRow sizeLabel="22px · bold — Page title" sampleClassName="text-[22px]" weight="font-bold" />
          <TypeRow sizeLabel="15px · semibold — Card title" sampleClassName="text-[15px]" weight="font-semibold" />
          <TypeRow sizeLabel="14px · regular — Body" sampleClassName="text-sm" />
          <TypeRow sizeLabel="13px · medium — Buttons / secondary text" sampleClassName="text-[13px]" weight="font-medium" />
          <TypeRow sizeLabel="12px · regular — Labels / meta" sampleClassName="text-xs" />
          <TypeRow sizeLabel="11px · semibold uppercase — Micro tags" sampleClassName="text-micro uppercase tracking-[0.06em]" weight="font-semibold" />
          <TypeRow sizeLabel="34px · bold — KPI numbers" sampleClassName="text-[34px] tnum" weight="font-bold" />
        </Card>

        <Card accent="primary" title="Buttons" meta="Variants × sizes">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" icon={<ZapIcon className="h-4 w-4" strokeWidth={1.75} />}>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
              <Button variant="primary" disabled>Disabled</Button>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button variant="primary" size="sm">Primary sm</Button>
              <Button variant="secondary" size="sm">Secondary sm</Button>
              <Button variant="outline" size="sm">Outline sm</Button>
              <Button variant="ghost" size="sm">Ghost sm</Button>
              <Button variant="danger" size="sm">Danger sm</Button>
            </div>
          </div>
        </Card>

        <Card accent="primary" title="Cards" meta="Rounded 10px · 1px line border · soft shadow · optional 2px top accent">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card title="No accent">
              <p className="text-[13px] text-muted">Default card style</p>
            </Card>
            <Card accent="primary" title="Primary accent">
              <p className="text-[13px] text-muted">Blue top border</p>
            </Card>
            <Card accent="warning" title="Warning accent">
              <p className="text-[13px] text-muted">Amber top border</p>
            </Card>
            <Card accent="danger" title="Danger accent">
              <p className="text-[13px] text-muted">Red top border</p>
            </Card>
          </div>
        </Card>

        <Card accent="primary" title="Layout" meta="Page background vs. surface">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="rounded-md bg-canvas p-5">
              <p className="text-[13px] font-medium text-ink">Canvas — #F1F3F5</p>
              <p className="mt-1 text-micro text-muted">Main page background</p>
            </div>
            <div className="rounded-card border border-line bg-white p-5 shadow-card">
              <p className="text-[13px] font-medium text-ink">Card surface — white</p>
              <p className="mt-1 text-micro text-muted">shadow-card · rounded-card (10px) · border-line</p>
            </div>
          </div>
        </Card>
      </div>
    </div>);

}
