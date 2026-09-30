import React from 'react';
import { PricingResults } from '../../../components/pricing/PricingResults';
import { MvpCalibrator } from '../../../components/pricing/MvpCalibrator';
import { ApprovalWorkflow } from '../../../components/pricing/ApprovalWorkflow';
import { ProfitDecomposition } from '../../../components/pricing/ProfitDecomposition';
import { AnalysisToolsPanel } from '../../../components/pricing/AnalysisToolsPanel';
import { useWorkspaceCase } from '../../../hooks/useWorkspaceCase';

export function PricingResultsPanel(): JSX.Element {
  const quote = useWorkspaceCase();
  return (
    <div className="space-y-5">
      <PricingResults quote={quote} />
      <MvpCalibrator quote={quote} />
      <ApprovalWorkflow quote={quote} />
      <ProfitDecomposition />
      <AnalysisToolsPanel />
    </div>);

}
