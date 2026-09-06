import React, { useState } from 'react';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

export function IllustrationTab(): JSX.Element {
  const [running, setRunning] = useState(false);

  return (
    <div className="max-w-[900px]">
      <Card
        accent="primary"
        title="Illustration"
        meta="Multi-scenario illustration (current / midpoint / guaranteed) using the case census and configuration snapshot.">
        
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant="primary"
            onClick={() => {
              setRunning(true);
              window.setTimeout(() => setRunning(false), 2500);
            }}
            disabled={running}
            icon={
            running ?
            <Loader2Icon
              className="h-4 w-4 animate-spin"
              strokeWidth={1.75} /> :


            <PlayIcon className="h-4 w-4" strokeWidth={1.75} />

            }>
            
            {running ? 'Generating…' : 'Generate Illustration'}
          </Button>
          <p className="text-xs text-muted tnum">
            Runs the illustration engine with 3 scenarios. Typically 2–5 s.
          </p>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {['Current', 'Midpoint', 'Guaranteed'].map((scenario) =>
          <div
            key={scenario}
            className="rounded-md border border-line bg-canvas px-4 py-3">
            
              <p className="text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                {scenario}
              </p>
              <p className="mt-1 text-[13px] text-muted">
                {running ? 'Generating…' : 'Not generated yet'}
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>);

}