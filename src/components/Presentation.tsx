import { useCallback, useEffect, useRef, useState } from 'react';
import { scenes } from '../data/presentation-data';
import { Stage } from './Stage';
import { Wipe, WipeApi } from './Wipe';
import { Controls } from './Controls';
import { OverviewModal } from './OverviewModal';
import { Opening, StartScreen } from './Screens';
import { SceneView } from '../scenes/SceneView';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useKeys } from '../hooks/useKeys';
import { useActive } from '../hooks/useIdle';
import { openPresenter, toggleFullscreen } from '../presenter/windows';
import type { Deck, Phase } from '../presenter/deck';
import type { AudioEngine } from '../audio/engine';

/**
 * Tampilan audiens (dipakai Audience window & Preview). Hanya menampilkan presentasi + kontrol minimal.
 * Lifecycle: phase (start → opening → main), transisi wipe antar scene, audio per stage.
 */
export function Presentation({ deck, audio, role }: { deck: Deck; audio: AudioEngine | null; role: 'audience' | 'preview' }) {
  const { state, dispatch } = deck;
  const reduced = useReducedMotion();
  const wipe = useRef<WipeApi>(null);
  const active = useActive();
  const [overview, setOverview] = useState(false);
  const [shownPhase, setShownPhase] = useState<Phase>(state.phase);
  const [shownScene, setShownScene] = useState(state.scene);
  const [wiping, setWiping] = useState(false);
  const refs = useRef({ phase: shownPhase, scene: shownScene, busy: false });
  refs.current.phase = shownPhase; refs.current.scene = shownScene;
  const target = useRef(state); target.current = state;

  const sync = useCallback(() => {
    const r = refs.current; const t = target.current;
    if (r.busy) return;
    const finish = () => { r.busy = false; setWiping(false); sync(); };
    const swap = () => { setShownPhase(target.current.phase); setShownScene(target.current.scene); refs.current.phase = target.current.phase; refs.current.scene = target.current.scene; };
    if (r.phase !== t.phase) {
      if (r.phase === 'opening' && t.phase === 'main' && wipe.current) { r.busy = true; setWiping(true); wipe.current.run(swap, finish); }
      else swap();
      return;
    }
    if (t.phase === 'main' && r.scene !== t.scene && wipe.current) { r.busy = true; setWiping(true); wipe.current.run(swap, finish); }
  }, []);
  useEffect(() => { sync(); }, [state.phase, state.scene, state.replayKey, sync]);

  /* ───── Audio ───── */
  useEffect(() => { audio?.setMuted(state.muted); audio?.setVolume(state.volume); }, [audio, state.muted, state.volume]);
  useEffect(() => {
    if (!audio) return;
    if (state.phase === 'main') audio.startMusic(); else audio.stopMusic();
  }, [audio, state.phase]);
  useEffect(() => { // browser: audio context baru boleh jalan setelah interaksi
    if (!audio) return;
    const h = () => { audio.ensure(); if (target.current.phase === 'main') audio.startMusic(); };
    window.addEventListener('pointerdown', h); window.addEventListener('keydown', h);
    return () => { window.removeEventListener('pointerdown', h); window.removeEventListener('keydown', h); };
  }, [audio]);
  const first = useRef(true);
  useEffect(() => {
    if (first.current) { first.current = false; return; }
    if (!audio || state.phase !== 'main' || state.dir !== 1) return;
    audio.play(scenes[state.scene].sfx[state.stage - 1] ?? null);
  }, [audio, state.phase, state.scene, state.stage, state.replayKey]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => () => { audio?.stopMusic(0.2); audio?.stopSfx(); }, [audio]);

  const doPresenter = role === 'audience' ? () => { openPresenter(); } : undefined;
  useKeys(state, dispatch, { overview: () => setOverview((o) => !o), fullscreen: () => void toggleFullscreen(), presenter: doPresenter, escape: () => setOverview(false) });

  const stage = shownScene === state.scene ? state.stage : scenes[shownScene].stages;
  const meta = scenes[shownScene];
  const prog = ((shownScene + Math.max(0, stage - 1) / Math.max(1, meta.stages - 1) * 0.999) / scenes.length) * 100;
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }} className={active ? '' : 'hide-cursor'} data-phase={shownPhase} data-scene={shownScene} data-stage={stage} data-wiping={wiping || undefined}>
      <Stage>
        {shownPhase === 'start' && <StartScreen deck={deck} audio={audio} reduced={reduced} role={role} />}
        {shownPhase === 'opening' && <Opening key={state.replayKey} deck={deck} showVideo />}
        {shownPhase === 'main' && (
          <>
            <SceneView key={`${shownScene}:${state.replayKey}`} index={shownScene} stage={stage} always={reduced} delay={0.3} />
            <div className="progress-line" style={{ opacity: active ? 1 : 0.55 }} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(prog)} aria-label="Progres presentasi"><b style={{ width: `${prog}%` }} /></div>
            <div className="counter" aria-hidden>{String(shownScene + 1).padStart(2, '0')} / {scenes.length}</div>
          </>
        )}
        <Wipe ref={wipe} reduced={reduced} />
      </Stage>
      <Controls deck={deck} visible={active || overview} onOverview={() => setOverview(true)} onPresenter={doPresenter} />
      {overview && <OverviewModal deck={deck} onClose={() => setOverview(false)} />}
    </div>
  );
}
