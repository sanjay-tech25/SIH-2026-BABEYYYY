// Web Audio Micro-Cue Engine for Quantum Computing Platform
// Authoritative implementation of Section 12.8 in agent.md:
// - 0 KB external audio asset downloads (100% browser-synthesized)
// - Gate snap clicks (440 -> 880 Hz sweep)
// - C5 Major triad execution chord (523 + 659 + 784 Hz)
// - Damped minor second syntax error dissonance (220 + 233 Hz)
// - Rising pentatonic level-up fanfare (C5 -> D5 -> E5 -> G5 -> A5)
// - Pomodoro rest bell (432 + 528 Hz dual-carrier)
// - 40Hz focus binaural beat / ambient generator
// - WCAG 2.1 AA persistent mute toggle

class AudioEngine {
  private ctx: AudioContext | null = null;
  private muted: boolean = false;
  private binauralOscLeft: OscillatorNode | null = null;
  private binauralOscRight: OscillatorNode | null = null;
  private binauralGain: GainNode | null = null;
  private isBinauralPlaying: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const storedMute = localStorage.getItem('qubot_audio_muted');
      this.muted = storedMute === 'true';
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  public setMuted(muted: boolean): void {
    this.muted = muted;
    if (typeof window !== 'undefined') {
      localStorage.setItem('qubot_audio_muted', String(muted));
    }
    if (muted && this.isBinauralPlaying) {
      this.stopFocusBinauralBeat();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.muted);
    return this.muted;
  }

  // 1. Gate Snap Click: 440 Hz -> 880 Hz sine sweep with exponential decay (35ms)
  public playGateSnap(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.035);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.035);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  // 2. Circuit Execution Success: C5 (523 Hz) + E5 (659 Hz) + G5 (784 Hz) Major Triad (250ms)
  public playSuccessChord(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [523.25, 659.25, 783.99]; // C5, E5, G5
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.15, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      masterGain.connect(ctx.destination);

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.25);
      });
    } catch {
      // Audio autoplay fallback
    }
  }

  // 3. Syntax Error Dissonance: 220 Hz + 233 Hz damped minor second (180ms)
  public playSyntaxErrorDissonance(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [220.0, 233.08]; // A3, A#3 minor second clash
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.14, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      masterGain.connect(ctx.destination);

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + 0.18);
      });
    } catch {
      // Fallback
    }
  }

  // 4. Mastery Level-Up Fanfare: Rising pentatonic arpeggio (C5 -> D5 -> E5 -> G5 -> A5, 600ms)
  public playLevelUpFanfare(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const notes = [523.25, 587.33, 659.25, 783.99, 880.0]; // C5, D5, E5, G5, A5
      const stepDuration = 0.12;

      notes.forEach((freq, idx) => {
        const noteStart = now + idx * stepDuration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.12, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + stepDuration * 1.5);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + stepDuration * 1.5);
      });
    } catch {
      // Fallback
    }
  }

  // 5. Pomodoro Rest Bell: 432 Hz + 528 Hz dual-carrier with slow attack/release
  public playRestBell(): void {
    if (this.muted) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const freqs = [432.0, 528.0]; // Healing Solfeggio / Rest frequencies
      const masterGain = ctx.createGain();

      masterGain.gain.setValueAtTime(0.001, now);
      masterGain.gain.linearRampToValueAtTime(0.16, now + 0.3);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
      masterGain.connect(ctx.destination);

      freqs.forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);
        osc.connect(masterGain);
        osc.start(now);
        osc.stop(now + 1.8);
      });
    } catch {
      // Fallback
    }
  }

  // 6. 40Hz Gamma Focus Binaural Beats & Ambient Generator
  public startFocusBinauralBeat(): void {
    if (this.muted || this.isBinauralPlaying) return;
    const ctx = this.initCtx();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const carrier = 200.0;
      const diff = 40.0; // 40Hz gamma frequency for deep cognitive focus

      // Left ear: 200 Hz
      this.binauralOscLeft = ctx.createOscillator();
      this.binauralOscLeft.type = 'sine';
      this.binauralOscLeft.frequency.setValueAtTime(carrier, now);

      // Right ear: 240 Hz
      this.binauralOscRight = ctx.createOscillator();
      this.binauralOscRight.type = 'sine';
      this.binauralOscRight.frequency.setValueAtTime(carrier + diff, now);

      this.binauralGain = ctx.createGain();
      this.binauralGain.gain.setValueAtTime(0.001, now);
      this.binauralGain.gain.linearRampToValueAtTime(0.05, now + 1.0); // Gentle ambient volume

      this.binauralOscLeft.connect(this.binauralGain);
      this.binauralOscRight.connect(this.binauralGain);
      this.binauralGain.connect(ctx.destination);

      this.binauralOscLeft.start(now);
      this.binauralOscRight.start(now);
      this.isBinauralPlaying = true;
    } catch {
      // Fallback
    }
  }

  public stopFocusBinauralBeat(): void {
    if (!this.isBinauralPlaying || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.binauralGain) {
        this.binauralGain.gain.linearRampToValueAtTime(0.001, now + 0.5);
      }
      setTimeout(() => {
        try {
          this.binauralOscLeft?.stop();
          this.binauralOscRight?.stop();
          this.binauralOscLeft?.disconnect();
          this.binauralOscRight?.disconnect();
        } catch {}
        this.binauralOscLeft = null;
        this.binauralOscRight = null;
        this.binauralGain = null;
        this.isBinauralPlaying = false;
      }, 500);
    } catch {
      this.isBinauralPlaying = false;
    }
  }

  public toggleFocusBinauralBeat(): boolean {
    if (this.isBinauralPlaying) {
      this.stopFocusBinauralBeat();
      return false;
    } else {
      this.startFocusBinauralBeat();
      return true;
    }
  }

  public isFocusAudioActive(): boolean {
    return this.isBinauralPlaying;
  }
}

export const audioEngine = new AudioEngine();
