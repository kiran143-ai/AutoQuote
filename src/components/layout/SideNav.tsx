import React from 'react';
import { NavLink } from 'react-router-dom';
import { navGroups } from '../../data/navigation';

export function SideNav(): JSX.Element {
  return (
    <nav
      aria-label="Main"
      className="flex h-full w-[248px] shrink-0 flex-col overflow-y-auto bg-nav thin-scroll">
      
      <div className="px-5 pb-5 pt-6">
        <p className="text-[15px] font-semibold leading-5 text-white">
          NYL AutoQuote
        </p>
        <p className="mt-0.5 text-xs text-nav-text">Pricing Portal</p>
      </div>

      <div className="flex flex-1 flex-col gap-6 pb-8">
        {navGroups.map((group) =>
        <div key={group.label}>
            <p className="px-5 pb-2 text-micro font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
              {group.label}
            </p>
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) =>
            <li key={item.to}>
                  <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                `flex items-center gap-2.5 rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isActive ?
                'bg-primary text-white' :
                'text-nav-text hover:bg-nav-hover hover:text-white'}`

                }>
                
                    <item.icon
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true" />
                
                    <span className="truncate">{item.label}</span>
                  </NavLink>
                </li>
            )}
            </ul>
          </div>
        )}
      </div>
    </nav>);

}