import { RefObject, useEffect, useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

export interface StageBuilder {
  /** Tambah satu stage. Isi stage = tween pada timeline lokal `st`. Stage dijalankan berurutan & kontigu. */
  stage: (fn: (st: gsap.core.Timeline) => void) => void;
}
export interface UseStageOpts {
  stage: number;
  /** true → selalu langsung tampil di stage target tanpa animasi (thumbnail statis, reduced motion). */
  always: boolean;
  /** true → hanya posisi awal langsung dilompati (masuk dari arah mundur). */
  initialJump: boolean;
  /** jeda sebelum animasi masuk dimulai (menunggu transisi). */
  delay?: number;
  build: (b: StageBuilder) => void;
}

/**
 * Lifecycle scene: Enter → Animation stages → Exit → Cleanup.
 * - Satu GSAP timeline paused per scene; stage N = segmen waktu [ends[N-1], ends[N]].
 * - Maju/mundur memakai tweenTo (linear) → selalu reversibel, tanpa overlap/duplikasi.
 * - Cleanup: gsap.context().revert() saat unmount → semua tween & style inline dibersihkan.
 */
export function useStageTimeline(root: RefObject<HTMLElement | null>, { stage, always, initialJump, delay = 0, build }: UseStageOpts) {
  const tl = useRef<gsap.core.Timeline | null>(null);
  const ends = useRef<number[]>([0]);
  const cur = useRef(0);
  const tw = useRef<gsap.core.Tween | null>(null);
  const jumpOnce = useRef(initialJump);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const t = gsap.timeline({ paused: true });
      const e = [0];
      build({ stage: (fn) => { const st = gsap.timeline(); fn(st); t.add(st); e.push(t.duration()); } });
      t.progress(1).progress(0); // susun state awal (stage 0)
      tl.current = t; ends.current = e; cur.current = 0;
    }, root);
    return () => { tw.current?.kill(); ctx.revert(); tl.current = null; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const t = tl.current; if (!t) return;
    const e = ends.current; const to = Math.max(0, Math.min(e.length - 1, stage)); const from = cur.current;
    if (to === from) return;
    tw.current?.kill();
    cur.current = to;
    const adjacent = Math.abs(to - from) === 1;
    if (always || jumpOnce.current || !adjacent || e[to] === e[from]) { jumpOnce.current = false; t.time(e[to]); return; }
    const dist = Math.abs(e[to] - t.time());
    const fwd = to > from;
    tw.current = t.tweenTo(e[to], { ease: 'none', duration: Math.max(0.05, fwd ? dist : dist * 0.55), delay: fwd && from === 0 ? delay : 0 });
  }, [stage]); // eslint-disable-line react-hooks/exhaustive-deps
}
