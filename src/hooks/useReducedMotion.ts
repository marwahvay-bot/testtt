import { useEffect, useState } from 'react';
import { reduceMotionQuery } from '../animations/presets';

/** Reduced-motion: mengikuti OS, atau paksa lewat ?reduced=1. */
export function useReducedMotion() {
  const get = () => typeof window !== 'undefined' && (window.matchMedia(reduceMotionQuery).matches || new URLSearchParams(location.search).has('reduced'));
  const [r, setR] = useState(get);
  useEffect(() => {
    const m = window.matchMedia(reduceMotionQuery);
    const h = () => setR(get());
    m.addEventListener('change', h);
    return () => m.removeEventListener('change', h);
  }, []);
  return r;
}
