import React from 'react';
import {
  DownloadIcon,
  FolderOpenIcon,
  LightbulbIcon,
  PlusIcon,
  RotateCwIcon,
  SaveIcon,
  UploadIcon } from
'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { NumberField } from '../ui/NumberField';
import { useCaseStore } from '../../contexts/CaseStore';
import { premiumShort } from '../../utils/format';
import type { CaseInputs, QuoteCase } from '../../types';

const fields: {
  key: keyof CaseInputs;
  label: string;
  hint?: string;
}[] = [
{ key: 'me', label: 'M&E (bps)', hint: 'Mortality & expense charge' },
{ key: 'saReturn', label: 'SA Return (%)', hint: 'Separate account return' },
{ key: 'faSpread', label: 'FA Spread (bps)', hint: 'Fixed account spread' },
{ key: 'saAllocation', label: 'SA Allocation (%)' },
{ key: 'premium', label: 'Premium ($)', hint: 'Annual premium' },
{ key: 'payYears', label: 'Pay Years' },
{ key: 'faceAmount', label: 'Face Amount ($)' },
{ key: 'issueAge', label: 'Issue Age' },
{ key: 'mortalityAge', label: 'Mortality Age' },
{ key: 'lives', label: 'Lives' },
{ key: 'wacc', label: 'WACC (%)' },
{ key: 'commissionY1', label: 'Commission Y1' },
{ key: 'trail', label: 'Trail (bps)' },
{ key: 'revShare', label: 'RevShare (bps)' },
{ key: 'projectionMo', label: 'Projection Mo' }];


export function CaseInputsPanel({ quote }: {quote: QuoteCase;}): JSX.Element {
  const { updateInputs } = useCaseStore();

  return (
    <Card
      accent="primary"
      title="Case inputs"
      meta={`M&E ${quote.inputs.me} bps · SA ${quote.inputs.saReturn}% · ${premiumShort(
        quote.inputs.premium
      )}`}>
      
      <div className="grid grid-cols-1 gap-x-5 gap-y-4 sm:grid-cols-2 lg:grid-cols-4">
        {fields.map((field) =>
        <NumberField
          key={field.key}
          label={field.label}
          hint={field.hint}
          value={quote.inputs[field.key]}
          onChange={(v) =>
          updateInputs(quote.id, { [field.key]: Number(v) || 0 })
          }
          trailing={
          field.key === 'me' ?
          <Button
            size="sm"
            variant="secondary"
            className="shrink-0"
            icon={
            <LightbulbIcon className="h-3.5 w-3.5 text-warning" strokeWidth={1.75} />
            }>
            
                  Suggest
                </Button> :
          undefined
          } />

        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-line pt-4">
        <Button
          size="sm"
          variant="ghost"
          icon={<PlusIcon className="h-4 w-4" strokeWidth={2} />}>
          
          Add Commission Schedule
        </Button>
        <span className="text-micro text-muted">
          ▸ Advanced Settings (3 configured)
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-micro font-semibold uppercase tracking-[0.06em] text-muted">
          Inputs
        </span>
        <Button size="sm" icon={<DownloadIcon className="h-3.5 w-3.5" strokeWidth={1.75} />}>
          Extract
        </Button>
        <Button size="sm" icon={<UploadIcon className="h-3.5 w-3.5" strokeWidth={1.75} />}>
          Import
        </Button>
        <Button size="sm" icon={<SaveIcon className="h-3.5 w-3.5" strokeWidth={1.75} />}>
          Save to Library
        </Button>
        <Button
          size="sm"
          variant="ghost"
          icon={<FolderOpenIcon className="h-3.5 w-3.5" strokeWidth={1.75} />}>
          
          Library
        </Button>
      </div>

      <div className="mt-4 rounded-md border border-line bg-canvas px-4 py-3.5">
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-ink">
            Input Library — EPPVUL Presets
          </p>
          <Button
            size="sm"
            variant="secondary"
            icon={<RotateCwIcon className="h-3.5 w-3.5" strokeWidth={1.75} />}>
            
            Refresh
          </Button>
        </div>
        <p className="mt-3 text-center text-[13px] text-muted">
          No saved EPPVUL presets yet. Use "Save to Library" to create one.
        </p>
      </div>
    </Card>);

}