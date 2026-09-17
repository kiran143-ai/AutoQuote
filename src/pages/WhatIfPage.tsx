import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3Icon,
  ChevronLeftIcon,
  DownloadIcon,
  MapIcon,
  PlayIcon } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

const engineOptions = ['EPPVUL (Internal MVP)', 'BOLI (Gold Standard)', 'COLI (Gold Standard)'];
const xAxisOptions = ['M&E (bps) [30–250]', 'Pay Years [1–20]', 'Premium ($) [1M–20M]'];
const yAxisOptions = ['SA Return (%) [4–10]', 'FA Spread (bps) [40–120]', 'WACC (%) [5–12]'];
const outputOptions = ['MVP (%)', 'Break-Even (Mo)', 'Strain (%)'];

function SelectField({
  label,
  value,
  onChange,
  options
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}): JSX.Element {
  const id = `whatif-${label.replace(/[^a-z0-9]/gi, '-').toLowerCase()}`;
  return (
    <div className="flex flex-col">
      <label htmlFor={id} className="mb-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink transition-colors duration-150 ease-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20">

        {options.map((o) =>
        <option key={o} value={o}>
            {o}
          </option>
        )}
      </select>
    </div>);

}

export function WhatIfPage(): JSX.Element {
  const navigate = useNavigate();
  const [engine, setEngine] = useState(engineOptions[0]);
  const [xAxis, setXAxis] = useState(xAxisOptions[0]);
  const [yAxis, setYAxis] = useState(yAxisOptions[0]);
  const [output, setOutput] = useState(outputOptions[0]);
  const [mvpTarget, setMvpTarget] = useState('3.2');

  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="mb-3 -ml-3"
        icon={<ChevronLeftIcon className="h-4 w-4" strokeWidth={1.75} />}>
        Back to Quote Form
      </Button>

      <div className="space-y-5">
        <Card
          accent="primary"
          title={
          <span className="flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4 text-primary" strokeWidth={1.75} aria-hidden="true" />
              What-If Workbench
            </span>
          }
          meta="Explore multi-variable scenario grids with heatmap visualization and frontier analysis."
          action={
          <Button
            variant="outline"
            size="sm"
            icon={<DownloadIcon className="h-4 w-4" strokeWidth={1.75} />}>

              Export CSV
            </Button>
          } />


        <Card accent="primary">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <SelectField label="Engine" value={engine} onChange={setEngine} options={engineOptions} />
            <SelectField label="X-Axis Variable" value={xAxis} onChange={setXAxis} options={xAxisOptions} />
            <SelectField label="Y-Axis Variable" value={yAxis} onChange={setYAxis} options={yAxisOptions} />
            <SelectField label="Output Metric" value={output} onChange={setOutput} options={outputOptions} />
            <div className="flex flex-col">
              <label htmlFor="mvp-target" className="mb-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                MVP Target (%)
              </label>
              <input
                id="mvp-target"
                inputMode="decimal"
                value={mvpTarget}
                onChange={(e) => setMvpTarget(e.target.value)}
                className="h-9 rounded-md border border-line bg-white px-2.5 text-sm text-ink tnum transition-colors duration-150 ease-out focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />

            </div>
          </div>

          <Button
            variant="primary"
            className="mt-4"
            icon={<PlayIcon className="h-4 w-4" strokeWidth={1.75} />}>

            Generate Grid
          </Button>
        </Card>

        <Card accent="primary">
          <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-dashed border-line bg-canvas px-6 py-16 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-tint">
              <MapIcon className="h-5 w-5 text-primary" strokeWidth={1.75} aria-hidden="true" />
            </div>
            <h3 className="text-[15px] font-semibold text-ink">Select Variables &amp; Generate</h3>
            <p className="max-w-xl text-[13px] text-muted">
              Choose two variables to vary (X and Y axes), select your output metric, then click{' '}
              <span className="font-semibold text-ink">▸ Generate Grid</span> to compute all
              combinations. The heatmap shows how the output changes across the variable space.
              Click cells to pin scenarios for side-by-side comparison.
            </p>
          </div>
        </Card>
      </div>
    </div>);

}
