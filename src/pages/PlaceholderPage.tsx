import React from 'react';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/layout/PageHeader';

export function PlaceholderPage({
  title,
  subtitle,
  panels




}: {title: string;subtitle: string;panels: string[];}): JSX.Element {
  return (
    <div className="mx-auto max-w-[1440px] p-6">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {panels.map((panel) =>
        <Card key={panel} title={panel} meta="No data in this prototype">
            <div className="flex h-28 items-center justify-center rounded-md border border-dashed border-line bg-canvas text-xs text-muted">
              {panel} placeholder
            </div>
          </Card>
        )}
      </div>
    </div>);

}