import { ReactNode, useEffect, useRef, useState } from 'react';

/**
 * Kanvas desain 1920×1080. Diskalakan SERAGAM (letterbox) agar komposisi, safe-area, dan
 * proporsi tipografi tetap identik di semua resolusi proyektor — bukan layout fluid yang berubah susunan.
 */
export function Stage({ children, className = '', onRef }: { children: ReactNode; className?: string; onRef?: (el: HTMLDivElement | null) => void }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [s, setS] = useState(0.5);
  useEffect(() => {
    const el = wrap.current; if (!el) return;
    const fit = () => setS(Math.min(el.clientWidth / 1920, el.clientHeight / 1080) || 0.1);
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className={`stage-wrap ${className}`} ref={(el) => { wrap.current = el; onRef?.(el); }}>
      <div className="stage-canvas" style={{ transform: `translate(${-960 * s}px, ${-540 * s}px) scale(${s})` }}>{children}</div>
    </div>
  );
}
