import React from 'react';
import { AlertTriangleIcon, BarChart3Icon, LayersIcon } from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';
import { useCaseStore } from '../../contexts/CaseStore';
import { premiumShort, signedPct } from '../../utils/format';

export function RoundsTab(): JSX.Element {
  const quote = useWorkspaceCase();
  const { newRound } = useCaseStore();
  const m = quote.metrics;

  const rounds = m ?
  Array.from({ length: quote.round }, (_, i) => ({
    round: i + 1,
    mvp: m.mvp,
    breakEven: m.breakEven,
    strain: m.strain
  })) :
  [];

  return (
    <div className="space-y-5">
      <Card
        accent="primary"
        title="Pricing rounds"
        meta={`${quote.round} round${quote.round === 1 ? '' : 's'} on this case`}
        padded={false}
        action={
        <Button size="sm" variant="primary" onClick={() => newRound(quote.id)}>
            New round
          </Button>
        }>
        
        <div className="px-5 pb-5">
          <p className="mb-3 flex items-center gap-2 text-[13px] text-[#92400E]">
            <AlertTriangleIcon
              className="h-4 w-4 shrink-0 text-warning"
              strokeWidth={1.75}
              aria-hidden="true" />
            
            Opening price reconstructed, not captured.
          </p>

          {rounds.length === 0 ?
          <p className="rounded-md border border-dashed border-line bg-canvas px-4 py-6 text-center text-[13px] text-muted">
              No pricing rounds recorded yet. Click "New round" to create the
              first one.
            </p> :

          <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-line text-micro font-semibold uppercase tracking-[0.06em] text-muted">
                  <th scope="col" className="py-2 text-left">
                    Round
                  </th>
                  <th scope="col" className="py-2 text-right">
                    MVP
                  </th>
                  <th scope="col" className="py-2 text-right">
                    Break-even
                  </th>
                  <th scope="col" className="py-2 text-right">
                    Strain
                  </th>
                  <th scope="col" className="py-2 text-right">
                    Premium
                  </th>
                </tr>
              </thead>
              <tbody>
                {rounds.map((r) =>
              <tr key={r.round} className="border-b border-line last:border-0">
                    <td className="py-2.5 font-medium text-ink tnum">
                      #{r.round}
                      {r.round === quote.round &&
                  <span className="ml-2 rounded-full bg-primary-tint px-1.5 py-0.5 text-micro font-semibold text-primary">
                          Current
                        </span>
                  }
                    </td>
                    <td className="py-2.5 text-right font-semibold text-[#15803D] tnum">
                      {r.mvp.toFixed(2)}%
                    </td>
                    <td className="py-2.5 text-right text-ink tnum">
                      Mo {r.breakEven}
                    </td>
                    <td className="py-2.5 text-right text-danger tnum">
                      {signedPct(r.strain, 1)}
                    </td>
                    <td className="py-2.5 text-right text-ink tnum">
                      {premiumShort(quote.inputs.premium)}
                    </td>
                  </tr>
              )}
              </tbody>
            </table>
          }
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <Card
          title={
          <span className="flex items-center gap-2">
              <BarChart3Icon
              className="h-4 w-4 text-muted"
              strokeWidth={1.75}
              aria-hidden="true" />
            
              Round Comparison &amp; Summary
            </span>
          }
          meta={`${quote.round} rounds`}>
          
          <p className="rounded-md border border-dashed border-line bg-canvas px-4 py-6 text-center text-[13px] text-muted">
            No round snapshots recorded yet. Snapshots are captured
            automatically on each pricing run.
          </p>
        </Card>

        <Card
          title={
          <span className="flex items-center gap-2">
              <LayersIcon
              className="h-4 w-4 text-muted"
              strokeWidth={1.75}
              aria-hidden="true" />
            
              MVP Bridge — Impact Attribution
            </span>
          }>
          
          <p className="rounded-md border border-dashed border-line bg-canvas px-4 py-6 text-center text-[13px] text-muted">
            Need at least 2 rounds to compute an MVP bridge. Run pricing
            multiple times with different parameters.
          </p>
        </Card>
      </div>
    </div>);

}