import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { WavesIcon, InfoIcon, SparklesIcon } from 'lucide-react';

export interface StatevectorItem {
  basis: string; // e.g. "00", "01"
  amplitude: {
    r: number; // real part
    i: number; // imaginary part
  };
}

interface StatevectorChartProps {
  amplitudes?: StatevectorItem[];
  numQubits?: number;
}

export function StatevectorChart({
  amplitudes = [],
  numQubits = 2,
}: StatevectorChartProps) {
  const [hoveredState, setHoveredState] = useState<StatevectorItem | null>(null);

  // Compute total basis states (2^N)
  const totalStates = Math.pow(2, numQubits);
  const items: StatevectorItem[] = amplitudes.length > 0
    ? amplitudes
    : Array.from({ length: totalStates }).map((_, idx) => {
        const basis = idx.toString(2).padStart(numQubits, '0');
        // Default ground state |0...0> = 1.0 + 0i
        return {
          basis,
          amplitude: { r: idx === 0 ? 1.0 : 0.0, i: 0.0 }
        };
      });

  // Calculate phase phi in radians [0, 2pi)
  const getPhase = (r: number, i: number): number => {
    let phi = Math.atan2(i, r);
    if (phi < 0) phi += 2 * Math.PI;
    return phi;
  };

  // Convert phase to continuous color wheel HSL
  const getPhaseColor = (r: number, i: number): string => {
    const mag = Math.sqrt(r * r + i * i);
    if (mag < 0.001) return 'rgb(148, 163, 184)'; // Slate for zero amplitude
    const phi = getPhase(r, i);
    const hue = (phi * 180) / Math.PI;
    return `hsl(${hue.toFixed(1)}, 85%, 55%)`;
  };

  return (
    <Card className="p-6 sm:p-7 space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-purple-100/80 pb-4">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#4c1d70] flex items-center gap-1.5">
            <WavesIcon className="h-3.5 w-3.5 text-[#f5d626]" />
            Quantum Wavefunction Spectrum (Section 12.9)
          </span>
          <h3 className="mt-0.5 font-display text-lg font-bold text-zinc-900 dark:text-zinc-50">
            Statevector Complex Amplitudes & Phase Wheel
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Probability amplitudes $c_j = \alpha + i\beta$. Bar heights indicate probability $|c_j|^2$; colors map relative phase $\phi \in [0, 2\pi)$.
          </p>
        </div>

        {/* Phase Color Wheel Legend */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono shrink-0 bg-purple-50/60 dark:bg-zinc-800 px-3 py-1.5 rounded-xl border border-purple-200/60">
          <span className="text-zinc-500 font-bold">Phase:</span>
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(0, 85%, 55%)' }} title="0 rad" />
          <span className="text-[10px] text-zinc-600">0</span>
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(90, 85%, 55%)' }} title="π/2 rad" />
          <span className="text-[10px] text-zinc-600">π/2</span>
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(180, 85%, 55%)' }} title="π rad" />
          <span className="text-[10px] text-zinc-600">π</span>
          <span className="inline-block w-3 h-3 rounded-full" style={{ backgroundColor: 'hsl(270, 85%, 55%)' }} title="3π/2 rad" />
          <span className="text-[10px] text-zinc-600">3π/2</span>
        </div>
      </div>

      {/* Amplitude Bars Canvas */}
      <div className="pt-2">
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
          {items.map((item) => {
            const r = item.amplitude.r;
            const i = item.amplitude.i;
            const magSq = r * r + i * i;
            const probPct = Math.min(100, Math.max(0, magSq * 100));
            const color = getPhaseColor(r, i);
            const phi = getPhase(r, i);
            const phiDeg = (phi * 180) / Math.PI;

            return (
              <div
                key={item.basis}
                onMouseEnter={() => setHoveredState(item)}
                onMouseLeave={() => setHoveredState(null)}
                className="group relative flex flex-col items-center justify-end rounded-2xl bg-zinc-50/80 dark:bg-zinc-800/50 border border-slate-200/80 dark:border-zinc-800 p-3 pt-6 min-h-[180px] transition-all hover:-translate-y-1 hover:shadow-md cursor-pointer"
              >
                {/* Probability Value at top */}
                <span className="absolute top-2 text-[10px] font-mono font-bold text-zinc-700 dark:text-zinc-300">
                  {probPct.toFixed(1)}%
                </span>

                {/* Vertical Bar Container */}
                <div className="relative w-full h-28 flex items-end justify-center">
                  <div
                    className="w-10 rounded-t-xl transition-all duration-500 ease-out shadow-xs group-hover:brightness-110"
                    style={{
                      height: `${Math.max(6, probPct)}%`,
                      backgroundColor: color,
                    }}
                  />
                </div>

                {/* Basis State Label */}
                <span className="mt-3 font-mono text-xs font-black tracking-wider text-zinc-900 dark:text-zinc-100 group-hover:text-[#4c1d70] transition-colors">
                  |{item.basis}⟩
                </span>

                {/* Real & Imaginary indicators */}
                <span className="text-[9px] font-mono text-zinc-400 mt-0.5">
                  {r >= 0 ? `+${r.toFixed(2)}` : r.toFixed(2)}
                  {i >= 0 ? `+${i.toFixed(2)}i` : `${i.toFixed(2)}i`}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected / Hovered State Inspector */}
      {hoveredState ? (
        <div className="rounded-2xl border border-purple-200 bg-purple-50/50 p-4 dark:border-purple-900/60 dark:bg-zinc-800 text-xs font-mono flex flex-wrap items-center justify-between gap-3 animate-fadeInUp">
          <div className="flex items-center gap-3">
            <span
              className="w-4 h-4 rounded-full shadow-xs"
              style={{ backgroundColor: getPhaseColor(hoveredState.amplitude.r, hoveredState.amplitude.i) }}
            />
            <span className="font-bold text-[#4c1d70] text-sm">
              State |{hoveredState.basis}⟩
            </span>
            <span className="text-zinc-600 dark:text-zinc-400">
              Amplitude $c = {hoveredState.amplitude.r.toFixed(4)} + {hoveredState.amplitude.i.toFixed(4)}i$
            </span>
          </div>

          <div className="flex items-center gap-4 text-zinc-600 dark:text-zinc-400">
            <span>
              Probability $|c|^2 = {(
                (hoveredState.amplitude.r ** 2 + hoveredState.amplitude.i ** 2) *
                100
              ).toFixed(2)}%$
            </span>
            <span>
              Phase $\phi = {(getPhase(hoveredState.amplitude.r, hoveredState.amplitude.i) * 180 / Math.PI).toFixed(1)}^\circ$ ({
                (getPhase(hoveredState.amplitude.r, hoveredState.amplitude.i) / Math.PI).toFixed(2)
              }π rad)
            </span>
          </div>
        </div>
      ) : (
        <div className="text-[11px] font-mono text-zinc-400 flex items-center justify-center gap-1.5 py-1">
          <InfoIcon className="h-3.5 w-3.5" />
          <span>Hover over any basis state bar to inspect complex coordinates and continuous phase angle.</span>
        </div>
      )}
    </Card>
  );
}
