import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  BookOpenIcon, 
  PaletteIcon, 
  EyeIcon, 
  CheckIcon,
  SaveIcon,
  RotateCcwIcon,
  AlertTriangleIcon,
  LogOutIcon,
  LogInIcon,
  ShieldCheckIcon,
  Volume2Icon,
  VolumeXIcon,
  SlidersIcon,
  SparklesIcon,
  LayersIcon,
  DownloadIcon,
  CloudIcon,
  CloudOffIcon,
  CpuIcon,
  SunIcon,
  MoonIcon,
  BellIcon,
  KeyIcon,
  CheckCircle2Icon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { stateStore, type AppState, type AgeTier } from '../services/stateStore';
import type { ViewId } from '../data/appData';

interface SettingsProps {
  dark: boolean;
  onToggleDark: () => void;
  onOpenAuth?: () => void;
  onLogout?: () => void;
  onNavigate?: (id: ViewId) => void;
}

type SettingsTab = 'account' | 'personalisation' | 'customization' | 'audio' | 'data';

export function Settings({ dark, onToggleDark, onOpenAuth, onLogout, onNavigate }: SettingsProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  
  // Account Form State
  const [name, setName] = useState(appState.user.name);
  const [email, setEmail] = useState(appState.user.email);
  const [institution, setInstitution] = useState(appState.user.institution || '');
  const [department, setDepartment] = useState(appState.user.department || '');
  const [learningGoal, setLearningGoal] = useState(appState.user.learningGoal || '');

  // Personalisation State
  const [ageTier, setAgeTier] = useState<AgeTier>(appState.user.ageTier);
  const [mascotPersonality, setMascotPersonality] = useState(appState.settings.mascotPersonality || 'socratic');
  const [defaultFramework, setDefaultFramework] = useState(appState.settings.defaultFramework || 'qiskit');
  const [dailyGoalMinutes, setDailyGoalMinutes] = useState(appState.settings.dailyGoalMinutes || 25);
  const [studyReminders, setStudyReminders] = useState(appState.settings.studyReminders ?? true);

  // Customization & Appearance State
  const [accentColor, setAccentColor] = useState(appState.settings.accentColor || 'emerald');
  const [blochQuality, setBlochQuality] = useState(appState.settings.blochQuality || 'high');
  const [autoRotateBloch, setAutoRotateBloch] = useState(appState.settings.autoRotateBloch ?? true);
  const [defaultShots, setDefaultShots] = useState(appState.settings.defaultShots || 1024);
  const [highContrast, setHighContrast] = useState(appState.settings.highContrast ?? false);
  const [reducedMotion, setReducedMotion] = useState(appState.settings.reducedMotion);

  // Audio & Feedback State
  const [soundEnabled, setSoundEnabled] = useState(appState.settings.soundEnabled ?? true);
  const [audioVolume, setAudioVolume] = useState(appState.settings.audioVolume ?? 80);

  // Cloud & Data
  const [cloudSync, setCloudSync] = useState(appState.settings.cloudSync ?? true);
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    return stateStore.subscribe((s) => {
      setAppState(s);
    });
  }, []);

  const handleSave = () => {
    stateStore.updateUserProfile({
      name,
      email,
      ageTier,
      institution,
      department,
      learningGoal
    });
    stateStore.updateSettings({
      reducedMotion,
      soundEnabled,
      audioVolume,
      accentColor: accentColor as any,
      defaultFramework: defaultFramework as any,
      blochQuality: blochQuality as any,
      autoRotateBloch,
      defaultShots,
      dailyGoalMinutes,
      studyReminders,
      cloudSync,
      highContrast,
      mascotPersonality: mascotPersonality as any
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetProgress = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    stateStore.resetAllProgress();
    setConfirmReset(false);
    if (onNavigate) onNavigate('path');
  };

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(appState, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `qubot_portfolio_${appState.user.name.toLowerCase().replace(/\s+/g, '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings & Platform Preferences"
        subtitle="Manage authentication, customized aesthetic themes, learner personas, and simulation settings."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <Card className="space-y-1 p-2">
            {[
              { id: 'account', label: 'Account & Login', icon: UserIcon },
              { id: 'personalisation', label: 'Personalisation & Persona', icon: BookOpenIcon },
              { id: 'customization', label: 'Appearance & Visuals', icon: PaletteIcon },
              { id: 'audio', label: 'Audio & Sensory Feedback', icon: Volume2Icon },
              { id: 'data', label: 'Data, Privacy & Reset', icon: EyeIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as SettingsTab)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-emerald-500/10 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400 font-bold border border-emerald-500/20'
                      : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </Card>

          {/* Quick Session Status Card */}
          <div className="mt-4 rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-600 font-display font-bold text-white shadow-sm">
                {appState.user.name.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-semibold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                  {appState.user.name}
                </p>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 truncate">
                  {appState.user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-100 dark:border-zinc-800">
              <span className="text-zinc-500">Role:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400 font-mono">
                {appState.user.role}
              </span>
            </div>

            <div className="flex gap-2 pt-1">
              {onOpenAuth && (
                <button
                  type="button"
                  onClick={onOpenAuth}
                  className="flex-1 rounded-lg border border-zinc-300 dark:border-zinc-700 px-2 py-1.5 text-[11px] font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center justify-center gap-1 transition"
                >
                  <LogInIcon className="h-3 w-3" />
                  <span>Switch</span>
                </button>
              )}

              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="flex-1 rounded-lg border border-rose-500/30 bg-rose-500/10 px-2 py-1.5 text-[11px] font-semibold text-rose-700 dark:text-rose-400 hover:bg-rose-500/20 flex items-center justify-center gap-1 transition"
                >
                  <LogOutIcon className="h-3 w-3" />
                  <span>Logout</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Settings Panel */}
        <div className="lg:col-span-9">
          <Card className="p-6 sm:p-8">
            {/* 1. Account & Authentication Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 dark:border-zinc-800 pb-4">
                  <div>
                    <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                      Account Profile & Authentication
                    </h3>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                      Manage your personal profile, academic credentials, and session authentication.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenAuth && (
                      <Button
                        variant="secondary"
                        onClick={onOpenAuth}
                        className="text-xs h-9 flex items-center gap-1.5"
                      >
                        <LogInIcon className="h-3.5 w-3.5 text-emerald-600" />
                        <span>Sign In / Switch User</span>
                      </Button>
                    )}

                    {onLogout && (
                      <Button
                        variant="secondary"
                        onClick={onLogout}
                        className="text-xs h-9 text-rose-600 hover:text-rose-700 dark:text-rose-400 hover:bg-rose-500/10 border-rose-500/30 flex items-center gap-1.5"
                      >
                        <LogOutIcon className="h-3.5 w-3.5" />
                        <span>Logout Session</span>
                      </Button>
                    )}
                  </div>
                </div>

                {/* Account Details Form */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Display Name
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Institution / University
                    </label>
                    <input
                      type="text"
                      value={institution}
                      onChange={(e) => setInstitution(e.target.value)}
                      placeholder="e.g. Department of Physics, IIT Madras"
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Department / Lab
                    </label>
                    <input
                      type="text"
                      value={department}
                      onChange={(e) => setDepartment(e.target.value)}
                      placeholder="e.g. Center for Quantum Information"
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Personal Learning / Research Goal
                    </label>
                    <textarea
                      value={learningGoal}
                      onChange={(e) => setLearningGoal(e.target.value)}
                      rows={2}
                      placeholder="Describe what you aim to master (e.g. NISQ algorithms, VQE optimization, Quantum Teleportation protocols)..."
                      className="mt-1.5 w-full rounded-xl border border-zinc-200 bg-white p-3 text-sm text-zinc-900 focus:border-emerald-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-100"
                    />
                  </div>
                </div>

                {/* Cloud Sync Status */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40">
                  <div className="flex items-center gap-3">
                    <CloudIcon className="h-5 w-5 text-emerald-500" />
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                        Cloud Telemetry Synchronization
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Automatically persists Bayesian mastery, circuit ASTs, and quiz scores to the backend database.
                      </p>
                    </div>
                  </div>

                  <input
                    type="checkbox"
                    checked={cloudSync}
                    onChange={(e) => setCloudSync(e.target.checked)}
                    className="h-5 w-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
              </div>
            )}

            {/* 2. Personalisation & Learning Persona Tab */}
            {activeTab === 'personalisation' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Learner Profile Tier & Mathematical Cadence
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Directly transforms the teaching style, analogies, and mathematical complexity in every chapter.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  {[
                    {
                      id: 'YOUNG' as AgeTier,
                      title: 'Young Learner',
                      badge: 'Conceptual & Visual',
                      desc: 'Focuses on intuitive real-world analogies (spinning coins, light switches) and playful explanations.'
                    },
                    {
                      id: 'STUDENT' as AgeTier,
                      title: 'College Student',
                      badge: 'Formal Math & Physics',
                      desc: 'Emphasizes linear algebra matrices, Dirac bra-ket notation, and rigorous quantum mechanics.'
                    },
                    {
                      id: 'ADULT' as AgeTier,
                      title: 'Working Professional',
                      badge: 'Code & Applications',
                      desc: 'Emphasizes Python Qiskit programming, algorithm execution, and practical hardware limits.'
                    }
                  ].map((tier) => (
                    <button
                      key={tier.id}
                      type="button"
                      onClick={() => setAgeTier(tier.id)}
                      className={`rounded-2xl border p-5 text-left transition ${
                        ageTier === tier.id
                          ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500 shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-800 dark:hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                          {tier.title}
                        </span>
                        {ageTier === tier.id && (
                          <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        )}
                      </div>
                      <span className="mt-1 inline-block rounded bg-zinc-200 px-2 py-0.5 text-[10px] font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                        {tier.badge}
                      </span>
                      <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
                        {tier.desc}
                      </p>
                    </button>
                  ))}
                </div>

                {/* Socratic Mascot Companion Persona */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <SparklesIcon className="h-4 w-4 text-emerald-500" />
                    QUBOT Companion Guidance Style
                  </h4>
                  
                  <div className="grid gap-3 sm:grid-cols-4">
                    {[
                      { id: 'socratic', name: 'Socratic Coach', desc: 'Asks probing conceptual questions before giving hints.' },
                      { id: 'rigorous', name: 'Academic Rigor', desc: 'Provides mathematical proofs, theorems, and Dirac derivations.' },
                      { id: 'supportive', name: 'Encouraging', desc: 'Offers step-by-step scaffolding and celebrating milestones.' },
                      { id: 'silent', name: 'Silent / Minimal', desc: 'Suppresses spontaneous hints for independent research.' }
                    ].map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setMascotPersonality(m.id as any)}
                        className={`rounded-xl border p-3.5 text-left transition ${
                          mascotPersonality === m.id
                            ? 'border-emerald-500 bg-emerald-500/10 font-medium'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700'
                        }`}
                      >
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{m.name}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{m.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Default Quantum Target Framework */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <CpuIcon className="h-4 w-4 text-emerald-500" />
                    Default Coding Framework for Labs & Studios
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {[
                      { id: 'qiskit', name: 'IBM Qiskit 1.0+', desc: 'Python SDK with Aer & Runtime Primitives' },
                      { id: 'cirq', name: 'Google Cirq', desc: 'NISQ framework for Sycamore processors' },
                      { id: 'pennylane', name: 'Xanadu PennyLane', desc: 'Differentiable quantum machine learning' },
                      { id: 'openqasm', name: 'OpenQASM 3.0', desc: 'Vendor-neutral hardware assembly' }
                    ].map((fw) => (
                      <button
                        key={fw.id}
                        type="button"
                        onClick={() => setDefaultFramework(fw.id as any)}
                        className={`rounded-xl border p-3.5 text-left transition ${
                          defaultFramework === fw.id
                            ? 'border-emerald-500 bg-emerald-500/10 font-medium'
                            : 'border-zinc-200 dark:border-zinc-800 hover:border-zinc-300'
                        }`}
                      >
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">{fw.name}</p>
                        <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1">{fw.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Study Cadence */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                      Daily Study Target Goal
                    </h4>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Powers your streak calculations and pacing alerts.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {[10, 25, 45, 60].map((mins) => (
                      <button
                        key={mins}
                        type="button"
                        onClick={() => setDailyGoalMinutes(mins)}
                        className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition ${
                          dailyGoalMinutes === mins
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200'
                        }`}
                      >
                        {mins}m / day
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 3. Customization & UI Aesthetics Tab */}
            {activeTab === 'customization' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Theme Engine & Visual Customization
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Tailor color palettes, dark mode, high-contrast, and 3D visualizer fidelity.
                  </p>
                </div>

                {/* Dark Mode Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-5 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900/40">
                  <div className="flex items-center gap-3">
                    {dark ? <MoonIcon className="h-5 w-5 text-indigo-400" /> : <SunIcon className="h-5 w-5 text-amber-500" />}
                    <div>
                      <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                        {dark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
                      </p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                        High-contrast dark mode optimized for long quantum circuit design sessions.
                      </p>
                    </div>
                  </div>

                  <Button onClick={onToggleDark} variant="secondary" className="text-xs h-9">
                    Switch to {dark ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>

                {/* Accent Color Palette */}
                <div className="space-y-3 pt-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
                    Interface Accent Color
                  </label>
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: 'emerald', label: 'Quantum Emerald', color: '#10b981' },
                      { id: 'indigo', label: 'Electric Indigo', color: '#6366f1' },
                      { id: 'cyan', label: 'Neon Cyan', color: '#06b6d4' },
                      { id: 'violet', label: 'Galactic Violet', color: '#8b5cf6' },
                      { id: 'amber', label: 'Solar Amber', color: '#f59e0b' }
                    ].map((col) => (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => setAccentColor(col.id as any)}
                        className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          accentColor === col.id
                            ? 'border-zinc-900 bg-zinc-100 dark:border-white dark:bg-zinc-800 shadow-sm ring-1 ring-emerald-500'
                            : 'border-zinc-200 hover:bg-zinc-50 dark:border-zinc-800 dark:hover:bg-zinc-800'
                        }`}
                      >
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: col.color }} />
                        <span>{col.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3D Bloch Sphere Visualizer Controls */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-600 dark:text-zinc-400 flex items-center gap-1.5">
                    <LayersIcon className="h-4 w-4 text-emerald-500" />
                    3D Bloch Sphere & Simulator Fidelity
                  </h4>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3.5 dark:border-zinc-800">
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Auto-Rotate Statevectors</p>
                        <p className="text-[11px] text-zinc-500">Smooth kinetic 3D rotation on canvas</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={autoRotateBloch}
                        onChange={(e) => setAutoRotateBloch(e.target.checked)}
                        className="h-4 w-4 rounded text-emerald-600"
                      />
                    </div>

                    <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-3.5 dark:border-zinc-800">
                      <div>
                        <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">High Contrast Mode</p>
                        <p className="text-[11px] text-zinc-500">Maximizes wire & text readability</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={highContrast}
                        onChange={(e) => setHighContrast(e.target.checked)}
                        className="h-4 w-4 rounded text-emerald-600"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                      Default Simulator Shots:
                    </span>
                    <div className="flex gap-2">
                      {[512, 1024, 2048, 4096].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setDefaultShots(s)}
                          className={`rounded-lg px-2.5 py-1 text-xs font-mono font-semibold transition ${
                            defaultShots === s
                              ? 'bg-emerald-600 text-white'
                              : 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300'
                          }`}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 4. Audio & Sensory Feedback Tab */}
            {activeTab === 'audio' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Audio & Sensory Micro-Cues
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Manage auditory feedback on quantum circuit state collapse, quiz completion, and study streaks.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <div className="flex items-center gap-3">
                    {soundEnabled ? <Volume2Icon className="h-5 w-5 text-emerald-500" /> : <VolumeXIcon className="h-5 w-5 text-zinc-400" />}
                    <div>
                      <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Auditory Micro-Cues</p>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">
                        Plays subtle sound pulses on gate placement, superposition collapse, and level ups.
                      </p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={soundEnabled}
                    onChange={(e) => setSoundEnabled(e.target.checked)}
                    className="h-5 w-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>

                {soundEnabled && (
                  <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-800 space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-zinc-700 dark:text-zinc-300">Master Sound Volume</span>
                      <span className="text-emerald-500 font-mono">{audioVolume}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={audioVolume}
                      onChange={(e) => setAudioVolume(Number(e.target.value))}
                      className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer dark:bg-zinc-800 accent-emerald-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* 5. Data, Privacy & Reset Tab */}
            {activeTab === 'data' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Data Portfolio & Danger Zone
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Export your verifiable learning portfolio or reset curriculum progression.
                  </p>
                </div>

                {/* Export Portfolio */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Export Learning Telemetry</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Download full cryptographically verifiable JSON portfolio of your completed topics, labs, and scores.
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    onClick={handleExportData}
                    className="text-xs h-9 flex items-center gap-1.5 shrink-0"
                  >
                    <DownloadIcon className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Export JSON Portfolio</span>
                  </Button>
                </div>

                {/* Reduced Motion Toggle */}
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Reduced Motion</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Minimizes animations, transitions, and pulsing indicator lights.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="h-5 w-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>

                {/* Reset Progress Danger Zone */}
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-5 dark:border-rose-500/20 dark:bg-rose-950/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangleIcon className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-rose-800 dark:text-rose-300">
                        Reset Learning Journey
                      </h4>
                      <p className="text-xs text-rose-700 dark:text-rose-400 mt-1">
                        Clears all completed topics, practical lab records, and resets curriculum progress back to Chapter 1.
                      </p>
                      <Button
                        variant="secondary"
                        onClick={handleResetProgress}
                        className={`mt-3 text-xs h-9 ${confirmReset ? 'bg-rose-600 text-white hover:bg-rose-700 border-none' : 'border-rose-500/40 text-rose-700 dark:text-rose-300'}`}
                      >
                        <RotateCcwIcon className="mr-1.5 h-3.5 w-3.5" />
                        {confirmReset ? 'Confirm: Reset All Progress Now' : 'Reset All Progress to Chapter 1'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Footer */}
            <div className="mt-8 flex items-center justify-end border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <Button onClick={handleSave} className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white font-semibold">
                {saved ? (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Preferences Saved Successfully!
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save & Apply Preferences
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
