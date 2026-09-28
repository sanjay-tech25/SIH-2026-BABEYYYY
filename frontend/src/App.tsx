import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './pages/Dashboard';
import { Courses } from './pages/Courses';
import { LearningPath } from './pages/LearningPath';
import { Assessments } from './pages/Assessments';
import { CircuitBuilder } from './pages/CircuitBuilder';
import { OpenLab } from './pages/OpenLab';
import { Progress } from './pages/Progress';
import { Achievements } from './pages/Achievements';
import { Profile } from './pages/Profile';
import { Settings } from './pages/Settings';
import { Lesson } from './pages/Lesson';
import { Practice, type PracticeResult } from './pages/Practice';
import { Results } from './pages/Results';
import { Landing } from './pages/Landing';
import { Onboarding } from './pages/Onboarding';
import { AuthModal } from './components/AuthModal';
import { SectionErrorBoundary } from './components/ui/SectionErrorBoundary';
import type { NavId, ViewId } from './data/appData';
import { stateStore, type AppState } from './services/stateStore';
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
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  // Default to 'dashboard' so any visitor lands directly on the greeting "Hello! Shall we start?"
  const [view, setView] = useState<ViewId>(screenInit.view ?? 'dashboard');
  const [navOpen, setNavOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [result, setResult] = useState<PracticeResult | null>(null);
  const [practiceRun, setPracticeRun] = useState(0);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('diagnostic-placement');

  useEffect(() => {
    return stateStore.subscribe(setAppState);
  }, []);

  const dark = appState.settings.dark;

  const go = (id: ViewId) => {
    setView(id);
    setNavOpen(false);
    window.scrollTo({ top: 0 });
  };

  const startPractice = (assessmentId?: string) => {
    setSelectedAssessmentId(assessmentId || 'diagnostic-placement');
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
          onSuccess={(user) => {
            if (user) {
              stateStore.updateUserProfile({
                name: user.name || user.display_name || 'Learner',
                email: user.email || 'learner@quantum.org',
                ageTier: user.age_bracket || 'STUDENT'
              });
            }
            setAuthOpen(false);
            go('path');
          }}
        />
      </div>
    );
  }

  if (view === 'onboarding') {
    return (
      <div className={dark ? 'dark' : undefined}>
        <Onboarding onComplete={() => go('path')} onNavigate={go} />
      </div>
    );
  }

  const renderView = () => {
    switch (view) {
      case 'path':
        return (
          <SectionErrorBoundary sectionName="Curriculum Roadmap" onNavigate={go}>
            <LearningPath onNavigate={go} />
          </SectionErrorBoundary>
        );
      case 'courses':
        return (
          <SectionErrorBoundary sectionName="Course Explorer" onNavigate={go}>
            <Courses onNavigate={go} />
          </SectionErrorBoundary>
        );
      case 'openlab':
        return (
          <SectionErrorBoundary sectionName="Quantum Open Lab" onNavigate={go}>
            <OpenLab />
          </SectionErrorBoundary>
        );
      case 'circuits':
        return (
          <SectionErrorBoundary sectionName="Quantum Circuit Studio" onNavigate={go}>
            <CircuitBuilder />
          </SectionErrorBoundary>
        );
      case 'assessments':
        return (
          <SectionErrorBoundary sectionName="Assessments Hub" onNavigate={go}>
            <Assessments onStartPractice={startPractice} />
          </SectionErrorBoundary>
        );
      case 'progress':
        return (
          <SectionErrorBoundary sectionName="Progress Analytics" onNavigate={go}>
            <Progress onNavigate={go} />
          </SectionErrorBoundary>
        );
      case 'achievements':
        return (
          <SectionErrorBoundary sectionName="Milestones & Badges" onNavigate={go}>
            <Achievements onNavigate={go} />
          </SectionErrorBoundary>
        );
      case 'profile':
        return (
          <SectionErrorBoundary sectionName="Learner Profile & Passport" onNavigate={go}>
            <Profile initialRole="LEARNER" onNavigate={go} />
          </SectionErrorBoundary>
        );
      case 'instructor':
        return (
          <SectionErrorBoundary sectionName="Instructor Dashboard" onNavigate={go}>
            <Profile initialRole="INSTRUCTOR" onNavigate={go} />
          </SectionErrorBoundary>
        );
      case 'settings':
        return (
          <SectionErrorBoundary sectionName="System Settings" onNavigate={go}>
            <Settings
              dark={dark}
              onToggleDark={() => stateStore.toggleDark()}
              onOpenAuth={() => setAuthOpen(true)}
              onLogout={() => go('landing')}
              onNavigate={go}
            />
          </SectionErrorBoundary>
        );
      case 'lesson':
        return (
          <SectionErrorBoundary sectionName="Lesson & Remediation" onNavigate={go}>
            <Lesson onNavigate={go} />
          </SectionErrorBoundary>
        );
      case 'practice':
        return (
          <SectionErrorBoundary sectionName="Adaptive Assessment" onNavigate={go}>
            <Practice
              key={`${practiceRun}-${selectedAssessmentId}`}
              assessmentId={selectedAssessmentId}
              onNavigate={go}
              onFinish={(r) => {
                setResult(r);
                go('results');
              }}
            />
          </SectionErrorBoundary>
        );
      case 'results':
        return (
          <SectionErrorBoundary sectionName="Assessment Results" onNavigate={go}>
            <Results
              result={result ?? sampleResult}
              onNavigate={go}
              onRetry={() => startPractice(selectedAssessmentId)}
            />
          </SectionErrorBoundary>
        );
      case 'dashboard':
      default:
        return (
          <SectionErrorBoundary sectionName="Dashboard" onNavigate={go}>
            <Dashboard onNavigate={go} />
          </SectionErrorBoundary>
        );
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
            onToggleTheme={() => stateStore.toggleDark()}
            onOpenNav={() => setNavOpen(true)}
            onNavigate={go}
          />

          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
            {renderView()}
          </main>
        </div>
      </div>

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={(user) => {
          if (user) {
            stateStore.updateUserProfile({
              name: user.name || user.display_name || 'Learner',
              email: user.email || 'learner@quantum.org',
              ageTier: user.age_bracket || 'STUDENT'
            });
          }
          setAuthOpen(false);
          go('path');
        }}
      />
    </div>
  );
}