import React from 'react';
import { ClipboardIcon, FolderIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';

export function CensusTab(): JSX.Element {
  const quote = useWorkspaceCase();

  return (
    <div className="max-w-[900px]">
      <Card
        accent="primary"
        title="Census"
        meta={`${quote.inputs.lives} lives · ${quote.censusSource}`}>
        
        <div className="rounded-md border border-line bg-canvas p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ClipboardIcon
                className="h-4 w-4 text-muted"
                strokeWidth={1.75}
                aria-hidden="true" />
              
              <h3 className="text-[13px] font-semibold text-ink">
                Census Data
              </h3>
              <span className="text-xs text-muted">
                Using synthetic bell-curve
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              icon={<ClipboardIcon className="h-4 w-4" strokeWidth={1.75} />}>
              
              Paste Census
            </Button>
          </div>

          <div className="mt-4 flex flex-col items-center justify-center rounded-md border border-dashed border-line bg-white px-6 py-12 text-center">
            <FolderIcon
              className="h-8 w-8 text-warning"
              strokeWidth={1.5}
              aria-hidden="true" />
            
            <p className="mt-2.5 text-sm font-medium text-ink">
              Drag &amp; drop census file here
            </p>
            <p className="mt-1 text-micro text-muted">
              or click to browse — CSV, TSV, XLSX supported
            </p>
          </div>
        </div>
      </Card>
    </div>);

}