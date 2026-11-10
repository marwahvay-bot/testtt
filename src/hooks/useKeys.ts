import { useEffect, useRef } from 'react';
import type { Action, DeckState } from '../presenter/deck';

export interface KeyHandlers { overview?: () => void; fullscreen?: () => void; presenter?: () => void; escape?: () => void }

/**
 * Keyboard terpusat. Aman terhadap input/textarea/contenteditable, modifier browser (Ctrl/Alt/Meta),
 * dan tombol terfokus (Space/Enter pada <button> tetap mengaktifkan tombol itu).
 */
export function useKeys(state: DeckState, dispatch: (a: Action) => void, h: KeyHandlers = {}) {
  const hr = useRef(h); hr.current = h;
  const sr = useRef(state); sr.current = state;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.altKey || e.metaKey) return;
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      const onButton = !!t && (t.tagName === 'BUTTON' || t.tagName === 'A');
      const k = e.key;
      const s = sr.current;
      const nav = (a: Action) => { e.preventDefault(); dispatch(a); };
      if (k === ' ' || k === 'Enter') { if (onButton) return; return nav({ type: 'next' }); }
      switch (k) {
        case 'ArrowRight': case 'PageDown': case 'ArrowDown': return nav({ type: 'next' });
        case 'ArrowLeft': case 'PageUp': case 'ArrowUp': case 'Backspace': return nav({ type: 'back' });
        case 'Home': return nav({ type: 'goto', scene: 0 });
        case 'End': return nav({ type: 'goto', scene: 999 });
        case 'r': case 'R': return nav({ type: 'replay' });
        case 'm': case 'M': return nav({ type: 'setMuted', muted: !s.muted });
        case 'o': case 'O': e.preventDefault(); return hr.current.overview?.();
        case 'f': case 'F': e.preventDefault(); return hr.current.fullscreen?.();
        case 'p': case 'P': e.preventDefault(); return hr.current.presenter?.();
        case 'Escape': return hr.current.escape?.();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch]);
}
