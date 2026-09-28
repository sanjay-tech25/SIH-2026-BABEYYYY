import React from 'react';

type PageHeaderProps = {
  title: string;
  subtitle: string;
  action?: React.ReactNode;
};

export function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="max-w-2xl">
        <h1 className="font-display text-h1 font-bold text-zinc-950 dark:text-zinc-50">
          {title}
        </h1>
        <p className="mt-2 text-body text-zinc-700 dark:text-zinc-300 leading-relaxed">{subtitle}</p>
      </div>
      {action}
    </header>);

}