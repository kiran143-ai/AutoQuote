import React, { useState } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis } from
'recharts';
import { BarChart3Icon } from 'lucide-react';
import { Card } from '../ui/Card';
import {
  annualDecomposition,
  cumulativeDecomposition,
  decompositionComponents,
  decompositionYears,
  netDecomposition,
  topDrags,
  topDrivers } from
'../../data/profitDecomposition';

type Mode = 'Annual' | 'Cumulative' | 'Waterfall';

export function ProfitDecomposition(): JSX.Element {
  const [mode, setMode] = useState<Mode>('Annual');

  const byKey = Object.fromEntries(
    decompositionComponents.map((c) => [c.key, c])
  );
  const maxAbs = Math.max(
    ...decompositionComponents.map((c) => Math.abs(c.total))
  );

  return (
    <Card
      title={
      <span className="flex items-center gap-2">
          <BarChart3Icon
          className="h-4 w-4 text-muted"
          strokeWidth={1.75}
          aria-hidden="true" />
        
          Profit Decomposition
        </span>
      }
      meta={`${decompositionYears} years · ${decompositionComponents.length} components`}>
      
      <div className="grid grid-cols-1 gap-4 border-b border-line pb-4 sm:grid-cols-2">
        <div>
          <p className="text-micro font-semibold uppercase tracking-[0.06em] text-[#15803D]">
            Top drivers
          </p>
          <ul className="mt-2 space-y-1.5">
            {topDrivers.map((key) =>
            <li
              key={key}
              className="flex items-center justify-between text-[13px]">
              
                <span className="flex items-center gap-2 text-ink">
                  <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: byKey[key].color }} />
                
                  {byKey[key].label}
                </span>
                <span className="font-semibold text-[#15803D] tnum">
                  +${byKey[key].total.toFixed(2)}M
                </span>
              </li>
            )}
          </ul>
        </div>
        <div>
          <p className="text-micro font-semibold uppercase tracking-[0.06em] text-danger">
            Top drags
          </p>
          <ul className="mt-2 space-y-1.5">
            {topDrags.map((key) =>
            <li
              key={key}
              className="flex items-center justify-between text-[13px]">
              
                <span className="flex items-center gap-2 text-ink">
                  <span
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ background: byKey[key].color }} />
                
                  {byKey[key].label}
                </span>
                <span className="font-semibold text-danger tnum">
                  −${Math.abs(byKey[key].total).toFixed(2)}M
                </span>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="mt-4 flex gap-1.5">
        {(['Annual', 'Cumulative', 'Waterfall'] as Mode[]).map((m) =>
        <button
          key={m}
          type="button"
          onClick={() => setMode(m)}
          aria-pressed={mode === m}
          className={`h-8 rounded-md border px-3 text-[13px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
          mode === m ?
          'border-primary bg-primary text-white' :
          'border-line bg-white text-ink hover:bg-canvas'}`
          }>
          
            {m}
          </button>
        )}
      </div>

      <div className="mt-4 h-[320px] w-full">
        {mode === 'Annual' &&
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={annualDecomposition} stackOffset="sign">
              <CartesianGrid stroke="#E5E7EB" vertical={false} />
              <XAxis
              dataKey="year"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              interval={4}
              stroke="#E5E7EB" />
            
              <YAxis
              tick={{ fill: '#6B7280', fontSize: 10 }}
              stroke="#E5E7EB"
              tickFormatter={(v: number) => `$${v}M`}
              width={56} />
            
              <Tooltip
              formatter={(v: number, n: string) => [`$${v}M`, n]}
              contentStyle={{
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                fontSize: 12
              }} />
            
              <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle" />
            
              {decompositionComponents.map((c) =>
            <Bar
              key={c.key}
              dataKey={c.key}
              name={c.label}
              stackId="stack"
              fill={c.color} />

            )}
            </BarChart>
          </ResponsiveContainer>
        }

        {mode === 'Cumulative' &&
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={cumulativeDecomposition}>
              <CartesianGrid stroke="#E5E7EB" vertical={false} />
              <XAxis
              dataKey="year"
              tick={{ fill: '#6B7280', fontSize: 10 }}
              interval={4}
              stroke="#E5E7EB" />
            
              <YAxis
              tick={{ fill: '#6B7280', fontSize: 10 }}
              stroke="#E5E7EB"
              tickFormatter={(v: number) => `$${v}M`}
              width={56} />
            
              <Tooltip
              formatter={(v: number) => [`$${v}M`, 'Cumulative net']}
              contentStyle={{
                border: '1px solid #E5E7EB',
                borderRadius: 8,
                fontSize: 12
              }} />
            
              <Line
              type="monotone"
              dataKey="net"
              stroke="#1D4ED8"
              strokeWidth={2}
              dot={false} />
            
            </LineChart>
          </ResponsiveContainer>
        }

        {mode === 'Waterfall' &&
        <ul className="space-y-1.5 pr-2">
            {decompositionComponents.map((c) => {
            const positive = c.total >= 0;
            const width = Math.abs(c.total) / maxAbs * 50;
            return (
              <li key={c.key} className="flex items-center gap-2 text-[13px]">
                  <span className="w-24 shrink-0 text-muted">{c.label}</span>
                  <span className="relative flex h-4 flex-1 items-center">
                    <span className="absolute left-1/2 h-full w-px bg-line" />
                    <span
                    className="absolute h-3 rounded-sm"
                    style={{
                      background: c.color,
                      width: `${width}%`,
                      left: positive ? '50%' : `${50 - width}%`
                    }} />
                  
                  </span>
                  <span
                  className={`w-24 shrink-0 text-right font-semibold tnum ${
                  positive ? 'text-[#15803D]' : 'text-danger'}`
                  }>
                  
                    {positive ? '+' : '−'}${Math.abs(c.total).toFixed(2)}M
                  </span>
                </li>);

          })}
          </ul>
        }
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-micro">
        <p className="text-muted">
          Case profile:{' '}
          <span className="font-semibold text-[#B45309]">
            Reserve/Capital-heavy (96% of total drags)
          </span>
        </p>
        <p className="text-muted tnum">Net: ${netDecomposition.toFixed(2)}M</p>
      </div>
    </Card>);

}