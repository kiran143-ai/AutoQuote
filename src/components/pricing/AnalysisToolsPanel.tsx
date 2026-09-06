import React, { useState } from 'react';
import { ChevronRightIcon, FlaskConicalIcon, PlayIcon } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { analysisTools } from '../../data/analysisTools';

export function AnalysisToolsPanel(): JSX.Element {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <Card
      title="Analysis tools"
      action={
      <Button
        size="sm"
        variant="primary"
        icon={<PlayIcon className="h-4 w-4" strokeWidth={1.75} />}>
        
          Run All Analyses
        </Button>
      }>
      
      <ul className="divide-y divide-line">
        {analysisTools.map((tool) => {
          const expanded = open === tool;
          return (
            <li key={tool}>
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() => setOpen(expanded ? null : tool)}
                className="flex w-full items-center gap-2 py-2.5 text-left text-[13px] font-medium text-ink transition-colors duration-150 ease-out hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                
                <ChevronRightIcon
                  className={`h-4 w-4 text-muted transition-transform duration-150 ease-out ${
                  expanded ? 'rotate-90' : ''}`
                  }
                  strokeWidth={1.75}
                  aria-hidden="true" />
                
                {tool}
              </button>
              {expanded &&
              <p className="pb-3 pl-6 text-[13px] text-muted">
                  Not run for this round yet. Use "Run All Analyses" to populate{' '}
                  {tool}.
                </p>
              }
            </li>);

        })}
      </ul>

      <p className="mt-3 border-t border-line pt-3 text-[13px] font-medium text-[#B45309]">
        ▸ Reconciliation Check (SOP Step 11)
      </p>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-line bg-canvas px-3.5 py-2.5">
        <span className="flex items-center gap-2 text-[13px] font-medium text-ink">
          <FlaskConicalIcon
            className="h-4 w-4 text-muted"
            strokeWidth={1.75}
            aria-hidden="true" />
          
          Case Regression Tests
        </span>
        <span className="text-micro text-muted">
          Run assertions against this case's inputs
        </span>
      </div>
    </Card>);

}