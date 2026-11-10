import { forwardRef, useImperativeHandle, useRef } from 'react';
import gsap from 'gsap';

export interface WipeApi { run: (mid: () => void, done?: () => void) => void; running: () => boolean }
const COLORS = ['var(--yellow)', '#ffffff', 'var(--red)', 'var(--navy)', 'var(--yellow)', '#ffffff', 'var(--red)', 'var(--navy)'];

/**
 * Transisi kontekstual: garis diagonal kuning–putih–merah–navy menyapu layar — diambil langsung dari
 * bahasa gerak opening (scene "stripes"). Menutup → (swap konten) → membuka.
 */
export const Wipe = forwardRef<WipeApi, { reduced: boolean }>(({ reduced }, ref) => {
  const root = useRef<HTMLDivElement>(null);
  const busy = useRef(false);
  const tl = useRef<gsap.core.Timeline | null>(null);
  useImperativeHandle(ref, () => ({
    running: () => busy.current,
    run: (mid, done) => {
      const el = root.current; if (!el) { mid(); done?.(); return; }
      busy.current = true; tl.current?.kill();
      const bars = el.querySelectorAll('i');
      const finish = () => { busy.current = false; gsap.set(bars, { clearProps: 'all' }); gsap.set(el, { clearProps: 'opacity' }); done?.(); };
      if (reduced) {
        tl.current = gsap.timeline({ onComplete: finish })
          .set(bars, { x: 0 }).fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.12 }).call(mid).to(el, { opacity: 0, duration: 0.18 });
        return;
      }
      tl.current = gsap.timeline({ onComplete: finish })
        .fromTo(bars, { x: -2900 }, { x: 0, duration: 0.42, stagger: 0.032, ease: 'power3.in' })
        .call(mid)
        .to(bars, { x: 2900, duration: 0.45, stagger: 0.032, ease: 'power3.out' }, '+=0.04');
    },
  }), [reduced]);
  return (
    <div className="wipe" ref={root} aria-hidden>
      {COLORS.map((c, i) => <i key={i} style={{ left: -240 + i * 300, width: 440, background: c, transform: 'translateX(-2900px) skewX(-14deg)' }} />)}
    </div>
  );
});
