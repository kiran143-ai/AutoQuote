import React from 'react';
import { FolderIcon } from 'lucide-react';
import { CalibratePanel } from '../../components/pricing/CalibratePanel';
import { CaseInputsPanel } from '../../components/pricing/CaseInputsPanel';
import { PricingResults } from '../../components/pricing/PricingResults';
import { MvpCalibrator } from '../../components/pricing/MvpCalibrator';
import { ApprovalWorkflow } from '../../components/pricing/ApprovalWorkflow';
import { ProfitDecomposition } from '../../components/pricing/ProfitDecomposition';
import { AnalysisToolsPanel } from '../../components/pricing/AnalysisToolsPanel';
import { useWorkspaceCase } from '../../hooks/useWorkspaceCase';

export function PricingTab(): JSX.Element {
  const quote = useWorkspaceCase();

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-2 rounded-card border border-dashed border-line bg-white px-4 py-3 text-[13px] text-muted">
        <FolderIcon className="h-4 w-4 text-warning" strokeWidth={1.5} aria-hidden="true" />
        Drop a census file here (CSV, XLSX) to load &amp; auto-recalculate
      </div>

      <CalibratePanel quote={quote} />
      <CaseInputsPanel quote={quote} />
      <PricingResults quote={quote} />
      <MvpCalibrator quote={quote} />
      <ApprovalWorkflow quote={quote} />
      <ProfitDecomposition />
      <AnalysisToolsPanel />
    </div>);

}