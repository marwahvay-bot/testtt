import { useEffect, useState } from 'react';
import { OPENING_SECONDS, scenes, totalRecommendedSeconds } from '../data/presentation-data';
import { Stage } from '../components/Stage';
import { SceneView } from '../scenes/SceneView';
import { OverviewModal } from '../components/OverviewModal';
import { NotesPanel } from './NotesPanel';
import { useKeys } from '../hooks/useKeys';
import { openAudience, toggleFullscreen } from './windows';
import { useDeck, LIVE_CHANNEL } from './deck';

const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const fmtTarget = totalRecommendedSeconds + OPENING_SECONDS;

/**
 * Presenter View (laptop). Layar audiens (proyektor) hanya menampilkan presentasi.
 * Sinkronisasi: BroadcastChannel antar-window di perangkat yang sama (tanpa server).
 */
export function PresenterView() {
  const deck = useDeck(LIVE_CHANNEL, 'start', 'presenter') as ReturnType<typeof useDeck>;
  const { state, dispatch, peerAlive } = deck;
  const [overview, setOverview] = useState(false);
  const [msg, setMsg] = useState('');
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const t = setInterval(() => setNow(Date.now()), 500); return () => clearInterval(t); }, []);
  useKeys(state, dispatch, { overview: () => setOverview((o) => !o), fullscreen: () => void toggleFullscreen(), escape: () => setOverview(false) });

  const meta = scenes[state.scene];
  const main = state.phase === 'main';
  const next = scenes[state.scene + 1];
  const elapsed = state.startedAt ? (now - state.startedAt) / 1000 : 0;
  const open = async () => { const w = await openAudience(); setMsg(w ? '' : 'Popup diblokir. Izinkan popup untuk situs ini (ikon di address bar), lalu klik lagi.'); };
  const nextLabel = main ? (state.stage < meta.stages ? `Stage ${state.stage + 1}: ${meta.stageLabels[state.stage]}` : next ? `Scene ${state.scene + 2}: ${next.name}` : 'Akhir presentasi') : '—';

  return (
    <div className="presenter" data-testid="presenter">
      <header className="pv-top">
        <h1>PRESENTER VIEW · SEKBID 6</h1>
        <span className={`pv-pill ${peerAlive ? 'ok' : 'bad'}`} data-testid="peer-status">{peerAlive ? 'Layar audiens: tersambung' : 'Layar audiens: belum terhubung'}</span>
        <span className="pv-pill">{state.phase === 'start' ? 'Menunggu START' : state.phase === 'opening' ? 'Opening berjalan' : 'Presentasi'}</span>
        <span className="pv-timer" title={`Target ±${fmt(fmtTarget)} (rekomendasi, belum termasuk Q&A)`}>{fmt(elapsed)} <small style={{ fontSize: 13, color: 'rgba(255,255,255,.55)' }}>/ target ±{fmt(fmtTarget)}</small></span>
        <span style={{ marginLeft: 'auto' }} className="pv-btns">
          <button onClick={open}>{peerAlive ? 'Buka ulang layar audiens' : 'Buka layar audiens'}</button>
          <button onClick={() => { location.hash = '#/'; }} title="Satu layar: tampilan audiens di window ini">Mode satu layar</button>
          <button onClick={() => setOverview(true)}>Scene overview (O)</button>
        </span>
      </header>
      {msg && <div style={{ background: 'var(--red)', padding: '8px 20px', fontSize: 14 }} role="alert">{msg}</div>}
      <div className="pv-body">
        <div className="pv-left">
          <div>
            <div className="pv-label">Scene saat ini {main && `· ${String(state.scene + 1).padStart(2, '0')}/${scenes.length}`}</div>
            <div className="pv-cur" data-testid="pv-current">
              {main ? <Stage><SceneView key={`${state.scene}:${state.replayKey}`} index={state.scene} stage={state.stage} /></Stage>
                : <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', padding: 24, fontSize: 18, lineHeight: 1.5 }}>
                    {state.phase === 'start' ? <>Menunggu tombol <b>START PRESENTATION</b> di layar audiens.<br />Atau klik “Lewati opening” untuk latihan.</> : <>Opening MP4 sedang diputar di layar audiens…</>}
                  </div>}
            </div>
          </div>
          <div className="pv-row">
            <div>
              <div className="pv-label">Berikutnya</div>
              <div className="pv-next" data-testid="pv-next">{main && next ? <Stage><SceneView key={`n${state.scene}`} index={state.scene + 1} stage={next.stages} always /></Stage> : null}</div>
              <div className="pv-dur" style={{ marginTop: 4 }}>{nextLabel}</div>
            </div>
            <div className="pv-panel">
              <div className="pv-label">Progres animasi</div>
              {main && (<>
                <div className="pv-dots" data-testid="pv-dots">{Array.from({ length: meta.stages }).map((_, i) => <i key={i} className={i < state.stage ? 'on' : ''} />)}</div>
                <div className="pv-dur">Stage {state.stage}/{meta.stages}: <b>{meta.stageLabels[state.stage - 1]}</b></div>
              </>)}
              <div className="pv-label" style={{ marginTop: 10 }}>Progres presentasi</div>
              <div className="pv-dots">{scenes.map((_, i) => <i key={i} className={main && i <= state.scene ? 'on' : ''} style={{ height: 6 }} />)}</div>
              <div className="pv-dur">Durasi scene ini (rekomendasi): <b>{meta.duration ? `${meta.duration} dtk` : 'bebas'}</b></div>
            </div>
          </div>
          <div className="pv-panel">
            <div className="pv-btns">
              <button onClick={() => dispatch({ type: 'back' })} disabled={!main}>◀ Mundur (←)</button>
              <button className="primary" onClick={() => dispatch({ type: 'next' })} disabled={!main} data-testid="pv-next-btn">Lanjut (Spasi / →) ▶</button>
              <button onClick={() => dispatch({ type: 'replay' })} disabled={!main}>↻ Ulangi animasi (R)</button>
              {!main && <button className="primary" onClick={() => dispatch({ type: 'finishOpening' })} data-testid="pv-skip">Lewati opening → presentasi</button>}
              <button onClick={() => dispatch({ type: 'restartOpening' })} title="Mulai ulang dari opening (perlu START di layar audiens bila belum ada interaksi)">Ulangi opening</button>
              <button onClick={() => dispatch({ type: 'reset' })}>Reset ke awal</button>
            </div>
            <div className="pv-btns" style={{ marginTop: 10, alignItems: 'center' }}>
              <button onClick={() => dispatch({ type: 'setMuted', muted: !state.muted })} aria-pressed={state.muted}>{state.muted ? '🔇 Suara mati' : '🔊 Suara hidup'} (M)</button>
              <label style={{ fontSize: 13, display: 'flex', gap: 8, alignItems: 'center' }}>Volume
                <input type="range" min={0} max={1} step={0.05} value={state.volume} onChange={(e) => dispatch({ type: 'setVolume', volume: Number(e.target.value) })} style={{ accentColor: 'var(--yellow)' }} aria-label="Volume audio layar audiens" />
              </label>
              <span className="pv-help">Audio diputar di layar audiens, bukan di window ini.</span>
            </div>
          </div>
        </div>
        <div className="pv-right pv-panel">
          <NotesPanel meta={meta} stage={main ? state.stage : 0} />
          <div className="pv-help" style={{ marginTop: 16, borderTop: '1px solid rgba(255,255,255,.12)', paddingTop: 10 }}>
            <b>Panduan satu laptop + proyektor:</b> (1) Hubungkan proyektor &amp; atur tampilan ke <i>Extend</i>. (2) Klik “Buka layar audiens”, izinkan popup. (3) Pindahkan window audiens ke proyektor, klik di dalamnya lalu tekan <b>F</b> (fullscreen) dan klik <b>START PRESENTATION</b>. (4) Kendalikan dari window ini. Jika hanya satu layar: “Mode satu layar”.
          </div>
        </div>
      </div>
      {overview && <OverviewModal deck={deck} onClose={() => setOverview(false)} />}
    </div>
  );
}
