import React, { useState } from 'react';
import {
  SearchIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  MenuIcon,
  FlameIcon } from
'lucide-react';
import { learner } from '../data/appData';

type Notification = {
  id: string;
  title: string;
  body: string;
  time: string;
};

const notifications: Notification[] = [
{
  id: 'n1',
  title: 'Diagnostic ready',
  body: 'The neural networks benchmark is open for you.',
  time: '10m ago'
},
{
  id: 'n2',
  title: 'Streak kept',
  body: 'You studied 22 minutes today.',
  time: '1h ago'
},
{
  id: 'n3',
  title: 'Level 4 reached',
  body: 'You moved up in quantum computing fundamentals.',
  time: '1d ago'
}];


type TopBarProps = {
  dark: boolean;
  onToggleTheme: () => void;
  onOpenNav: () => void;
};

export function TopBar({ dark, onToggleTheme, onOpenNav }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onOpenNav}
          aria-label="Open navigation"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 lg:hidden dark:text-zinc-300 dark:hover:bg-zinc-800">
          
          <MenuIcon className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="relative flex-1">
          <SearchIcon
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true" />
          
          <input
            type="search"
            placeholder="Search topics, lessons or practice sets"
            aria-label="Search"
            className="h-11 w-full rounded-xl border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-body text-zinc-900 placeholder:text-zinc-500 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-900" />
          
        </div>

        <span className="hidden min-h-[44px] items-center gap-1.5 rounded-xl border border-zinc-200 px-3 text-body font-medium text-zinc-700 sm:inline-flex dark:border-zinc-800 dark:text-zinc-200">
          <FlameIcon className="h-4 w-4 text-brand-600" aria-hidden="true" />
          {learner.streakDays} day streak
        </span>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
          
          {dark ?
          <SunIcon className="h-5 w-5" aria-hidden="true" /> :

          <MoonIcon className="h-5 w-5" aria-hidden="true" />
          }
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((v) => !v)}
            aria-expanded={showNotifications}
            aria-label="Notifications"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            
            <BellIcon className="h-5 w-5" aria-hidden="true" />
            <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand-600" />
          </button>

          {showNotifications &&
          <div className="absolute right-0 top-14 w-80 rounded-2xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 dark:border-zinc-800">
                <p className="text-label font-medium uppercase text-zinc-500 dark:text-zinc-400">
                  Notifications
                </p>
                <button
                type="button"
                onClick={() => setShowNotifications(false)}
                className="text-xs font-medium text-brand-700 hover:underline dark:text-brand-300">
                
                  Mark all read
                </button>
              </div>
              <ul className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {notifications.map((n) =>
              <li key={n.id} className="px-4 py-3">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-body font-medium text-zinc-900 dark:text-zinc-100">
                        {n.title}
                      </p>
                      <span className="shrink-0 text-xs text-zinc-500">{n.time}</span>
                    </div>
                    <p className="mt-1 text-body text-zinc-600 dark:text-zinc-400">{n.body}</p>
                  </li>
              )}
              </ul>
            </div>
          }
        </div>

        <span
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display text-sm font-semibold text-brand-700 dark:bg-brand-600/20 dark:text-brand-200"
          aria-label={`Signed in as ${learner.name}`}>
          
          {learner.name.charAt(0)}
        </span>
      </div>
    </header>);

}