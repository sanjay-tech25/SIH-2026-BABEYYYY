import { useState, useEffect } from 'react';
import {
  LayoutGridIcon,
  BookOpenIcon,
  RouteIcon,
  ClipboardCheckIcon,
  TrendingUpIcon,
  MedalIcon,
  CpuIcon,
  FlaskConicalIcon,
  SettingsIcon,
  LogOutIcon,
  XIcon,
  UserIcon,
  GraduationCapIcon
} from 'lucide-react';
import { ProgressBar } from './ui/ProgressBar';
import type { NavId } from '../data/appData';
import { stateStore, type AppState } from '../services/stateStore';

type NavItem = {
  id: NavId;
  label: string;
  icon: typeof LayoutGridIcon;
  badge?: string;
};

// Streamlined navigation WITHOUT the unwanted "Ask the tutor" tab
const navItems: NavItem[] = [
  { id: 'path', label: 'Curriculum Journey', icon: RouteIcon, badge: 'Start' },
  { id: 'courses', label: 'Course Syllabus', icon: BookOpenIcon },
  { id: 'openlab', label: 'Open Lab Hub', icon: FlaskConicalIcon },
  { id: 'circuits', label: 'Circuit Studio', icon: CpuIcon },
  { id: 'dashboard', label: 'Today’s Hub', icon: LayoutGridIcon },
  { id: 'assessments', label: 'Skill Practice', icon: ClipboardCheckIcon },
  { id: 'progress', label: 'Real Progress', icon: TrendingUpIcon },
  { id: 'achievements', label: 'Milestones', icon: MedalIcon },
  { id: 'profile', label: 'User Profile', icon: UserIcon },
  { id: 'instructor', label: 'Instructor Panel', icon: GraduationCapIcon, badge: 'Faculty' },
  { id: 'settings', label: 'Settings', icon: SettingsIcon }
];

type SidebarProps = {
  current: NavId;
  onNavigate: (id: NavId) => void;
  onLogout?: () => void;
  onClose?: () => void;
};

export function Sidebar({ current, onNavigate, onLogout, onClose }: SidebarProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const p = appState.progress;
  const xpTarget = p.currentLevel * 350;
  const xpPercent = Math.min(100, Math.round((p.totalXP / xpTarget) * 100));

  return (
    <div className="flex h-full flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      {/* Brand Header */}
      <div className="flex items-center justify-between px-5 pb-4 pt-6">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate('path')}>
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
              Quantum Learning
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

      {/* Live Learner Level & Competency Points Card */}
      <div className="px-4 py-2">
        <div className="rounded-xl border border-zinc-200 bg-zinc-50/70 p-3.5 dark:border-zinc-800 dark:bg-zinc-950/40">
          <div className="flex items-center justify-between text-xs">
            <div>
              <span className="font-bold text-zinc-900 dark:text-zinc-100">{appState.user.name}</span>
              <span className="ml-1 text-[10px] text-emerald-600 font-semibold">· Tier {p.currentLevel}</span>
            </div>
            <span className="text-zinc-500 dark:text-zinc-400 font-mono text-[11px]" title="Competency Points">
              {p.totalXP} CP
            </span>
          </div>
          <ProgressBar value={xpPercent} label="Competency progress" className="mt-2" />
        </div>
      </div>

      {/* Main Navigation List */}
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
                  className={`flex min-h-[44px] w-full items-center justify-between rounded-xl px-3.5 text-xs font-semibold transition-colors ${
                    active
                      ? 'bg-emerald-600 font-bold text-white shadow-sm'
                      : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/60 dark:hover:text-zinc-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-white' : 'text-zinc-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && !active && (
                    <span className="rounded bg-emerald-500/15 px-1.5 py-0.2 text-[10px] font-bold text-emerald-700 dark:text-emerald-300">
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer Profile & Logout */}
      <div className="border-t border-zinc-200 p-3 dark:border-zinc-800">
        <div className="flex items-center justify-between rounded-xl p-2">
          <div
            onClick={() => onNavigate('profile')}
            className="flex items-center gap-2.5 truncate cursor-pointer rounded-lg hover:bg-zinc-100 p-1 -m-1 transition dark:hover:bg-zinc-800 flex-1 mr-2"
            title="Open User Profile"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-600 text-xs font-bold text-white shadow-sm">
              {appState.user.name.substring(0, 2).toUpperCase()}
            </span>
            <div className="truncate">
              <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {appState.user.name}
              </p>
              <p className="truncate text-[10px] text-zinc-500 dark:text-zinc-400">
                {appState.user.role === 'INSTRUCTOR' ? 'Faculty Panel' : `${appState.user.ageTier} Tier`}
              </p>
            </div>
          </div>

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              title="Sign out"
              aria-label="Sign out"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
            >
              <LogOutIcon className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}