import React, { useEffect, useRef, useState } from 'react';
import { useToast } from '../contexts/ToastContext';
import { Navigate, Outlet, useNavigate, useParams } from 'react-router-dom';
import { CaseHeader } from '../components/workspace/CaseHeader';
import { WorkspaceTabs } from '../components/workspace/WorkspaceTabs';
import { WorkspaceTabsV2 } from '../components/workspace/WorkspaceTabsV2';
import { useCaseStore } from '../contexts/CaseStore';
import { WorkflowVersionContext } from '../contexts/WorkflowVersionContext';

type WorkflowVersion = 'v1' | 'v2';

export function WorkspacePage(): JSX.Element {
  const { caseId } = useParams<{caseId: string;}>();
  const { getCase } = useCaseStore();
  const quote = caseId ? getCase(caseId) : undefined;
  const navigate = useNavigate();
  const toast = useToast();
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);
  const [version, setVersion] = useState<WorkflowVersion>('v1');

  useEffect(() => {
    const headerEl = headerRef.current;
    const scrollEl = headerEl?.closest('main');
    if (!headerEl || !scrollEl) return;

    const onScroll = () => {
      setScrolledPastHeader(scrollEl.scrollTop > headerEl.offsetHeight - 40);
    };
    onScroll();
    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => scrollEl.removeEventListener('scroll', onScroll);
  }, [quote?.id]);

  if (!quote) return <Navigate to="/quotes" replace />;

  const onVersionChange = (v: WorkflowVersion) => {
    setVersion(v);
    toast.info(v === 'v1' ? 'Switched to Version 1' : 'Switched to Version 2', v === 'v1' ? 'Current workflow' : 'Simplified workflow');
    navigate(`/quotes/${quote.id}/overview`);
  };

  return (
    <WorkflowVersionContext.Provider value={version}>
    <div className="flex flex-col bg-canvas">
      <div ref={headerRef}>
        <CaseHeader quote={quote} version={version} onVersionChange={onVersionChange} />
      </div>
      {version === 'v1' ?
      <WorkspaceTabs quote={quote} showStickyReview={scrolledPastHeader} /> :

      <WorkspaceTabsV2 quote={quote} showStickyReview={scrolledPastHeader} />
      }
      <div className="mx-auto w-full max-w-[1440px] p-6">
        <Outlet context={quote} />
      </div>
    </div>
    </WorkflowVersionContext.Provider>);

}
