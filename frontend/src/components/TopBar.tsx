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
  onOpenOverview?: () => void;
};

export function TopBar({ dark, onToggleTheme, onOpenNav, onOpenOverview }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/95 backdrop-blur shadow-sm dark:border-zinc-800 dark:bg-zinc-950/95">
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
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            aria-hidden="true" />
          
          <input
            type="search"
            placeholder="Search topics, lessons or circuits..."
            aria-label="Search"
            className="h-10 w-full rounded-full border border-slate-200/90 bg-white/90 pl-10 pr-4 font-poppins text-xs sm:text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-[#4c1d70] focus:outline-none focus:ring-2 focus:ring-[#4c1d70]/20 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:bg-zinc-900 shadow-sm transition-all" />
          
        </div>

        {onOpenOverview && (
          <button
            type="button"
            onClick={onOpenOverview}
            className="hidden items-center gap-2 rounded-full border border-purple-800/20 bg-[#4c1d70] px-4 py-1.5 text-xs font-orbitron font-bold text-white hover:bg-[#3b1458] shadow-sm transition-all sm:inline-flex shrink-0 active:scale-95"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-[#f5d626] animate-pulse" />
            <span>Platform Overview</span>
          </button>
        )}

        <span className="hidden min-h-[36px] items-center gap-2 rounded-full border border-amber-200 bg-amber-50/80 px-3.5 py-1 text-xs font-poppins font-semibold text-amber-900 sm:inline-flex dark:border-amber-900/50 dark:bg-amber-950/30 dark:text-amber-300 shrink-0">
          <FlameIcon className="h-4 w-4 text-[#f5d626] fill-[#f5d626]" aria-hidden="true" />
          <span><strong className="font-orbitron font-bold text-[#b45309] dark:text-[#f5d626]">{learner.streakDays}</strong> day streak</span>
        </span>

        <button
          type="button"
          onClick={onToggleTheme}
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
          
          {dark ?
          <SunIcon className="h-4 w-4" aria-hidden="true" /> :

          <MoonIcon className="h-4 w-4" aria-hidden="true" />
          }
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setShowNotifications((v) => !v)}
            aria-expanded={showNotifications}
            aria-label="Notifications"
            className="flex h-10 w-10 items-center justify-center rounded-xl text-zinc-600 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800">
            
            <BellIcon className="h-4 w-4" aria-hidden="true" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-[#f5d626] ring-1 ring-white dark:ring-zinc-900" />
          </button>

          {showNotifications &&
          <div className="absolute right-0 top-14 w-80 rounded-2xl border border-purple-900/15 bg-white shadow-xl dark:border-zinc-800 dark:bg-zinc-900">
              <div className="flex items-center justify-between border-b border-purple-900/10 px-4 py-3 dark:border-zinc-800">
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
              <ul className="divide-y divide-purple-900/10 dark:divide-zinc-800">
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