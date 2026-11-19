import React from 'react';
import { RollForwardSection } from '../../components/workspace/RollForwardSection';

// The "Pricing rounds" card is hidden in this prototype. To restore it, bring back the card markup
// below, plus: AlertTriangleIcon, Card, Button, useWorkspaceCase, useCaseStore, useRole,
// premiumShort/signedPct, and the `rounds` list built from quote.metrics.
export function RoundsTab(): JSX.Element {
  return (
    <div className="space-y-5">
      {/* "Pricing rounds" card hidden (kept for reference):
      <Card
        accent="primary"
        title="Pricing rounds"
        meta={`${quote.round} round${quote.round === 1 ? '' : 's'} on this case`}
        padded={false}
        action={
        <Button size="sm" variant="primary" onClick={() => newRound(quote.id)} disabled={!can('runPricing')} title={deny('runPricing')}>
            New round
          </Button>
        }>
        
        <div className="px-5 pb-5">
          <p className="mb-3 flex items-center gap-2 text-[13px] text-[#92400E]">
            <AlertTriangleIcon
              className="h-4 w-4 shrink-0 text-[#92400E]"
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
      */}

      <RollForwardSection />
    </div>);

}