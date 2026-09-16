import React from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { CaseHeader } from '../components/workspace/CaseHeader';
import { WorkspaceTabs } from '../components/workspace/WorkspaceTabs';
import { useCaseStore } from '../contexts/CaseStore';

export function WorkspacePage(): JSX.Element {
  const { caseId } = useParams<{caseId: string;}>();
  const { getCase } = useCaseStore();
  const quote = caseId ? getCase(caseId) : undefined;

  if (!quote) return <Navigate to="/quotes" replace />;

  return (
    <div className="flex flex-col bg-canvas">
      <CaseHeader quote={quote} />
      <WorkspaceTabs quote={quote} />
      <div className="mx-auto w-full max-w-[1440px] p-6">
        <Outlet context={quote} />
      </div>
    </div>);

}