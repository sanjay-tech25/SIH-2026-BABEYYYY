import { useEffect, useLayoutEffect, useRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { MotionContext, useGeniePresence, type GenieOptions } from './useGenieMotion';

export function GenieMotionProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = useState(() => {
    try { return localStorage.getItem('quanta-reduced-motion') === 'true'; }
    catch { return false; }
  });
  const [systemReduced, setSystemReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setSystemReduced(media.matches);
    media.addEventListener('change', update);
    return () => media.removeEventListener('change', update);
  }, []);
  const reduced = preference || systemReduced;
  useLayoutEffect(() => {
    document.documentElement.dataset.reducedMotion = String(reduced);
    return () => { delete document.documentElement.dataset.reducedMotion; };
  }, [reduced]);
  const updatePreference = (value: boolean) => {
    setPreference(value);
    try { localStorage.setItem('quanta-reduced-motion', String(value)); }
    catch { /* The preference still works when storage is unavailable. */ }
  };
  return <MotionContext.Provider value={{ reduced, preference, setPreference: updatePreference }}>{children}</MotionContext.Provider>;
}

type GeniePresenceProps = HTMLAttributes<HTMLDivElement> & GenieOptions & { open: boolean };

export function GeniePresence({ open, anchorRef, panelRef, captureTrigger, origin, children, className = '', ...props }: GeniePresenceProps) {
  const { present, ref, motionProps } = useGeniePresence(open, { anchorRef, panelRef, captureTrigger, origin });
  const lastChildren = useRef(children);
  useLayoutEffect(() => { if (open) lastChildren.current = children; }, [open, children]);
  if (!present) return null;
  return <div {...props} {...motionProps} ref={ref} className={`genie-surface ${className}`}>{open ? children : lastChildren.current}</div>;
}

