import React from 'react';
import { Outlet } from 'react-router-dom';
import { SideNav } from './SideNav';
import { TopBar } from './TopBar';

export function AppShell(): JSX.Element {
  return (
    <div className="flex h-full w-full overflow-hidden bg-canvas">
      <SideNav />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <main className="flex-1 overflow-y-auto thin-scroll">
          <Outlet />
        </main>
      </div>
    </div>);

}