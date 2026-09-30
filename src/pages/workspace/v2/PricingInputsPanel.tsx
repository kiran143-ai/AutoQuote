import React from 'react';
import { CalibratePanel } from '../../../components/pricing/CalibratePanel';
import { CaseInputsPanel } from '../../../components/pricing/CaseInputsPanel';
import { useWorkspaceCase } from '../../../hooks/useWorkspaceCase';

export function PricingInputsPanel(): JSX.Element {
  const quote = useWorkspaceCase();
  return (
    <div className="space-y-5">
      <CalibratePanel quote={quote} />
      <CaseInputsPanel quote={quote} />
    </div>);

}
