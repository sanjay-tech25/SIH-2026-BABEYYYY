import React, { useState } from 'react';
import { 
  UserIcon, 
  BookOpenIcon, 
  PaletteIcon, 
  BellIcon, 
  EyeIcon, 
  ShieldIcon, 
  CheckIcon,
  SaveIcon
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PageHeader } from '../components/ui/PageHeader';
import { learner } from '../data/appData';

type SettingsProps = {
  dark: boolean;
  onToggleDark: () => void;
};

export function Settings({ dark, onToggleDark }: SettingsProps) {
  const [activeTab, setActiveTab] = useState<'account' | 'learning' | 'appearance' | 'accessibility'>('account');
  const [name, setName] = useState(learner.name);
  const [email, setEmail] = useState('alex.chen@university.edu');
  const [ageTier, setAgeTier] = useState('STUDENT');
  const [reducedMotion, setReducedMotion] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Settings & Preferences"
        subtitle="Manage your profile, learning cadence, and accessibility options."
      />

      <div className="grid gap-8 lg:grid-cols-12">
        {/* Settings Navigation Tabs */}
        <div className="lg:col-span-3">
          <Card className="space-y-1 p-2">
            {[
              { id: 'account', label: 'Account', icon: UserIcon },
              { id: 'learning', label: 'Learning Goals', icon: BookOpenIcon },
              { id: 'appearance', label: 'Appearance', icon: PaletteIcon },
              { id: 'accessibility', label: 'Accessibility', icon: EyeIcon },
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
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

        {/* Settings Details Card */}
        <div className="lg:col-span-9">
          <Card className="p-6 sm:p-8">
            {activeTab === 'account' && (
              <div className="space-y-6">
                <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Account Information
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
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
                    <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
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

            {activeTab === 'learning' && (
              <div className="space-y-6">
                <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Learning Tier & Cadence
                </h3>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                    Learner Profile Tier
                  </label>
                  <div className="mt-3 grid gap-3 sm:grid-cols-3">
                    {[
                      { id: 'YOUNG', title: 'Young Learner', desc: 'Conceptual analogies & games' },
                      { id: 'STUDENT', title: 'College Student', desc: 'Formal linear algebra & math' },
                      { id: 'ADULT', title: 'Professional', desc: 'Circuit coding & applications' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        type="button"
                        onClick={() => setAgeTier(tier.id)}
                        className={`rounded-xl border p-4 text-left transition-all ${
                          ageTier === tier.id
                            ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
                            : 'border-zinc-200 hover:border-zinc-300 dark:border-zinc-700 dark:hover:border-zinc-600'
                        }`}
                      >
                        <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{tier.title}</p>
                        <p className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">{tier.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Interface Theme
                </h3>
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                      {dark ? 'Dark Mode Active' : 'Light Mode Active'}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Optimized for high-contrast reading and reduced eye strain.
                    </p>
                  </div>
                  <Button onClick={onToggleDark} variant="secondary">
                    Toggle to {dark ? 'Light' : 'Dark'}
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'accessibility' && (
              <div className="space-y-6">
                <h3 className="font-display text-lg font-semibold text-zinc-900 dark:text-zinc-50">
                  Accessibility & Motion
                </h3>
                <div className="flex items-center justify-between rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                  <div>
                    <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Reduced Motion</p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">
                      Disables decorative transitions and instant-folds accordions.
                    </p>
                  </div>
                  <input
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="h-5 w-5 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500 dark:border-zinc-700 dark:bg-zinc-900"
                  />
                </div>
              </div>
            )}

            <div className="mt-8 flex items-center justify-end border-t border-zinc-100 pt-5 dark:border-zinc-800">
              <Button onClick={handleSave} className="min-h-[44px]">
                {saved ? (
                  <>
                    <CheckIcon className="mr-1.5 h-4 w-4 text-emerald-400" />
                    Preferences Saved
                  </>
                ) : (
                  <>
                    <SaveIcon className="mr-1.5 h-4 w-4" />
                    Save Changes
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
