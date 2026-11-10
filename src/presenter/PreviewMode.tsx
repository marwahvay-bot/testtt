import { useState } from 'react';
import { scenes } from '../data/presentation-data';
import { Presentation } from '../components/Presentation';
import { NotesPanel } from './NotesPanel';
import { useDeck } from './deck';
import type { AudioEngine } from '../audio/engine';

const GROUPS = ['Pembuka', 'Program Kerja', 'Cara Kerja', 'Penutup'] as const;

/** Preview Mode — periksa seluruh scene, urutan, animasi, audio, transisi, dan notes dalam satu window (terisolasi dari sesi live). */
export function PreviewMode({ audio }: { audio: AudioEngine }) {
  const deck = useDeck(null, 'main', 'preview');
  const { state, dispatch } = deck;
  const [showNotes, setShowNotes] = useState(true);
  const meta = scenes[state.scene];
  return (
    <div className="preview" data-testid="preview">
      <nav className="pre-list" aria-label="Daftar scene">
        {GROUPS.map((g) => (
          <div key={g}>
            <div className="g">{g}</div>
            {scenes.map((s, i) => s.group !== g ? null : (
              <button key={s.id} className={state.phase === 'main' && state.scene === i ? 'cur' : ''} onClick={() => dispatch({ type: 'goto', scene: i })}><b>{String(i + 1).padStart(2, '0')}</b>{s.name}</button>
            ))}
          </div>
        ))}
      </nav>
      <div className="pre-main">
        <div className="pre-stage"><span className="badge-prev">PREVIEW MODE</span><Presentation deck={deck} audio={audio} role="preview" /></div>
        <div className="pre-bar">
          <button className="btn" onClick={() => dispatch({ type: 'restartOpening' })}>▶ Putar opening</button>
          <button className="btn" onClick={() => dispatch({ type: 'finishOpening' })}>Lewati ke scene 1</button>
          <button className="btn" onClick={() => setShowNotes((x) => !x)}>{showNotes ? 'Sembunyikan' : 'Tampilkan'} notes</button>
          <span style={{ fontSize: 13, opacity: .7 }}>Spasi/→ lanjut · ← mundur · R replay · O overview · F fullscreen · M mute</span>
        </div>
      </div>
      {showNotes ? <aside className="pre-notes"><NotesPanel meta={meta} stage={state.phase === 'main' ? state.stage : 0} /></aside> : <aside />}
    </div>
  );
}
