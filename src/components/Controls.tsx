import { useEffect, useState } from 'react';
import { scenes } from '../data/presentation-data';
import type { Deck } from '../presenter/deck';
import { isFullscreen, toggleFullscreen } from '../presenter/windows';

const blurOnMouse = (e: React.MouseEvent<HTMLElement>) => { if (e.detail > 0) e.currentTarget.blur(); };

/** Kontrol sinematik minimal: tersembunyi saat idle, muncul saat mouse bergerak / tombol ditekan. Semua dapat diakses keyboard (Tab). */
export function Controls({ deck, visible, onOverview, onPresenter }: { deck: Deck; visible: boolean; onOverview: () => void; onPresenter?: () => void }) {
  const { state, dispatch } = deck;
  const [fs, setFs] = useState(isFullscreen());
  useEffect(() => { const h = () => setFs(isFullscreen()); document.addEventListener('fullscreenchange', h); return () => document.removeEventListener('fullscreenchange', h); }, []);
  const main = state.phase === 'main';
  const meta = scenes[state.scene];
  return (
    <div className={`controls ${visible ? '' : 'hidden'}`} role="toolbar" aria-label="Kontrol presentasi" onFocusCapture={() => undefined}>
      {main ? (
        <>
          <button aria-label="Sebelumnya (←)" title="Sebelumnya (←)" onClick={(e) => { blurOnMouse(e); dispatch({ type: 'back' }); }}>◀</button>
          <span className="lbl" aria-live="polite">{String(state.scene + 1).padStart(2, '0')}/{scenes.length} · {state.stage}/{meta.stages}</span>
          <button aria-label="Berikutnya (Spasi / →)" title="Berikutnya (Spasi / →)" onClick={(e) => { blurOnMouse(e); dispatch({ type: 'next' }); }}>▶</button>
          <button aria-label="Ulangi animasi scene (R)" title="Ulangi animasi (R)" onClick={(e) => { blurOnMouse(e); dispatch({ type: 'replay' }); }}>↻</button>
          <button aria-label="Scene overview (O)" title="Scene overview (O)" onClick={(e) => { blurOnMouse(e); onOverview(); }}>▦</button>
          <span className="sep" />
        </>
      ) : state.phase === 'opening' ? (
        <>
          <button style={{ width: 'auto', padding: '0 14px', fontSize: 13, letterSpacing: '.1em' }} onClick={(e) => { blurOnMouse(e); dispatch({ type: 'finishOpening' }); }}>LEWATI OPENING</button>
          <span className="sep" />
        </>
      ) : null}
      <button aria-label={state.muted ? 'Aktifkan suara (M)' : 'Mute (M)'} title="Mute (M)" onClick={(e) => { blurOnMouse(e); dispatch({ type: 'setMuted', muted: !state.muted }); }}>{state.muted ? '🔇' : '🔊'}</button>
      <input type="range" min={0} max={1} step={0.05} value={state.volume} aria-label="Volume" onChange={(e) => dispatch({ type: 'setVolume', volume: Number(e.target.value) })} />
      <span className="sep" />
      {onPresenter && <button aria-label="Buka Presenter View (P)" title="Presenter View (P)" onClick={(e) => { blurOnMouse(e); onPresenter(); }}>🗒</button>}
      <button aria-label={fs ? 'Keluar fullscreen (F)' : 'Fullscreen (F)'} title={fs ? 'Keluar fullscreen (F)' : 'Fullscreen (F)'} onClick={(e) => { blurOnMouse(e); void toggleFullscreen(); }}>{fs ? '⤡' : '⛶'}</button>
    </div>
  );
}
