import React from 'react';
import {
  LayoutGridIcon,
  BookOpenIcon,
  RouteIcon,
  ClipboardCheckIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  MedalIcon,
  CpuIcon,
  FlaskConicalIcon,
  SettingsIcon,
  UserIcon,
  LogOutIcon,
  HomeIcon,
  XIcon
} from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';
import { learner, type NavId } from '../data/appData';

type NavItem = {
  id: NavId;
  label: string;
  icon: typeof LayoutGridIcon;
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Today', icon: LayoutGridIcon },
  { id: 'courses', label: 'Courses', icon: BookOpenIcon },
  { id: 'path', label: 'Learning path', icon: RouteIcon },
  { id: 'circuits', label: 'Circuit builder', icon: CpuIcon },
  { id: 'openlab', label: 'Open Lab (Colab)', icon: FlaskConicalIcon },
  { id: 'assessments', label: 'Assessments', icon: ClipboardCheckIcon },
  { id: 'tutor', label: 'Ask the tutor', icon: MessageSquareIcon },
  { id: 'progress', label: 'Progress', icon: TrendingUpIcon },
  { id: 'achievements', label: 'Milestones', icon: MedalIcon },
  { id: 'settings', label: 'Settings', icon: SettingsIcon }
];

type SidebarProps = {
  current: NavId;
  onNavigate: (id: NavId) => void;
  onLogout?: () => void;
  onClose?: () => void;
};

export function Sidebar({ current, onNavigate, onLogout, onClose }: SidebarProps) {
  const xpPercent = (learner.xp / learner.xpTarget) * 100;

  return (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between px-5 pb-5 pt-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <span
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 font-display text-sm font-bold text-white shadow-sm"
            aria-hidden="true"
          >
            QB
          </span>
          <div>
            <span className="font-display text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
              QUBOT
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Adaptive Learning
            </span>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="flex h-11 w-11 items-center justify-center rounded-xl text-zinc-500 hover:bg-zinc-100 lg:hidden dark:hover:bg-zinc-800"
          >
            <XIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="px-5 py-3">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-zinc-900 dark:text-zinc-100">Level {learner.level}</span>
            <span className="text-zinc-500 dark:text-zinc-400">{learner.xp} / {learner.xpTarget} XP</span>
          </div>
          <ProgressBar value={xpPercent} label="XP progress" className="mt-2" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2" aria-label="Main navigation">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const active = item.id === current;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    active
                      ? 'bg-emerald-600 font-medium text-white shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" aria-hidden="true" />
                  <span className="truncate">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-zinc-200 px-3 py-3 dark:border-zinc-800">
        <ul className="space-y-1">
          <li>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <UserIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              <span>Learner Profile</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={onLogout}
              className="flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              <LogOutIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              <span>Exit to Overview</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}