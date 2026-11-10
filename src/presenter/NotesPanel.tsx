import type { SceneMeta } from '../data/presentation-data';

/** Presenter Notes — format hybrid: poin kunci, fakta, konteks, narasi saran, kalimat transisi. Tidak pernah dirender di tampilan audiens. */
export function NotesPanel({ meta, stage }: { meta: SceneMeta; stage: number }) {
  const n = meta.notes;
  return (
    <div className="notes" data-testid="notes">
      <div className="pv-dur">{meta.group} · sumber: {meta.source}</div>
      <h2>{meta.name}</h2>
      <div className="pv-dur" style={{ marginTop: 4 }}>Rekomendasi durasi: {meta.duration ? `±${meta.duration} dtk` : 'bebas (Q&A)'}{stage ? ` · stage ${stage}/${meta.stages}: ${meta.stageLabels[stage - 1]}` : ''}</div>
      <h3>1 · Poin kunci</h3><ul>{n.points.map((x, i) => <li key={i}>{x}</li>)}</ul>
      <h3>2 · Fakta penting</h3><ul>{n.facts.map((x, i) => <li key={i}>{x}</li>)}</ul>
      <h3>3 · Konteks pendukung</h3><p>{n.context}</p>
      <h3>4 · Saran narasi (panduan, bukan naskah)</h3><p className="narr">{n.narrative}</p>
      <h3>5 · Kalimat transisi</h3><p className="trans">{n.transition}</p>
    </div>
  );
}
