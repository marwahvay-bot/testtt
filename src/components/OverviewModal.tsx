import { useEffect } from 'react';
import { scenes } from '../data/presentation-data';
import { Stage } from './Stage';
import { SceneView } from '../scenes/SceneView';
import type { Deck } from '../presenter/deck';

const GROUPS = ['Pembuka', 'Program Kerja', 'Cara Kerja', 'Penutup'] as const;

/** Scene Overview — grid thumbnail (render scene asli pada stage akhir, statis). */
export function OverviewModal({ deck, onClose }: { deck: Deck; onClose: () => void }) {
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'Escape' || e.key === 'o' || e.key === 'O') { e.preventDefault(); e.stopPropagation(); onClose(); } };
    window.addEventListener('keydown', h, true);
    return () => window.removeEventListener('keydown', h, true);
  }, [onClose]);
  return (
    <div className="overview-modal" role="dialog" aria-modal="true" aria-label="Scene overview">
      <button className="ov-close" onClick={onClose} autoFocus>TUTUP (Esc)</button>
      <h2>SCENE OVERVIEW</h2>
      <div className="sub">{scenes.length} scene · klik untuk melompat. Animasi scene dimulai dari awal, opening tidak diputar ulang.</div>
      {GROUPS.map((g) => (
        <section key={g}>
          <div className="grp">{g}</div>
          <div className="ov-grid">
            {scenes.map((s, i) => s.group !== g ? null : (
              <button key={s.id} className={`ov-card ${deck.state.scene === i && deck.state.phase === 'main' ? 'current' : ''}`} data-testid={`ov-${i}`}
                onClick={() => { deck.dispatch({ type: 'goto', scene: i }); onClose(); }} aria-label={`Scene ${i + 1}: ${s.name}`}>
                {deck.state.scene === i && deck.state.phase === 'main' && <span className="ov-flag">SEKARANG</span>}
                <div className="ov-thumb"><Stage><SceneView index={i} stage={s.stages} always /></Stage></div>
                <div className="ov-meta"><b>{String(i + 1).padStart(2, '0')}</b><span>{s.name}{s.proker !== undefined ? ` · Proker ${s.proker + 1}` : ''}</span></div>
              </button>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
