import React, { useState } from 'react';
import { BarChart3Icon, ZapIcon, InfoIcon, DownloadIcon } from 'lucide-react';

interface HistogramChartProps {
  counts: Record<string, number>;
  shots: number;
  executionTimeMs?: number;
  backend?: string;
  xpEarned?: number;
}

export function HistogramChart({
  counts,
  shots,
  executionTimeMs,
  backend = 'Qiskit Aer Simulator',
  xpEarned = 50,
}: HistogramChartProps) {
  const [viewMode, setViewMode] = useState<'percentage' | 'counts'>('percentage');
  const [hoveredState, setHoveredState] = useState<string | null>(null);

  const entries = Object.entries(counts || {});
  const totalShots = shots || 1024;
  const maxCount = Math.max(...entries.map(([_, c]) => Number(c)), 1);

  // Sort states numerically (e.g. 00, 01, 10, 11)
  const sortedEntries = [...entries].sort(([a], [b]) => a.localeCompare(b));

  return (
    <div className="rounded-2xl border border-zinc-200/80 bg-zinc-950 p-6 text-white shadow-xl dark:border-zinc-800">
      {/* Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
            <BarChart3Icon className="h-4 w-4" />
          </div>
          <div>
            <h4 className="font-display text-sm font-bold tracking-wide text-zinc-100">
              Measurement Histogram Distribution Graph
            </h4>
            <p className="text-[11px] text-zinc-400">
              {totalShots.toLocaleString()} Shots • {executionTimeMs ? `${executionTimeMs} ms` : 'Local Aer'}
            </p>
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg bg-zinc-900 p-0.5 border border-zinc-800">
            <button
              type="button"
              onClick={() => setViewMode('percentage')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'percentage'
                  ? 'bg-emerald-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Probabilities (%)
            </button>
            <button
              type="button"
              onClick={() => setViewMode('counts')}
              className={`rounded-md px-2.5 py-1 text-xs font-semibold transition-all ${
                viewMode === 'counts'
                  ? 'bg-emerald-500 text-zinc-950 shadow'
                  : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Raw Counts
            </button>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Graph Canvas */}
      <div className="relative mt-6 pt-4">
        {/* Y-Axis Grid Lines & Labels */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-12 pr-4 text-[10px] font-mono text-zinc-600">
          {[1.0, 0.75, 0.5, 0.25, 0].map((level) => (
            <div key={level} className="relative flex items-center w-full">
              <span className="w-10 shrink-0 text-right pr-2">
                {viewMode === 'percentage' ? `${Math.round(level * 100)}%` : Math.round(level * maxCount)}
              </span>
              <div className="h-px w-full bg-zinc-800/60" />
            </div>
          ))}
        </div>

        {/* Vertical Bars Container */}
        <div className="relative flex items-end justify-around h-64 pl-12 pr-4 pb-12">
          {sortedEntries.map(([state, count]) => {
            const numCount = Number(count);
            const pct = (numCount / totalShots) * 100;
            const barHeightPct = Math.max((numCount / maxCount) * 100, 4);
            const isHovered = hoveredState === state;

            return (
              <div
                key={state}
                className="group relative flex flex-col items-center justify-end h-full flex-1 max-w-[72px] mx-1.5 cursor-pointer"
                onMouseEnter={() => setHoveredState(state)}
                onMouseLeave={() => setHoveredState(null)}
              >
                {/* Floating Percentage Badge above column */}
                <span
                  className={`mb-2 font-mono text-xs font-bold transition-all duration-300 ${
                    isHovered
                      ? 'text-emerald-300 scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                      : 'text-zinc-300'
                  }`}
                >
                  {viewMode === 'percentage' ? `${pct.toFixed(1)}%` : numCount}
                </span>

                {/* 3D Glassmorphism Column Bar */}
                <div className="relative w-full overflow-hidden rounded-t-xl bg-zinc-900/60 border-t border-x border-emerald-500/30 transition-all duration-300 group-hover:border-emerald-400">
                  {/* Glowing vertical bar fill with animation */}
                  <div
                    className={`w-full rounded-t-lg bg-gradient-to-t transition-all duration-700 ease-out ${
                      isHovered
                        ? 'from-emerald-600 via-teal-400 to-cyan-300 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                        : 'from-emerald-700 via-emerald-500 to-teal-400'
                    }`}
                    style={{ height: `${barHeightPct * 1.8}px` }}
                  >
                    {/* Glowing Top Cap */}
                    <div className="h-1.5 w-full bg-white/80 shadow-[0_0_10px_#ffffff]" />
                  </div>
                </div>

                {/* X-Axis State Label */}
                <div className="absolute -bottom-8 flex flex-col items-center">
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded transition-all ${
                      isHovered
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                        : 'text-zinc-400'
                    }`}
                  >
                    |{state}⟩
                  </span>
                </div>

                {/* Interactive Tooltip Card */}
                {isHovered && (
                  <div className="pointer-events-none absolute -top-20 z-30 min-w-[150px] rounded-xl border border-zinc-700 bg-zinc-900/95 p-2.5 text-xs shadow-2xl backdrop-blur font-mono">
                    <div className="flex items-center justify-between border-b border-zinc-800 pb-1 text-emerald-400 font-bold">
                      <span>State |{state}⟩</span>
                      <span>{pct.toFixed(2)}%</span>
                    </div>
                    <div className="mt-1.5 space-y-0.5 text-[11px] text-zinc-300">
                      <div>Shots: {numCount} / {totalShots}</div>
                      <div>Amplitude: |α| ≈ {(Math.sqrt(pct / 100)).toFixed(3)}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer Info Box */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-xl bg-zinc-900/80 p-3.5 border border-zinc-800/80 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <ZapIcon className="h-4 w-4 text-emerald-400" />
          <span>
            <strong>Backend Engine:</strong> {backend}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-emerald-300 font-semibold" title="Competency Points">
            +{xpEarned} CP Earned
          </span>
        </div>
      </div>
    </div>
  );
}
