import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { themeColors } from '../../utils/theme';
import { navGroups } from '../../data/navigation';

export function SideNav(): JSX.Element {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { theme } = useTheme();
  const colors = themeColors[theme];

  return (
    <nav
      aria-label="Main"
      className={`flex h-full shrink-0 flex-col overflow-y-auto thin-scroll transition-all duration-300 ease-out ${
        isCollapsed ? 'w-20' : 'w-[248px]'
      }`}
      style={{ backgroundColor: colors.nav }}>

      <div className={`flex items-center justify-between ${isCollapsed ? 'px-3' : 'px-5'} pb-5 pt-6`}>
        {!isCollapsed && (
          <>
            <div>
              <p className="text-[15px] font-semibold leading-5 text-white">
                NYL AutoQuote
              </p>
              <p className="mt-0.5 text-xs text-nav-text">Pricing Portal</p>
            </div>
          </>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="flex items-center justify-center rounded-md p-1 text-nav-text transition-colors duration-150 hover:bg-nav-hover hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>

          {isCollapsed ? (
            <ChevronRightIcon className="h-5 w-5" strokeWidth={1.75} />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" strokeWidth={1.75} />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-6 pb-8">
        {navGroups.map((group) =>
        <div key={group.label}>
            {!isCollapsed && (
              <p className="px-5 pb-2 text-micro font-semibold uppercase tracking-[0.08em] text-[#6B7280]">
                {group.label}
              </p>
            )}
            <ul className={`space-y-0.5 ${isCollapsed ? 'px-1.5' : 'px-2'}`}>
              {group.items.map((item) =>
            <li key={item.to}>
                  <NavLink
                to={item.to}
                end={item.to === '/'}
                title={isCollapsed ? item.label : undefined}
                className={({ isActive }) =>
                `flex items-center ${isCollapsed ? 'justify-center' : 'gap-2.5'} rounded-md px-3 py-2 text-[13px] font-medium transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 ${
                isActive ?
                'text-white' :
                'text-nav-text hover:text-white'}`

                }
                style={({ isActive }) => ({ backgroundColor: isActive ? colors.primary : 'transparent' })}>

                    <item.icon
                  className="h-4 w-4 shrink-0"
                  strokeWidth={1.75}
                  aria-hidden="true" />

                    {!isCollapsed && <span className="truncate">{item.label}</span>}
                  </NavLink>
                </li>
            )}
            </ul>
          </div>
        )}
      </div>
    </nav>);

}