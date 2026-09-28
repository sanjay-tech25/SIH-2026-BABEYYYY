import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import {
  FlameIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  ArrowRightIcon,
  UserIcon
} from 'lucide-react';
import { learner, type ViewId } from '../data/appData';

import { GeniePresence } from './ui/GenieMotion';
import { genieStagger } from './ui/useGenieMotion';

interface NavbarProps {
  current: ViewId;
  onNavigate: (id: ViewId) => void;
  dark: boolean;
  onToggleTheme: () => void;
  onOpenOverview: () => void;
}

interface NavItem {
  id: ViewId;
  label: string;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Today' },
  { id: 'courses', label: 'Courses' },
  { id: 'path', label: 'Learning Path' },
  { id: 'circuits', label: 'Circuit Studio' },
  { id: 'openlab', label: 'Open Lab' },
  { id: 'assessments', label: 'Assessments' },
  { id: 'progress', label: 'Progress' },
  { id: 'achievements', label: 'Milestones' },
  { id: 'settings', label: 'Settings' },
];

interface Notification {
  id: string;
  title: string;
  body: string;
  time: string;
}

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
  }
];

export function Navbar({ current, onNavigate, dark, onToggleTheme, onOpenOverview }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLButtonElement>(null);

  const navRef = useRef<HTMLElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, top: 0, width: 0, height: 0 });

  // Measure layout coordinates, so hovering a label cannot move the active pill.
  useLayoutEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const active = nav.querySelector<HTMLButtonElement>('[aria-current="page"]');
    const measure = () => {
      if (!active) return;
      const next = { left: active.offsetLeft, top: active.offsetTop, width: active.offsetWidth, height: active.offsetHeight };
      setIndicator(previous => Object.keys(next).every(key => previous[key as keyof typeof next] === next[key as keyof typeof next]) ? previous : next);
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(nav);
    if (active) observer.observe(active);
    return () => observer.disconnect();
  }, [current]);

  // Close notifications on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getIsActive = (id: ViewId) => {
    if (id === current) return true;
    if (id === 'path' && current === 'lesson') return true;
    if (id === 'assessments' && (current === 'practice' || current === 'results')) return true;
    return false;
  };

  return (
    <header onKeyDown={(event) => { if (event.key === 'Escape') { setShowNotifications(false); setMobileMenuOpen(false); } }} className="navbar-entrance fixed top-2 sm:top-2.5 inset-x-0 z-50 px-2 sm:px-3 lg:px-4 pointer-events-none">
      {/* Grand Floating Frosted Glass Capsule Bar - Spans wide across the full top */}
      <div className="navbar-capsule relative mx-auto w-full max-w-[1960px] pointer-events-auto flex items-center justify-between gap-2.5 sm:gap-4 lg:gap-5 rounded-full border border-purple-300/40 bg-[#1e0a2e]/[0.96] dark:bg-zinc-950/[0.96] backdrop-blur-2xl px-3.5 sm:px-5 lg:px-6 py-1.5 shadow-[0_14px_45px_rgba(76,29,112,0.45)] text-white transition-all h-16 sm:h-[70px]">

        {/* Left: Brand Logo with Glowing Concentric Qubit Orb */}
        <button
          type="button"
          aria-label="Go to Dashboard"
          className="navbar-brand flex items-center gap-2.5 sm:gap-3 cursor-pointer group shrink-0 text-left rounded-full focus:outline-none"
          onClick={() => onNavigate('dashboard')}
          title="Go to Dashboard"
        >
          <div className="relative flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-purple-950 border-2 border-[#f5d626]/60 shadow-[0_0_16px_rgba(245,214,38,0.4)] shrink-0">
            <span className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#f5d626] animate-pulse shadow-[0_0_8px_#f5d626]" />
            <div className="navbar-orbit absolute -inset-1 rounded-full border border-[#f5d626]/30" />
          </div>
          <div className="hidden sm:block leading-tight">
            <div className="text-sm sm:text-base font-bold tracking-wider text-white">
              <span>EGREEN </span>
              <span className="text-[#f5d626]">QUANTA</span>
            </div>
            <span className="hidden min-[1440px]:block text-[9px] sm:text-[10px] font-bold tracking-widest text-purple-300 uppercase mt-0.5">
              AI & Quantum Ecosystem
            </span>
          </div>
        </button>

        {/* Center: Desktop Navigation Links in Inner Capsule Track */}
        <nav ref={navRef} aria-label="Main navigation" className="relative hidden xl:flex items-center gap-0.5 rounded-full p-1 bg-white/[0.06] border border-white/[0.12] text-sm font-serif text-zinc-200 shrink-0">
          <span aria-hidden="true" className="navbar-active-pill" style={{ left: indicator.left, top: indicator.top, width: indicator.width, height: indicator.height, opacity: indicator.width > 0 ? 1 : 0 }} />
          {navItems.map((item) => {
            const active = getIsActive(item.id);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavigate(item.id)}
                aria-current={active ? 'page' : undefined}
                className={`navbar-link relative rounded-full px-2 xl:px-2.5 min-[1680px]:px-3.5 py-1.5 transition-all flex items-center gap-1.5 whitespace-nowrap text-xs xl:text-[12px] min-[1680px]:text-[13px] ${
                  active
                    ? 'text-[#f5d626] font-bold bg-[#f5d626]/20 border border-[#f5d626]/50 shadow-[0_0_12px_rgba(245,214,38,0.25)]'
                    : 'text-zinc-200 hover:text-white hover:bg-white/10'
                }`}
              >
                {active && <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#f5d626] shadow-[0_0_8px_#f5d626]" />}
                <span className="navbar-link-label">
                  {item.id === 'path' ? (
                    <>
                      <span className="hidden min-[1720px]:inline">Learning </span>Path
                    </>
                  ) : item.id === 'circuits' ? (
                    <>
                      <span>Circuit</span>
                      <span className="hidden min-[1720px]:inline"> Studio</span>
                      <span className="min-[1720px]:hidden">s</span>
                    </>
                  ) : (
                    item.label
                  )}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Right: Telemetry, Tools & Quick Actions */}
        <div className="flex items-center justify-end gap-1.5 sm:gap-2 lg:gap-2.5 shrink-0">
          {/* Level / XP Pill Badge (visible on wide displays >= 1680px) */}
          <div className="hidden min-[1680px]:flex items-center gap-1.5 rounded-full border border-purple-400/40 bg-purple-950/70 px-3 py-1 text-xs font-bold text-purple-200">
            <span className="h-2 w-2 rounded-full bg-[#f5d626] shadow-[0_0_6px_#f5d626]" />
            <span>Level {learner.level}</span>
            <span className="hidden 2xl:inline text-zinc-400 font-normal">({learner.xp} XP)</span>
          </div>

          {/* Streak Counter Capsule */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-amber-400/40 bg-amber-950/50 px-2.5 sm:px-3 py-1 text-xs font-semibold text-amber-200">
            <FlameIcon className="h-3.5 w-3.5 text-[#f5d626] fill-[#f5d626]" aria-hidden="true" />
            <span>
              <strong className="font-bold text-[#f5d626]">{learner.streakDays}</strong>d<span className="hidden min-[1400px]:inline"> streak</span>
            </span>
          </div>

          {/* Hairline Divider */}
          <div className="hidden sm:block h-4 w-px bg-white/20 mx-0.5" />

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
            className="navbar-tool flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white transition active:scale-95"
          >
            <span key={String(dark)} className="navbar-icon-swap">{dark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}</span>
          </button>

          {/* Notifications Bell with Dropdown */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setShowNotifications(!showNotifications)}
              ref={bellRef}
              aria-expanded={showNotifications}
              aria-controls="notifications-panel"
              aria-label="Notifications"
              className="navbar-tool navbar-bell relative flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white transition active:scale-95"
            >
              <BellIcon className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#f5d626] ring-2 ring-[#1e0a2e]" />
            </button>

            <GeniePresence open={showNotifications} anchorRef={bellRef} origin="top-right" id="notifications-panel" className="absolute -right-36 sm:right-0 top-full mt-3 w-[min(19rem,calc(100vw-4rem))] sm:w-84 rounded-3xl border border-purple-400/30 bg-zinc-950/95 p-4 shadow-2xl backdrop-blur-2xl z-50 text-left">
              <div className="flex items-center justify-between pb-2.5 border-b border-zinc-800">
                <span className="text-sm font-bold text-white">Notifications</span>
                <span className="text-xs text-[#f5d626] font-bold">{notifications.length} new</span>
              </div>
              <div className="mt-2.5 space-y-2 max-h-64 overflow-y-auto">
                {notifications.map((n) => (
                  <div key={n.id} className="p-2.5 rounded-2xl bg-purple-950/30 hover:bg-purple-900/40 transition border border-purple-900/40">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-zinc-100">{n.title}</span>
                      <span className="text-[10px] text-zinc-400">{n.time}</span>
                    </div>
                    <p className="mt-1 text-xs text-zinc-300 leading-snug">{n.body}</p>
                  </div>
                ))}
              </div>
            </GeniePresence>
          </div>

          {/* User Profile & Verifiable Passport Button */}
          <button
            type="button"
            onClick={() => onNavigate('profile')}
            aria-label="User Profile & Verifiable Passport"
            title="User Profile & Cryptographic Skill Passport"
            className={`navbar-tool flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full transition active:scale-95 ${
              current === 'profile' || current === 'instructor'
                ? 'bg-[#f5d626] text-purple-950 font-bold ring-2 ring-yellow-200'
                : 'text-zinc-300 hover:bg-white/10 hover:text-white'
            }`}
          >
            <UserIcon className="h-4 w-4" />
          </button>

          {/* Platform Overview Button */}
          <button
            type="button"
            onClick={onOpenOverview}
            className="navbar-overview navbar-tool rounded-full bg-[#4c1d70] hover:bg-[#5e238c] border border-purple-400/40 px-3 sm:px-3.5 h-8.5 sm:h-9 text-xs font-bold text-white shadow-[0_0_18px_rgba(76,29,112,0.5)] transition-all active:scale-95 flex items-center gap-1.5 shrink-0"
            title="Return to Public Landing Page"
          >
            <span>Overview</span>
            <ArrowRightIcon className="h-3.5 w-3.5 text-[#f5d626]" />
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="navbar-tool navbar-menu flex h-8.5 w-8.5 sm:h-9 sm:w-9 items-center justify-center rounded-full text-zinc-300 hover:bg-white/10 hover:text-white xl:hidden transition"
            ref={menuRef}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label="Toggle mobile menu"
          >
            <span className="navbar-menu-lines" aria-hidden="true"><span /><span /><span /></span>
          </button>
        </div>
      </div>

      {/* Mobile / Tablet Dropdown Menu */}

        <GeniePresence open={mobileMenuOpen} anchorRef={menuRef} origin="top-right" id="mobile-navigation" className="pointer-events-auto mx-auto w-full max-w-[1880px] max-h-[calc(100dvh-6rem)] overflow-y-auto mt-2 rounded-3xl border border-purple-400/30 bg-[#1e0a2e]/95 backdrop-blur-2xl p-4 sm:p-5 space-y-2 text-xs font-serif text-zinc-200 shadow-2xl xl:hidden">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 pb-2 border-b border-purple-900/60">
            {navItems.map((item, index) => {
              const active = getIsActive(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onNavigate(item.id);
                    setMobileMenuOpen(false);
                  }}
                  style={genieStagger(index)}
                  aria-current={active ? 'page' : undefined}
                  className={`navbar-mobile-link flex items-center gap-2 px-3 py-2 rounded-xl text-left transition ${
                    active
                      ? 'bg-white/20 text-[#f5d626] font-semibold'
                      : 'hover:bg-white/10 text-zinc-300'
                  }`}
                >
                  {active && <span className="h-1.5 w-1.5 rounded-full bg-[#f5d626]" />}
                  <span className="font-poppins">{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-[11px]">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-purple-950 px-2.5 py-1 text-purple-200 font-orbitron font-bold border border-purple-800">
                Level {learner.level}
              </span>
              <span className="rounded-full bg-amber-950 px-2.5 py-1 text-amber-300 font-poppins font-semibold border border-amber-900">
                🔥 {learner.streakDays}d streak
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                onOpenOverview();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-orbitron font-bold text-[#f5d626] hover:underline"
            >
              Public Landing ➔
            </button>
          </div>
        </GeniePresence>
    </header>
  );
}
