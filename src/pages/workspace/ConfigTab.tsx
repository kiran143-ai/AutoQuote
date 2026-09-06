import React, { useState } from 'react';
import { AlertTriangleIcon, CheckIcon, InfoIcon, XIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';
import {
  configSections,
  configValidation,
  corridorBands } from
'../../data/configSections';

export function ConfigTab(): JSX.Element {
  const quote = useWorkspaceCase();
  const [selected, setSelected] = useState('corridor');
  const [bands, setBands] = useState(corridorBands);
  const [probeAge, setProbeAge] = useState('49');

  const section = configSections.find((s) => s.id === selected);
  const probe = Number(probeAge) || 0;
  const matched = [...bands].reverse().find((b) => b.age <= probe) ?? bands[0];
  const maxFactor = Math.max(...bands.map((b) => b.factor));

  return (
    <div className="space-y-5">
      <Card
        accent="primary"
        title="Configuration"
        meta="Snapshot from 2026-09-05.">
        
        <p className="flex items-center gap-2 text-[13px] text-[#92400E]">
          <AlertTriangleIcon
            className="h-4 w-4 shrink-0 text-warning"
            strokeWidth={1.75}
            aria-hidden="true" />
          
          Config modified. Re-run to reflect.
        </p>
        <div className="mt-3 flex items-start gap-2 rounded-md border border-info/40 bg-info-tint px-3.5 py-2.5">
          <InfoIcon
            className="mt-0.5 h-4 w-4 shrink-0 text-info"
            strokeWidth={1.75}
            aria-hidden="true" />
          
          <div>
            <p className="text-[13px] font-medium text-ink">
              Editing case snapshot: {quote.name}. Changes affect this case only
              and invalidate its priced run.
            </p>
            <p className="mt-0.5 text-micro text-muted">
              {quote.name} · {quote.status.toLowerCase()}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        <Card title="Sections" meta={`${configSections.length}`} padded={false}>
          <div className="max-h-[560px] overflow-y-auto px-2 pb-3 thin-scroll">
            <ul>
              {configSections.map((s) => {
                const active = s.id === selected;
                return (
                  <li key={s.id}>
                    <button
                      type="button"
                      onClick={() => setSelected(s.id)}
                      aria-current={active ? 'true' : undefined}
                      className={`flex w-full items-center justify-between gap-2 rounded-md px-3 py-2 text-left text-[13px] transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                      active ?
                      'bg-primary-tint font-semibold text-primary' :
                      'text-ink hover:bg-canvas'}`
                      }>
                      
                      <span className="truncate">{s.name}</span>
                      <span
                        className={`shrink-0 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        s.tag === 'EDITED' ?
                        'bg-warning-tint text-[#92400E]' :
                        'bg-canvas text-muted'}`
                        }>
                        
                        {s.tag}
                      </span>
                    </button>
                  </li>);

              })}
            </ul>
            <p className="px-3 pt-3 text-micro text-danger">
              Not editable here
            </p>
          </div>
        </Card>

        <div className="space-y-5">
          <Card
            accent="primary"
            title={section?.name ?? 'Section'}
            meta="Multiplier of AV (e.g. 2.50 = 250%)"
            padded={false}
            action={
            <>
                <Button size="sm" variant="secondary">
                  Reset section to gold
                </Button>
                <Button size="sm" variant="secondary">
                  Show all
                </Button>
              </>
            }>
            
            <div className="mt-4 max-h-[340px] overflow-y-auto border-t border-line thin-scroll">
              <table className="w-full text-[13px]">
                <thead className="sticky top-0 bg-canvas">
                  <tr className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                    <th scope="col" className="px-5 py-2.5 text-left">
                      Age
                    </th>
                    <th scope="col" className="px-5 py-2.5 text-left">
                      Factor
                      <span className="ml-1 font-normal normal-case">
                        multiplier of AV
                      </span>
                    </th>
                    <th scope="col" className="px-5 py-2.5 text-right">
                      NAAR %
                    </th>
                    <th scope="col" className="w-12 px-5 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {bands.map((band, i) =>
                  <tr
                    key={band.age}
                    className="border-b border-line last:border-0">
                    
                      <td className="px-5 py-2 font-medium text-ink tnum">
                        {band.age}
                      </td>
                      <td className="px-5 py-2">
                        <label className="sr-only" htmlFor={`factor-${band.age}`}>
                          Factor for age {band.age}
                        </label>
                        <input
                        id={`factor-${band.age}`}
                        value={band.factor}
                        onChange={(e) =>
                        setBands((prev) =>
                        prev.map((b, idx) =>
                        idx === i ?
                        { ...b, factor: Number(e.target.value) || 0 } :
                        b
                        )
                        )
                        }
                        className="h-8 w-32 rounded-md border border-line bg-white px-2 text-[13px] font-medium text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
                      
                      </td>
                      <td className="px-5 py-2 text-right text-muted tnum">
                        {band.naar}%
                      </td>
                      <td className="px-5 py-2 text-right">
                        <button
                        type="button"
                        aria-label={`Remove band ${band.age}`}
                        onClick={() =>
                        setBands((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="text-danger transition-colors duration-150 ease-out hover:text-[#B91C1C] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                        
                          <XIcon className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="px-5 py-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={() =>
                setBands((prev) => [
                ...prev,
                {
                  age: (prev[prev.length - 1]?.age ?? 40) + 5,
                  factor: 1,
                  naar: 0
                }]
                )
                }>
                
                Add band
              </Button>
            </div>
          </Card>

          <Card
            accent="primary"
            title="What the engine reads"
            meta="male, age 62–75">
            
            <p className="text-[13px] text-muted">
              Lookups floor-match. A table of {bands.length} bands answers every
              integer age from 18 to 100, and the step down at 65 is visible
              here and is what the range check below flags.
            </p>

            <div
              className="mt-4 flex h-32 items-end gap-1 rounded-md border border-line bg-[#F8FAFC] px-3 pb-2 pt-3"
              role="img"
              aria-label="Corridor factor lookup by age">
              
              {bands.map((band) =>
              <div
                key={band.age}
                className="flex flex-1 flex-col items-center justify-end gap-1">
                
                  <div
                  className={`w-full rounded-sm ${
                  band.age === matched.age ? 'bg-primary' : 'bg-primary/25'}`
                  }
                  style={{
                    height: `${band.factor / maxFactor * 100}%`
                  }} />
                
                  <span className="text-[9px] text-muted tnum">{band.age}</span>
                </div>
              )}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <label htmlFor="probe-age" className="text-xs text-muted">
                Probe age:
              </label>
              <input
                id="probe-age"
                value={probeAge}
                onChange={(e) => setProbeAge(e.target.value)}
                className="h-8 w-20 rounded-md border border-line bg-white px-2 text-[13px] font-medium text-ink tnum focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20" />
              
              <p className="text-[13px] font-medium text-primary tnum">
                Age {probe} resolves to {matched.factor}
                <span className="ml-2 font-normal text-muted">
                  from band {matched.age}
                </span>
              </p>
            </div>

            <div className="mt-3 flex items-start gap-2 rounded-md border border-warning/40 bg-warning-tint px-3.5 py-2.5 text-micro text-[#92400E]">
              <AlertTriangleIcon
                className="mt-0.5 h-3.5 w-3.5 shrink-0"
                strokeWidth={1.75}
                aria-hidden="true" />
              
              <p>
                Note: the illustration corridor lookup interpolates between
                ages; every other lookup floor-matches. Editing here does not
                change lookup behaviour. The preview shows floor-match (step
                function), which is what the pricing engine uses.
              </p>
            </div>
          </Card>

          <Card
            accent="primary"
            title="Validation"
            meta="0 blocking · 0 advisory">
            
            <ul className="space-y-2">
              {configValidation.map((v) =>
              <li
                key={v.title}
                className="flex items-start justify-between gap-4 rounded-md border border-success/30 bg-success-tint px-3.5 py-2.5">
                
                  <div className="flex items-start gap-2">
                    <CheckIcon
                    className="mt-0.5 h-4 w-4 shrink-0 text-success"
                    strokeWidth={2}
                    aria-hidden="true" />
                  
                    <div>
                      <p className="text-[13px] font-medium text-[#15803D]">
                        {v.title}
                      </p>
                      <p className="text-micro text-muted">{v.detail}</p>
                    </div>
                  </div>
                  <span className="shrink-0 text-micro font-semibold uppercase text-[#B45309]">
                    pass
                  </span>
                </li>
              )}
            </ul>
          </Card>
        </div>
      </div>
    </div>);

}