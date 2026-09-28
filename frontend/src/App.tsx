import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { LearningPath } from './pages/LearningPath';
import { Assessments } from './pages/Assessments';
import { CircuitBuilder } from './pages/CircuitBuilder';
import { OpenLab } from './pages/OpenLab';
import { Progress } from './pages/Progress';
import { Achievements } from './pages/Achievements';
import { Settings } from './pages/Settings';
import { Profile } from './pages/Profile';
import { Lesson } from './pages/Lesson';
import { Practice, type PracticeResult } from './pages/Practice';
import { Results } from './pages/Results';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { AuthModal } from './components/AuthModal';
import { GenieMotionProvider } from './components/ui/GenieMotion';
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
  return <GenieMotionProvider><AppViews /></GenieMotionProvider>;
}

function AppViews() {
  const screenInit = useScreenInit() as { view?: ViewId };
  const urlView = typeof window !== 'undefined' ? (new URLSearchParams(window.location.search).get('view') as ViewId | null) : null;
  const [view, setView] = useState<ViewId>(urlView ?? screenInit.view ?? 'dashboard');
  const [dark, setDark] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [practiceRun, setPracticeRun] = useState(0);

  const go = (id: ViewId) => {
    setView(id);
    window.scrollTo({ top: 0 });
  };

  const startPractice = () => {
    setPracticeRun((n) => n + 1);
    setResult(null);
    go('practice');
  };

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
      case 'circuits':
        return <CircuitBuilder />;
      case 'openlab':
        return <OpenLab />;
      case 'progress':
        return <Progress />;
      case 'achievements':
        return <Achievements />;
      case 'settings':
        return <Settings dark={dark} onToggleDark={() => setDark((v) => !v)} onNavigate={go} />;
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
      case 'profile':
        return <Profile initialRole="LEARNER" onNavigate={go} />;
      case 'instructor':
        return <Profile initialRole="INSTRUCTOR" onNavigate={go} />;
      default:
        return <Dashboard onNavigate={go} />;
    }
  };

  return (
    <div className={dark ? 'dark' : undefined}>
      <div className="min-h-screen w-full bg-[#fafafa] font-serif text-body text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex flex-col">
        {/* Floating Capsule Navbar for Main Pages */}
        <Navbar
          current={view}
          onNavigate={go}
          dark={dark}
          onToggleTheme={() => setDark((v) => !v)}
          onOpenOverview={() => go('landing')}
        />

        <main className="mx-auto w-full max-w-[1680px] min-w-0 flex-1 px-4 pt-28 pb-32 sm:px-6 sm:pt-32 sm:pb-32 lg:px-10 lg:pt-36 lg:pb-36">
          <div key={view} className="genie-page">
            {renderView()}
          </div>
        </main>
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
