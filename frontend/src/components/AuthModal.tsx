import React, { useState } from 'react';
import { XIcon, LockIcon, MailIcon, UserIcon, ArrowRightIcon } from 'lucide-react';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { apiClient } from '../services/apiClient';

type AuthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: any) => void;
};

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('alex.chen@university.edu');
  const [password, setPassword] = useState('quantumPass123!');
  const [name, setName] = useState('Alex Chen');
  const [ageBracket, setAgeBracket] = useState('STUDENT');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const res = await apiClient.login(email, password);
        onSuccess(res.user);
      } else {
        const res = await apiClient.register(email, password, name, ageBracket);
        onSuccess(res.user);
      }
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication error. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md">
        <Card className="border-zinc-800 bg-zinc-900 p-6 text-zinc-100 shadow-2xl">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-600 font-display text-xs font-bold text-white">
                QB
              </span>
              <h3 className="font-display text-base font-semibold text-white">
                {mode === 'login' ? 'Sign in to QUBOT' : 'Create your account'}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </div>

          {error && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {mode === 'signup' && (
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
                  Full Name
                </label>
                <div className="mt-1.5 flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2">
                  <UserIcon className="h-4 w-4 text-zinc-500" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="ml-2.5 w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                    placeholder="Jane Doe"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Email Address
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2">
                <MailIcon className="h-4 w-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="ml-2.5 w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium uppercase tracking-wider text-zinc-400">
                Password
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2">
                <LockIcon className="h-4 w-4 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="ml-2.5 w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full min-h-[44px] justify-center mt-2">
              {loading ? 'Authenticating...' : mode === 'login' ? 'Sign In' : 'Create Account'}
              <ArrowRightIcon className="ml-1.5 h-4 w-4" />
            </Button>
          </form>

          <div className="mt-5 text-center text-xs text-zinc-400">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-semibold text-emerald-400 hover:underline"
                >
                  Sign up
                </button>
              </span>
            ) : (
              <span>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-semibold text-emerald-400 hover:underline"
                >
                  Sign in
                </button>
              </span>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
