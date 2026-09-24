import React, { useEffect, useRef, useState } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';
import { CaseHeader } from '../components/workspace/CaseHeader';
import { WorkspaceTabs } from '../components/workspace/WorkspaceTabs';
import { useCaseStore } from '../contexts/CaseStore';

export function WorkspacePage(): JSX.Element {
  const { caseId } = useParams<{caseId: string;}>();
  const { getCase } = useCaseStore();
  const quote = caseId ? getCase(caseId) : undefined;
  const headerRef = useRef<HTMLDivElement>(null);
  const [scrolledPastHeader, setScrolledPastHeader] = useState(false);

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

  return (
    <div className="flex flex-col bg-canvas">
      <div ref={headerRef}>
        <CaseHeader quote={quote} />
      </div>
      <WorkspaceTabs quote={quote} showStickyReview={scrolledPastHeader} />
      <div className="mx-auto w-full max-w-[1440px] p-6">
        <Outlet context={quote} />
      </div>
    </div>);

}
