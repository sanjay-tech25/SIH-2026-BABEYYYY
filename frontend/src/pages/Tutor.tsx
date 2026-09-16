import React, { useState } from 'react';
import { SendIcon, BookOpenIcon, ShieldCheckIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { PageHeader } from '../components/ui/PageHeader';

import { apiClient } from '../services/apiClient';

type Message = {
  id: number;
  from: 'tutor' | 'learner';
  text: string;
};

const quickActions = [
  'Explain this more simply',
  'Give me a hint',
  'Show a worked example',
  'Quiz me on it'
];

const initialMessages: Message[] = [
  {
    id: 1,
    from: 'tutor',
    text: "I'm QUBOT, your AI learning assistant. Ask me anything about quantum gates, state vectors, the Bloch sphere, or quantum circuits."
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
      const reply = await apiClient.chatWithTutor(clean);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'tutor',
          text: reply
        }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          from: 'tutor',
          text: 'A phase gate leaves the measurement probability untouched while rotating the qubit state around the vertical axis of the Bloch sphere.'
        }
      ]);
    } finally {
      setThinking(false);
    }
  };

  return (
    <div className="space-y-8">
      <PageHeader
        title="Ask the tutor"
        subtitle="It only answers from the material in your own courses." />
      

      <Card className="flex h-[560px] flex-col overflow-hidden">
        <div className="flex items-center justify-between gap-4 border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex items-center gap-3">
            <span
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600 text-white"
              aria-hidden="true">
              
              <BookOpenIcon className="h-4 w-4" />
            </span>
            <div>
              <p className="text-body font-medium text-zinc-900 dark:text-zinc-100">
                Course tutor
              </p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Quantum computing fundamentals
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-200 px-2.5 py-1 text-xs text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
            <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Course material only
          </span>
        </div>

        <div
          className="flex-1 space-y-4 overflow-y-auto px-5 py-6"
          role="log"
          aria-live="polite"
          aria-label="Conversation">
          
          {messages.map((m) =>
          <div
            key={m.id}
            className={`max-w-[80%] rounded-2xl px-4 py-3 text-body ${
            m.from === 'tutor' ?
            'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-200' :
            'ml-auto bg-brand-600 text-white'}`
            }>
            
              {m.text}
            </div>
          )}
          {thinking &&
          <p className="text-body text-zinc-500 dark:text-zinc-400">Looking it up…</p>
          }
        </div>

        <div className="border-t border-zinc-200 px-5 py-4 dark:border-zinc-800">
          <div className="flex flex-wrap gap-2" role="group" aria-label="Quick questions">
            {quickActions.map((action) =>
            <button
              key={action}
              type="button"
              onClick={() => send(action)}
              className="min-h-[44px] rounded-xl border border-zinc-200 px-3 text-body text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-800">
              
                {action}
              </button>
            )}
          </div>

          <form
            className="mt-3 flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}>
            
            <label htmlFor="tutor-input" className="sr-only">
              Your question
            </label>
            <input
              id="tutor-input"
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="What does a phase gate actually change?"
              className="h-11 flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-3 text-body text-zinc-900 placeholder:text-zinc-500 focus:border-brand-600 focus:bg-white focus:outline-none focus:ring-1 focus:ring-brand-600 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100" />
            
            <button
              type="submit"
              disabled={!draft.trim() || thinking}
              aria-label="Send question"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-600 text-white hover:bg-brand-700 disabled:opacity-40">
              
              <SendIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </form>
        </div>
      </Card>
    </div>);

}