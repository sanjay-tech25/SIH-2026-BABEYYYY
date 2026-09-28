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
    <div className="flex h-full flex-col border-r border-slate-200/80 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex items-center justify-between px-5 pb-5 pt-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('dashboard')}>
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-purple-950 border border-[#f5d626]/50 shadow-[0_0_12px_rgba(245,214,38,0.3)] shrink-0">
            <span className="h-2.5 w-2.5 rounded-full bg-[#f5d626] animate-pulse" />
            <div className="absolute inset-0 rounded-full border border-[#f5d626]/30 animate-ping opacity-30" />
          </div>
          <div>
            <div className="font-orbitron text-sm font-bold tracking-wider leading-none">
              <span className="text-[#3b1458] dark:text-white">EGREEN </span>
              <span className="text-[#f5d626]">QUANTA</span>
            </div>
            <span className="block mt-1 text-[9px] font-mono font-bold tracking-widest text-[#4c1d70] dark:text-purple-300 uppercase">
              QUBOT v2.0 • ECOSYSTEM
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
        <div className="rounded-2xl border border-slate-200/90 bg-white p-3.5 shadow-sm dark:border-purple-900/40 dark:bg-purple-950/20">
          <div className="flex items-center justify-between text-xs">
            <span className="font-orbitron font-bold text-[#3b1458] dark:text-purple-200">Level {learner.level}</span>
            <span className="font-orbitron text-[11px] text-zinc-500 dark:text-zinc-400">{learner.xp} / {learner.xpTarget} XP</span>
          </div>
          <ProgressBar value={xpPercent} label="XP progress" className="mt-2" />
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-1.5 no-scrollbar" aria-label="Main navigation">
        <ul className="space-y-0.5">
          {navItems.map((item) => {
            const active = item.id === current;
            const Icon = item.icon;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  aria-current={active ? 'page' : undefined}
                  className={`flex min-h-[38px] w-full items-center gap-3 rounded-full px-4 py-2 text-xs font-poppins font-medium transition-all duration-200 ease-out hover:translate-x-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-600 ${
                    active
                      ? 'bg-[#4c1d70] font-semibold text-white shadow-md shadow-purple-950/20'
                      : 'text-zinc-600 hover:bg-purple-50 hover:text-[#4c1d70] dark:text-zinc-300 dark:hover:bg-zinc-800/70'
                  }`}
                >
                  <Icon className={`h-[17px] w-[17px] shrink-0 ${active ? 'text-[#f5d626]' : ''}`} aria-hidden="true" />
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#f5d626] animate-pulse" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-slate-200/80 px-3 py-2.5 dark:border-zinc-800">
        <ul className="space-y-0.5">
          <li>
            <button
              type="button"
              onClick={() => onNavigate('settings')}
              className="flex min-h-[38px] w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all duration-200 ease-out hover:translate-x-0.5"
            >
              <UserIcon className="h-[18px] w-[18px]" aria-hidden="true" />
              <span>Learner Profile</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={onLogout}
              className="flex min-h-[38px] w-full items-center gap-3 rounded-xl px-3 py-2 text-sm text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800 transition-all duration-200 ease-out hover:translate-x-0.5"
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