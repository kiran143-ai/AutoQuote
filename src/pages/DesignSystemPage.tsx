import React from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/layout/PageHeader';
import { ZapIcon } from 'lucide-react';

interface Swatch {
  name: string;
  hex: string;
  className: string;
  note?: string;
}

const coreColors: Swatch[] = [
{ name: 'Primary', hex: '#1D4ED8', className: 'bg-primary' },
{ name: 'Primary Hover', hex: '#1A44BC', className: 'bg-primary-hover' },
{ name: 'Primary Tint', hex: '#EFF6FF', className: 'bg-primary-tint border border-line' },
{ name: 'Ink (text)', hex: '#111827', className: 'bg-ink' },
{ name: 'Muted (text)', hex: '#6B7280', className: 'bg-muted' },
{ name: 'Canvas (page bg)', hex: '#F1F3F5', className: 'bg-canvas border border-line' },
{ name: 'Line (borders)', hex: '#E5E7EB', className: 'bg-line' }];


const statusColors: Swatch[] = [
{ name: 'Success', hex: '#16A34A', className: 'bg-success' },
{ name: 'Success Tint', hex: '#ECFDF3', className: 'bg-success-tint border border-line' },
{ name: 'Warning', hex: '#F59E0B', className: 'bg-warning' },
{ name: 'Warning Tint', hex: '#FFFBEB', className: 'bg-warning-tint border border-line' },
{ name: 'Danger', hex: '#DC2626', className: 'bg-danger' },
{ name: 'Danger Tint', hex: '#FEF2F2', className: 'bg-danger-tint border border-line' }];


const navColors: Swatch[] = [
{ name: 'Nav Background', hex: '#1F2937', className: '' },
{ name: 'Nav Hover', hex: '#374151', className: '' },
{ name: 'Nav Text', hex: '#9CA3AF', className: '' }];


function SwatchGrid({ swatches }: {swatches: Swatch[];}): JSX.Element {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {swatches.map((s) =>
      <div key={s.name} className="flex items-center gap-3">
          <div
          className={`h-10 w-10 shrink-0 rounded-md ${s.className}`}
          style={s.className ? undefined : { backgroundColor: s.hex }} />

          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-ink">{s.name}</p>
            <p className="text-micro text-muted tnum">{s.hex}</p>
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
  return (
    <div className="mx-auto max-w-[1200px] p-6">
      <PageHeader
        title="Design System"
        subtitle="Reference for colors, typography, components, and layout used across AutoQuote. Purely informational — does not affect other pages." />


      <div className="space-y-5">
        <Card accent="primary" title="Core Colors" meta="Primary brand, text, and surface tokens">
          <SwatchGrid swatches={coreColors} />
        </Card>

        <Card accent="primary" title="Status Colors" meta="Success, warning, and danger states">
          <SwatchGrid swatches={statusColors} />
        </Card>

        <Card accent="primary" title="Left Navigation" meta="Hardcoded in SideNav.tsx, not the Tailwind theme">
          <SwatchGrid swatches={navColors} />
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
