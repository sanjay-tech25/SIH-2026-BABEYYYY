import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type AnimationEvent, type CSSProperties, type RefObject } from 'react';

export const MotionContext = createContext<{ reduced: boolean; preference: boolean; setPreference: (value: boolean) => void }>({
  reduced: false,
  preference: false,
  setPreference: () => undefined,
});

export const useGenieMotion = () => useContext(MotionContext);

export type GenieOptions = {
  anchorRef?: RefObject<HTMLElement>;
  panelRef?: RefObject<HTMLDivElement>;
  captureTrigger?: boolean;
  origin?: 'top' | 'top-right' | 'bottom' | 'bottom-right';
};

/** Keep the real content mounted through its exit; never clone live forms/canvases. */
export function useGeniePresence(open: boolean, { anchorRef, panelRef, captureTrigger = false, origin = 'top' }: GenieOptions = {}) {
  const { reduced } = useGenieMotion();
  const [present, setPresent] = useState(open);
  const internalRef = useRef<HTMLDivElement>(null);
  const ref = panelRef ?? internalRef;
  const returnFocus = useRef<HTMLElement | null>(null);
  const wasOpen = useRef(false);

  useLayoutEffect(() => {
    if (open) {
      if (!wasOpen.current) returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      setPresent(true);
    }
    wasOpen.current = open;
  }, [open]);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (open) {
      // Measure the layout box without the entrance transform applied.
      node.style.animation = 'none';
      const box = node.getBoundingClientRect();
      const trigger = anchorRef?.current ?? (captureTrigger && returnFocus.current?.matches('button, a') ? returnFocus.current : null);
      const anchor = trigger?.getBoundingClientRect();
      if (anchor && box.width && box.height) {
        node.style.setProperty('--genie-x', `${anchor.left + anchor.width / 2 - box.left}px`);
        node.style.setProperty('--genie-y', `${anchor.top + anchor.height / 2 - box.top}px`);
      }
      node.style.removeProperty('animation');
    } else if (node.contains(document.activeElement)) {
      const target = anchorRef?.current ?? returnFocus.current;
      if (target?.isConnected) target.focus({ preventScroll: true });
    }
    node.inert = !open;
  }, [open, present, anchorRef, captureTrigger, ref]);

  useEffect(() => {
    if (open || !present) return;
    if (reduced) { setPresent(false); return; }
    // Fallback also handles CSS being disabled or animation events being cancelled.
    const timer = window.setTimeout(() => setPresent(false), 460);
    return () => window.clearTimeout(timer);
  }, [open, present, reduced]);

  return {
    present: open || present,
    ref,
    motionProps: {
      'data-genie-state': open ? 'open' : 'closing',
      'data-genie-origin': origin,
      'aria-hidden': !open || undefined,
      onAnimationEnd: (event: AnimationEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget && event.animationName === 'genie-close' && !open) setPresent(false);
      },
    },
  };
}

/** Reveal long public-page sections once, as they enter the viewport. */
export function useGenieReveals() {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = useGenieMotion();
  useEffect(() => {
    if (!ref.current || reduced || !('IntersectionObserver' in window)) return;
    const sections = ref.current.querySelectorAll<HTMLElement>(':scope > section, :scope > footer');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        (entry.target as HTMLElement).dataset.genieReveal = 'visible';
        observer.unobserve(entry.target);
      });
    }, { threshold: 0, rootMargin: '0px 0px -24px 0px' });
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top < window.innerHeight) section.dataset.genieReveal = 'visible';
      else { section.dataset.genieReveal = 'waiting'; observer.observe(section); }
    });
    return () => {
      observer.disconnect();
      sections.forEach((section) => { delete section.dataset.genieReveal; });
    };
  }, [reduced]);
  return ref;
}

export function genieStagger(index: number): CSSProperties {
  return { '--genie-delay': `${Math.min(index, 6) * 35}ms` } as CSSProperties;
}
