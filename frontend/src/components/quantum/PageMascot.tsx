import React, { useState } from 'react';
import { SparklesIcon, MessageSquareIcon } from 'lucide-react';
import { audioEngine } from '../../services/audioEngine';

export type MascotPose =
  | 'waving'
  | 'welcome'
  | 'guide'
  | 'builder'
  | 'navigator'
  | 'scholar'
  | 'thinking'
  | 'coder'
  | 'celebrating';

export type MascotAnimation = 'float' | 'bounce' | 'breathe' | 'none';

interface PageMascotProps {
  pose: MascotPose;
  animation?: MascotAnimation;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  speechBubble?: {
    title?: string;
    text: string;
    badge?: string;
  };
  bubblePosition?: 'top-left' | 'top-right' | 'left' | 'right' | 'bottom';
  showAura?: boolean;
  className?: string;
  onTap?: () => void;
}

const POSE_IMAGES: Record<MascotPose, string> = {
  waving: '/assets/mascot/mascot_waving.png',
  welcome: '/assets/mascot/mascot_welcome.png',
  guide: '/assets/mascot/mascot_guide.png',
  builder: '/assets/mascot/mascot_builder.png',
  navigator: '/assets/mascot/mascot_navigator.png',
  scholar: '/assets/mascot/mascot_scholar.png',
  thinking: '/assets/mascot/mascot_thinking.png',
  coder: '/assets/mascot/mascot_coder.png',
  celebrating: '/assets/mascot/mascot_celebrating.png',
};

const SIZE_CLASSES = {
  sm: 'h-24 w-auto max-w-[100px]',
  md: 'h-36 w-auto max-w-[140px]',
  lg: 'h-48 w-auto max-w-[180px]',
  xl: 'h-60 w-auto max-w-[220px]',
};

export const PageMascot: React.FC<PageMascotProps> = ({
  pose,
  animation = 'float',
  size = 'md',
  speechBubble,
  bubblePosition = 'top-left',
  showAura = true,
  className = '',
  onTap,
}) => {
  const [isInteracted, setIsInteracted] = useState(false);

  const handleTap = () => {
    try {
      audioEngine.playGateSnap();
    } catch {
      // Audio engine may be uninitialized
    }
    setIsInteracted(true);
    setTimeout(() => setIsInteracted(false), 1200);
    if (onTap) onTap();
  };

  const getAnimationClass = () => {
    if (isInteracted) return 'animate-mascot-bounce';
    switch (animation) {
      case 'bounce':
        return 'animate-mascot-bounce';
      case 'breathe':
        return 'animate-mascot-breathe';
      case 'float':
        return 'animate-mascot-float';
      case 'none':
      default:
        return '';
    }
  };

  return (
    <div className={`relative inline-flex items-center justify-center select-none ${className}`}>
      {/* Dynamic Glowing Quantum Aura */}
      {showAura && (
        <div
          className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-tr from-cyan-500/20 via-purple-500/25 to-emerald-400/20 blur-xl animate-mascot-aura"
          aria-hidden="true"
        />
      )}

      {/* Speech Bubble */}
      {speechBubble && (
        <div
          className={`absolute z-20 pointer-events-auto transition-all duration-300 hidden sm:block ${
            bubblePosition === 'left'
              ? 'right-[105%] top-1/2 -translate-y-1/2 mr-2'
              : bubblePosition === 'right'
              ? 'left-[105%] top-1/2 -translate-y-1/2 ml-2'
              : bubblePosition === 'top-left'
              ? 'bottom-[90%] right-1/2 mb-2'
              : bubblePosition === 'top-right'
              ? 'bottom-[90%] left-1/2 mb-2'
              : 'top-[102%] left-1/2 -translate-x-1/2 mt-2'
          }`}
        >
          <div className="relative rounded-2xl border border-purple-400/30 bg-zinc-950/95 px-3.5 py-2.5 shadow-[0_8px_25px_rgba(0,0,0,0.5)] backdrop-blur-xl w-56 sm:w-64 text-left">
            {speechBubble.badge && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[#f5d626]/20 border border-[#f5d626]/40 px-2 py-0.5 text-[10px] font-mono font-bold text-[#f5d626] mb-1">
                <SparklesIcon className="h-2.5 w-2.5" />
                {speechBubble.badge}
              </span>
            )}
            {speechBubble.title && (
              <div className="font-orbitron text-xs font-bold text-white tracking-wide">
                {speechBubble.title}
              </div>
            )}
            <p className="font-poppins text-xs text-purple-100/90 leading-relaxed mt-0.5">
              {speechBubble.text}
            </p>

            {/* Bubble Tail */}
            <div
              className={`absolute h-2.5 w-2.5 rotate-45 bg-zinc-950/95 ${
                bubblePosition === 'left'
                  ? '-right-1.5 top-1/2 -translate-y-1/2 border-t border-r border-purple-400/30'
                  : bubblePosition === 'right'
                  ? '-left-1.5 top-1/2 -translate-y-1/2 border-b border-l border-purple-400/30'
                  : bubblePosition === 'top-left'
                  ? '-bottom-1.5 right-6 border-b border-r border-purple-400/30'
                  : bubblePosition === 'top-right'
                  ? '-bottom-1.5 left-6 border-b border-r border-purple-400/30'
                  : '-top-1.5 left-1/2 -translate-x-1/2 border-t border-l border-purple-400/30'
              }`}
            />
          </div>
        </div>
      )}

      {/* Mascot Character Image */}
      <button
        type="button"
        onClick={handleTap}
        title="Hi! I am Qubot, your quantum companion. Tap me!"
        className={`group relative z-10 cursor-pointer focus:outline-none transition-transform active:scale-95 ${getAnimationClass()}`}
      >
        <img
          src={POSE_IMAGES[pose]}
          alt={`Qubot Mascot in ${pose} pose`}
          className={`${SIZE_CLASSES[size]} object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105`}
          draggable={false}
        />
      </button>
    </div>
  );
};
