import { useState, useEffect } from 'react';
import { 
  UserIcon, 
  BookOpenIcon, 
  PaletteIcon, 
  EyeIcon, 
  CheckIcon,
  SaveIcon,
  RotateCcwIcon,
  AlertTriangleIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { stateStore, type AppState, type AgeTier } from '../services/stateStore';

interface SettingsProps {
  dark: boolean;
  onToggleDark: () => void;
}

export function Settings({ dark, onToggleDark }: SettingsProps) {
  const [appState, setAppState] = useState<AppState>(stateStore.getState());
  const [activeTab, setActiveTab] = useState<'account' | 'learning' | 'appearance' | 'accessibility'>('account');
  const [name, setName] = useState(appState.user.name);
  const [email, setEmail] = useState(appState.user.email);
  const [ageTier, setAgeTier] = useState<AgeTier>(appState.user.ageTier);
  const [reducedMotion, setReducedMotion] = useState(appState.settings.reducedMotion);
  const [saved, setSaved] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  useEffect(() => {
    return stateStore.subscribe((s) => {
      setAppState(s);
      setName(s.user.name);
      setEmail(s.user.email);
      setAgeTier(s.user.ageTier);
      setReducedMotion(s.settings.reducedMotion);
    });
  }, []);

  const handleSave = () => {
    stateStore.updateUserProfile({
      name,
      email,
      ageTier
    });
    stateStore.updateSettings({
      reducedMotion
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
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings & Platform Preferences"
        subtitle="Configure your profile, learning cadence tier, and interface preferences with instant persistence."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-3">
          <Card className="space-y-1 p-2">
            {[
              { id: 'account', label: 'Account Profile', icon: UserIcon },
              { id: 'learning', label: 'Learner Tier & Cadence', icon: BookOpenIcon },
              { id: 'appearance', label: 'Theme & Appearance', icon: PaletteIcon },
              { id: 'accessibility', label: 'Accessibility & Reset', icon: EyeIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    isSelected
                      ? 'bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white'
                      : 'text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-800/50'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isSelected ? 'text-emerald-500' : 'text-zinc-400'}`} />
                  {tab.label}
                </button>
              );
            })}
          </Card>
        </div>

        {/* Main Settings Panel */}
        <div className="lg:col-span-9">
          <Card className="p-6 sm:p-8">
            {/* Account Profile Tab */}
            {activeTab === 'account' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Account Profile
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Updates your displayed username across navigation, top bar, and certificates.
                  </p>
                </div>

                <div className="space-y-4 max-w-md">
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
                </div>
              </div>
            )}

            {/* Learner Tier & Cadence Tab */}
            {activeTab === 'learning' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Learner Profile Tier
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
              </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Theme & Styling
                  </h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    Toggle high-contrast dark mode to reduce eye strain during extended study sessions.
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-5 dark:border-zinc-700">
                  <div>
                    <p className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                      {dark ? 'Dark Mode (Active)' : 'Light Mode (Active)'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                      Switching themes applies instantly to the entire interface.
                    </p>
                  </div>

                  <Button onClick={onToggleDark} variant="secondary" className="text-xs h-9">
                    Switch to {dark ? 'Light Mode' : 'Dark Mode'}
                  </Button>
                </div>
              </div>
            )}

            {/* Accessibility & Danger Zone Tab */}
            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
                    Accessibility & Data Management
                  </h3>
                </div>

                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-800">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Reduced Motion</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Minimizes animations and transitions.
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
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-5 dark:border-red-500/20 dark:bg-red-950/20">
                  <div className="flex items-start gap-3">
                    <AlertTriangleIcon className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-red-800 dark:text-red-300">
                        Reset Learning Journey
                      </h4>
                      <p className="text-xs text-red-700 dark:text-red-400 mt-1">
                        Clears all completed topics, practical lab records, and resets curriculum progress back to Chapter 1.
                      </p>
                      <Button
                        variant="secondary"
                        onClick={handleResetProgress}
                        className={`mt-3 text-xs h-9 ${confirmReset ? 'bg-red-600 text-white hover:bg-red-700' : ''}`}
                      >
                        <RotateCcwIcon className="mr-1.5 h-3.5 w-3.5" />
                        {confirmReset ? 'Click Again to Confirm Reset' : 'Reset All Progress to Chapter 1'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button Footer */}
            <div className="mt-8 flex items-center justify-end border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <Button onClick={handleSave} className="min-h-[44px] bg-emerald-600 hover:bg-emerald-700 text-white">
                {saved ? (
                  <>
                    <CheckIcon className="mr-2 h-4 w-4" />
                    Settings Saved Successfully!
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-2 h-4 w-4" />
                    Save & Apply Changes
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
