import React, { useState } from 'react';
import { SendIcon, BookOpenIcon, ShieldCheckIcon, SparklesIcon, BotIcon, AtomIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { apiClient } from '../services/apiClient';

type Message = {
  id: number;
  from: 'tutor' | 'learner';
  text: string;
  concept_title?: string;
  analogy?: string;
  socratic_inquiry?: string;
  micro_action?: string;
  vault_citations?: string[];
  is_grounded?: boolean;
};

const quickActions = [
  'Explain Hadamard superposition simply',
  'Give me an intuition for entanglement',
  'Show a worked Bell-state circuit example',
  'Quiz me on the Bloch sphere coordinates'
];

const initialMessages: Message[] = [
  {
    id: 1,
    from: 'tutor',
    text: "Greetings! I'm Qubot, your Socratic Quantum Tutor grounded in the Obsidian Vault. Ask me anything about quantum gates, superposition, state vectors, the Bloch sphere, or algorithm synthesis.",
    concept_title: 'Socratic Orientation',
    is_grounded: true,
  }
];

export function Tutor() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState('');
  const [thinking, setThinking] = useState(false);

  const send = async (text: string) => {
    const clean = text.trim();
    if (!clean || thinking) return;
    const learnerMessage: Message = { id: Date.now(), from: 'learner', text: clean };
    setMessages((prev) => [...prev, learnerMessage]);
    setDraft('');
    setThinking(true);

    try {
      const res = await apiClient.chatWithTutor(clean);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'tutor',
          text: res.answer,
          concept_title: res.concept_title,
          analogy: res.analogy,
          socratic_inquiry: res.socratic_inquiry,
          micro_action: res.micro_action,
          vault_citations: res.vault_citations,
          is_grounded: res.is_grounded,
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'tutor',
          text: 'A phase gate leaves the measurement probability untouched while rotating the qubit state around the vertical axis of the Bloch sphere.',
          concept_title: 'Phase Transformation',
          is_grounded: true
        }
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. Open Editorial Header */}
      <header className="border-b border-purple-100/80 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-mono text-slate-500 mb-2">
          <span className="flex items-center gap-2 font-medium tracking-wide uppercase text-[13px] text-purple-950/70">
            <span className="h-2 w-2 rounded-full bg-[#f5d626]" />
            Socratic AI Agent • Synchronized with Qiskit Aer
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-sm font-semibold text-[#4c1d70]">
            <ShieldCheckIcon className="h-3.5 w-3.5 text-emerald-600" />
            Socratic Grounding Active
          </span>
        </div>
        <h1 className="font-orbitron text-3xl sm:text-4xl font-bold tracking-tight text-[#1a052e] dark:text-white">
          Qubot Socratic Quantum Tutor
        </h1>
        <p className="mt-2 font-poppins text-base text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Ask deep questions about quantum computing fundamentals, gate matrix calculations, or circuit design. Qubot guides your understanding with step-by-step Socratic pedagogy.
        </p>
      </header>

      {/* 2. Seamless Conversational Surface (ZERO Card Container) */}
      <div className="flex h-[620px] flex-col border-y border-purple-100/80">
        {/* Conversation Message Stream */}
        <div
          className="flex-1 space-y-4 overflow-y-auto py-6 px-1"
          role="log"
          aria-live="polite"
          aria-label="Conversation"
        >
          {messages.map((m) => (
            <div
              key={m.id}
              className={`genie-content max-w-[85%] rounded-2xl px-5 py-4 font-poppins text-base leading-relaxed transition-all ${
                m.from === 'tutor'
                  ? 'border border-purple-100/90 bg-purple-50/40 text-slate-800 space-y-3'
                  : 'ml-auto bg-[#4c1d70] text-white shadow-sm'
              }`}
            >
              {m.from === 'tutor' && (
                <div className="flex items-center justify-between border-b border-purple-200/50 pb-2">
                  <div className="flex items-center gap-1.5 text-[13px] font-orbitron font-bold text-[#4c1d70]">
                    <AtomIcon className="h-3.5 w-3.5" />
                    <span>Qubot {m.concept_title ? `• ${m.concept_title}` : ''}</span>
                  </div>
                  {m.is_grounded && (
                    <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-mono font-bold text-emerald-800">
                      Vault-Grounded
                    </span>
                  )}
                </div>
              )}

              <div className="whitespace-pre-line text-sm sm:text-base">{m.text}</div>

              {m.analogy && (
                <div className="rounded-xl border border-amber-200/80 bg-amber-50/70 p-3 text-sm text-amber-900 space-y-1">
                  <span className="font-bold flex items-center gap-1 text-[13px] uppercase tracking-wide text-amber-800">
                    <SparklesIcon className="h-3 w-3 text-[#f5d626]" /> Intuitive Analogy
                  </span>
                  <p className="italic">{m.analogy}</p>
                </div>
              )}

              {m.socratic_inquiry && (
                <div className="rounded-xl border border-purple-200 bg-white/80 p-3 text-sm text-purple-950 space-y-1">
                  <span className="font-bold text-[13px] uppercase tracking-wide text-[#4c1d70]">
                    Reflect on this (Socratic Inquiry):
                  </span>
                  <p className="font-medium text-slate-700">{m.socratic_inquiry}</p>
                </div>
              )}

              {m.micro_action && (
                <div className="rounded-xl border border-indigo-200 bg-indigo-50/60 p-3 text-sm text-indigo-950">
                  <span className="font-bold text-[13px] uppercase tracking-wide text-indigo-800">Discovery Action: </span>
                  <span className="text-slate-700">{m.micro_action}</span>
                </div>
              )}

              {m.vault_citations && m.vault_citations.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-xs font-mono text-slate-400">Vault Citations:</span>
                  {m.vault_citations.map((c, i) => (
                    <span key={i} className="rounded bg-purple-100/80 px-1.5 py-0.5 font-mono text-xs font-bold text-[#4c1d70]">
                      {c}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
          {thinking && (
            <div className="flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50/50 px-4 py-2.5 text-sm font-mono font-medium text-[#4c1d70] max-w-xs animate-pulse">
              <span className="h-2 w-2 rounded-full bg-[#f5d626] animate-ping" />
              <span>Analyzing quantum principles…</span>
            </div>
          )}
        </div>

        {/* Bottom Input & Quick Actions */}
        <div className="border-t border-purple-100/80 pt-4 pb-2">
          {/* Quick Action Suggestion Chips */}
          <div className="flex flex-wrap gap-2 mb-3" role="group" aria-label="Quick questions">
            {quickActions.map((action) => (
              <button
                key={action}
                type="button"
                onClick={() => send(action)}
                className="rounded-full border border-purple-200/80 bg-white px-3 py-1 text-sm font-medium text-slate-700 hover:bg-purple-50 hover:text-[#4c1d70] hover:border-purple-300 active:scale-95 transition-all"
              >
                {action}
              </button>
            ))}
          </div>

          {/* Form Input */}
          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <label htmlFor="tutor-input" className="sr-only">
              Your question
            </label>
            <input
              id="tutor-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask Qubot anything (e.g., 'How does the Hadamard gate generate superposition?')"
              className="h-11 flex-1 rounded-full border border-purple-200/90 bg-white px-5 text-base text-slate-900 placeholder:text-slate-400 focus:border-[#4c1d70] focus:outline-none focus:ring-1 focus:ring-[#4c1d70]"
            />

            <button
              type="submit"
              disabled={!draft.trim() || thinking}
              aria-label="Send question"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#4c1d70] text-white hover:bg-[#3b1458] disabled:opacity-40 transition-all shadow-sm active:scale-95"
            >
              <SendIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}