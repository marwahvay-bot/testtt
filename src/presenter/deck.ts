import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { scenes } from '../data/presentation-data';

export type Phase = 'start' | 'opening' | 'main';
export interface DeckState {
  rev: number;
  phase: Phase;
  scene: number;
  stage: number; // 0..scenes[scene].stages
  dir: 1 | -1; // arah navigasi terakhir (untuk entry animation)
  replayKey: number;
  muted: boolean;
  volume: number;
  startedAt: number | null; // ms epoch saat masuk main (timer presenter)
}
export type Action =
  | { type: 'startOpening' }
  | { type: 'finishOpening' }
  | { type: 'restartOpening' }
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'goto'; scene: number }
  | { type: 'replay' }
  | { type: 'setMuted'; muted: boolean }
  | { type: 'setVolume'; volume: number }
  | { type: 'reset' }
  | { type: '__sync'; state: DeckState };

export const LAST = scenes.length - 1;
const maxStage = (i: number) => scenes[i].stages;

export const initialDeck = (phase: Phase = 'start'): DeckState => ({
  rev: 0, phase, scene: 0, stage: phase === 'main' ? 1 : 0, dir: 1, replayKey: 0, muted: false, volume: 0.6, startedAt: phase === 'main' ? Date.now() : null,
});

export function reduce(s: DeckState, a: Action): DeckState {
  const bump = (p: Partial<DeckState>): DeckState => ({ ...s, ...p, rev: s.rev + 1 });
  switch (a.type) {
    case '__sync': return a.state;
    case 'startOpening': return s.phase === 'start' ? bump({ phase: 'opening' }) : s;
    case 'restartOpening': return bump({ phase: 'opening', scene: 0, stage: 0, startedAt: null, replayKey: s.replayKey + 1 });
    case 'finishOpening': return s.phase === 'main' ? s : bump({ phase: 'main', scene: 0, stage: 1, dir: 1, startedAt: s.startedAt ?? Date.now() });
    case 'reset': return bump({ phase: 'start', scene: 0, stage: 0, startedAt: null });
    case 'next': {
      if (s.phase !== 'main') return s;
      if (s.stage < maxStage(s.scene)) return bump({ stage: s.stage + 1, dir: 1 });
      if (s.scene < LAST) return bump({ scene: s.scene + 1, stage: 1, dir: 1 });
      return s;
    }
    case 'back': {
      if (s.phase !== 'main') return s;
      if (s.stage > 1) return bump({ stage: s.stage - 1, dir: -1 });
      if (s.scene > 0) return bump({ scene: s.scene - 1, stage: maxStage(s.scene - 1), dir: -1 });
      return s;
    }
    case 'goto': {
      if (s.phase !== 'main') return s;
      const t = Math.max(0, Math.min(LAST, a.scene));
      return bump({ scene: t, stage: 1, dir: t >= s.scene ? 1 : -1, replayKey: t === s.scene ? s.replayKey + 1 : s.replayKey });
    }
    case 'replay': return s.phase === 'main' ? bump({ stage: 1, dir: 1, replayKey: s.replayKey + 1 }) : s;
    case 'setMuted': return bump({ muted: a.muted });
    case 'setVolume': return bump({ volume: a.volume });
  }
}

export interface Deck {
  state: DeckState;
  dispatch: (a: Action) => void;
  connected: boolean;
}

/**
 * useDeck — state presentasi + sinkronisasi antar-window (BroadcastChannel, satu perangkat).
 * channelName = null → window terisolasi (Preview Mode).
 */
export function useDeck(channelName: string | null, initial: Phase, role: 'audience' | 'presenter' | 'preview', onPeer?: (alive: boolean) => void): Deck & { peerAlive: boolean; resync: () => void } {
  const [state, rawDispatch] = useReducer(reduce, initial, initialDeck);
  const stateRef = useRef(state); stateRef.current = state;
  const chRef = useRef<BroadcastChannel | null>(null);
  const lastPeerPing = useRef(0);
  const [, force] = useReducer((x: number) => x + 1, 0);

  useEffect(() => {
    if (!channelName || typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel(channelName);
    chRef.current = ch;
    ch.onmessage = (e: MessageEvent) => {
      const m = e.data;
      if (!m) return;
      if (m.t === 'state') { if (m.state.rev > stateRef.current.rev) { stateRef.current = m.state; rawDispatch({ type: '__sync', state: m.state }); } lastPeerPing.current = Date.now(); }
      else if (m.t === 'hello') { ch.postMessage({ t: 'state', state: stateRef.current, from: role }); lastPeerPing.current = Date.now(); }
      else if (m.t === 'ping') { lastPeerPing.current = Date.now(); }
    };
    ch.postMessage({ t: 'hello', from: role });
    const iv = window.setInterval(() => { ch.postMessage({ t: 'ping', from: role }); force(); onPeer?.(Date.now() - lastPeerPing.current < 4000); }, 1500);
    return () => { clearInterval(iv); ch.close(); chRef.current = null; };
  }, [channelName, role]); // eslint-disable-line react-hooks/exhaustive-deps

  const dispatch = useCallback((a: Action) => {
    const next = reduce(stateRef.current, a);
    if (next === stateRef.current) return;
    stateRef.current = next;
    rawDispatch({ type: '__sync', state: next });
    chRef.current?.postMessage({ t: 'state', state: next, from: role });
  }, [role]);

  const resync = useCallback(() => chRef.current?.postMessage({ t: 'hello', from: role }), [role]);
  const peerAlive = Date.now() - lastPeerPing.current < 4000;
  return useMemo(() => ({ state, dispatch, connected: !!channelName, peerAlive, resync }), [state, dispatch, channelName, peerAlive, resync]);
}

export const LIVE_CHANNEL = 'osis-sekbid6-live';
