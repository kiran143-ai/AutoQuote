import React from 'react';

export function ProgressRing({
  value,
  size = 48,
  tone = '#F59E0B'




}: {value: number;size?: number;tone?: string;}): JSX.Element {
  const stroke = 4;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - Math.min(100, Math.max(0, value)) / 100);
  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${value}% complete`}>
      
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={stroke} />
        
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={tone}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset} />
        
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-ink tnum">
        {value}%
      </span>
    </div>);

}