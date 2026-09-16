import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { LearningPath } from './pages/LearningPath';
import { Assessments } from './pages/Assessments';
import { Tutor } from './pages/Tutor';
import { CircuitBuilder } from './pages/CircuitBuilder';
import { OpenLab } from './pages/OpenLab';
import { Progress } from './pages/Progress';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { Lesson } from './pages/Lesson';
import { Practice, type PracticeResult } from './pages/Practice';
import { Results } from './pages/Results';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { AuthModal } from './components/AuthModal';
import type { NavId, ViewId } from './data/appData';
// @ts-ignore - platform-generated helper
import { useScreenInit } from './useScreenInit.js';

const sampleResult: PracticeResult = {
  correct: 3,
  total: 4,
  minutes: 6,
  wrongConcepts: ['Interference'],
  rightConcepts: ['Phase gates', 'Bloch sphere', 'Global phase']
};

export function App() {
  const screenInit = useScreenInit() as { view?: ViewId };
  const [view, setView] = useState<ViewId>(screenInit.view ?? 'dashboard');
  const [dark, setDark] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [practiceRun, setPracticeRun] = useState(0);

  const go = (id: ViewId) => {
    setView(id);
    setNavOpen(false);
    window.scrollTo({ top: 0 });
  };

  const startPractice = () => {
    setPracticeRun((n) => n + 1);
    setResult(null);
    go('practice');
  };

  const navCurrent: NavId =
    view === 'lesson'
      ? 'path'
      : view === 'practice' || view === 'results'
      ? 'assessments'
      : (view as NavId);

  // Full-screen public layouts (Landing & Onboarding)
  if (view === 'landing') {
    return (
      <div className={dark ? 'dark' : undefined}>
        <Landing onNavigate={go} onOpenAuth={() => setAuthOpen(true)} />
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={() => {
            setAuthOpen(false);
            go('dashboard');
          }}
        />
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className={dark ? 'dark' : undefined}>
        <Onboarding onComplete={() => go('dashboard')} onNavigate={go} />
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'courses':
        return <Courses onNavigate={go} />;
      case 'path':
        return <LearningPath onNavigate={go} />;
      case 'assessments':
        return <Assessments onStartPractice={startPractice} />;
      case 'tutor':
        return <Tutor />;
      case 'circuits':
        return <CircuitBuilder />;
      case 'openlab':
        return <OpenLab />;
      case 'progress':
        return <Progress />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings dark={dark} onToggleDark={() => setDark((v) => !v)} />;
      case 'lesson':
        return <Lesson onNavigate={go} />;
      case 'practice':
        return (
          <Practice
            key={practiceRun}
            onNavigate={go}
            onFinish={(r) => {
              setResult(r);
              go('results');
            }}
          />
        );
      case 'results':
        return (
          <Results
            result={result ?? sampleResult}
            onNavigate={go}
            onRetry={startPractice}
          />
        );
      default:
        return <Dashboard onNavigate={go} />;
    }
  };

  return (
    <div className={dark ? 'dark' : undefined}>
      <div className="flex min-h-screen w-full bg-zinc-50 font-sans text-body text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
        {/* Desktop navigation */}
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 lg:block">
          <Sidebar current={navCurrent} onNavigate={go} onLogout={() => go('landing')} />
        </aside>

        {/* Mobile navigation */}
        {navOpen && (
          <div className="fixed inset-0 z-40 lg:hidden">
            <div
              className="absolute inset-0 bg-zinc-900/50"
              onClick={() => setNavOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute inset-y-0 left-0 w-72">
              <Sidebar
                current={navCurrent}
                onNavigate={go}
                onLogout={() => go('landing')}
                onClose={() => setNavOpen(false)}
              />
            </div>
          </div>
        )}

        <div className="flex min-w-0 flex-1 flex-col">
          <TopBar
            dark={dark}
            onToggleTheme={() => setDark((v) => !v)}
            onOpenNav={() => setNavOpen(true)}
          />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
            {renderView()}
          </main>
        </div>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          go('dashboard');
        }}
      />
    </div>
  );
}