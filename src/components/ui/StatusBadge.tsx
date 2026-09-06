import React from 'react';
import {
  CheckCircle2Icon,
  CircleDotIcon,
  FileEditIcon,
  TrophyIcon,
  XCircleIcon } from
'lucide-react';
import type { CaseStatus } from '../../types';

const map: Record<
  CaseStatus,
  {className: string;Icon: React.ElementType;}> =
{
  Draft: {
    className: 'bg-warning-tint text-[#92400E] border-warning/40',
    Icon: FileEditIcon
  },
  Quoted: {
    className: 'bg-info-tint text-[#0369A1] border-info/40',
    Icon: CircleDotIcon
  },
  Approved: {
    className: 'bg-success-tint text-[#15803D] border-success/40',
    Icon: CheckCircle2Icon
  },
  Won: {
    className: 'bg-success-tint text-[#15803D] border-success/40',
    Icon: TrophyIcon
  },
  Declined: {
    className: 'bg-danger-tint text-[#B91C1C] border-danger/40',
    Icon: XCircleIcon
  },
  Lost: {
    className: 'bg-canvas text-muted border-line',
    Icon: XCircleIcon
  }
};

export function StatusBadge({
  status,
  size = 'md'



}: {status: CaseStatus;size?: 'sm' | 'md';}): JSX.Element {
  const { className, Icon } = map[status];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border font-medium ${className} ${
      size === 'sm' ?
      'px-2 py-0.5 text-micro' :
      'px-2.5 py-1 text-xs'}`
      }>
      
      <Icon className="h-3.5 w-3.5" strokeWidth={1.75} aria-hidden="true" />
      {status}
    </span>);

}