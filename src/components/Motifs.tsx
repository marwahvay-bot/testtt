import type { Proker } from '../data/presentation-data';

const S = (extra: object = {}) => ({ fill: 'none', pathLength: 1 as number, ...extra });

/** Motif visual per proker (SVG 600×600). Kelas m-draw / m-pop / m-clip / m-spin dianimasikan oleh scene. */
export function Motif({ kind }: { kind: Proker['motif'] }) {
  const acc = 'var(--accent)', fg = 'var(--fg)', a2 = 'var(--accent2)';
  switch (kind) {
    case 'lens':
      return (
        <svg viewBox="0 0 600 600" width="100%" height="100%" aria-hidden>
          {['M40 150V40H150', 'M450 40H560V150', 'M560 450V560H450', 'M150 560H40V450'].map((d, i) => <path key={i} className="m-draw" d={d} stroke={acc} strokeWidth="14" strokeLinecap="square" {...S()} />)}
          <g className="m-spin" style={{ transformOrigin: '300px 300px' }}>
            {[200, 135, 72].map((r, i) => <circle key={r} className="m-draw" cx="300" cy="300" r={r} stroke={fg} strokeWidth={i === 0 ? 10 : 7} {...S()} />)}
            {Array.from({ length: 6 }).map((_, i) => { const a = (i * 60 * Math.PI) / 180; return <line key={i} className="m-draw" x1={300 + Math.cos(a) * 72} y1={300 + Math.sin(a) * 72} x2={300 + Math.cos(a + 0.5) * 135} y2={300 + Math.sin(a + 0.5) * 135} stroke={acc} strokeWidth="7" {...S()} />; })}
          </g>
          <circle className="m-pop" cx="300" cy="300" r="28" fill={acc} style={{ transformOrigin: '300px 300px' }} />
          <circle className="m-pop" cx="500" cy="96" r="16" fill={a2} style={{ transformOrigin: '500px 96px' }} />
          <text className="m-pop" x="456" y="104" fontSize="26" fontWeight="700" fill={fg} textAnchor="end" style={{ transformOrigin: '456px 96px' }}>REC</text>
        </svg>
      );
    case 'shapes':
      return (
        <svg viewBox="0 0 600 600" width="100%" height="100%" aria-hidden>
          <circle className="m-pop" cx="210" cy="230" r="150" fill={acc} style={{ transformOrigin: '210px 230px' }} />
          <rect className="m-pop" x="270" y="250" width="270" height="270" fill={fg} style={{ transformOrigin: '405px 385px' }} />
          <polygon className="m-pop" points="130,560 270,320 410,560" fill="none" stroke={a2} strokeWidth="14" strokeLinejoin="miter" style={{ transformOrigin: '270px 480px' }} />
          <rect className="m-draw" x="30" y="30" width="540" height="540" stroke={fg} strokeWidth="6" strokeDasharray="1" {...S()} />
          <circle className="m-pop" cx="500" cy="100" r="34" fill={a2} style={{ transformOrigin: '500px 100px' }} />
        </svg>
      );
    case 'timeline':
      return (
        <svg viewBox="0 0 600 600" width="100%" height="100%" aria-hidden>
          {Array.from({ length: 13 }).map((_, i) => <line key={i} className="m-draw" x1={40 + i * 43.3} y1="70" x2={40 + i * 43.3} y2={i % 3 === 0 ? 110 : 94} stroke={fg} strokeWidth="4" {...S()} />)}
          {[[40, 150, 240, accent2()], [290, 150, 270, fgc()], [40, 270, 160, fgc()], [220, 270, 340, accc()], [40, 390, 300, accc()], [360, 390, 200, accent2()], [40, 510, 110, accent2()], [170, 510, 250, fgc()]].map(([x, y, w, c], i) => (
            <rect key={i} className="m-clip" x={x as number} y={y as number} width={(w as number) - 10} height="96" fill={c as string} style={{ transformOrigin: `${x}px ${y}px` }} />
          ))}
          <g className="m-play"><line x1="0" y1="60" x2="0" y2="590" stroke={a2} strokeWidth="8" /><polygon points="-22,30 22,30 0,66" fill={a2} /></g>
        </svg>
      );
    case 'signal':
      return (
        <svg viewBox="0 0 600 600" width="100%" height="100%" aria-hidden>
          {[120, 220, 320, 420].map((r) => <path key={r} className="m-draw" d={`M110 ${490 - r}A${r} ${r} 0 0 1 ${110 + r} 490`} stroke={fg} strokeWidth="14" strokeLinecap="round" {...S()} />)}
          {[220, 320, 420].map((r, i) => { const a = Math.PI / 4; return <rect key={r} className="m-pop" x={110 + r * Math.cos(a) - 26} y={490 - r * Math.sin(a) - 26} width="52" height="52" fill={i === 1 ? a2 : acc} style={{ transformOrigin: `${110 + r * Math.cos(a)}px ${490 - r * Math.sin(a)}px` }} />; })}
          <circle className="m-pop" cx="110" cy="490" r="46" fill={a2} style={{ transformOrigin: '110px 490px' }} />
        </svg>
      );
    case 'folders': {
      const folder = (x: number, y: number, w: number, h: number, fill: string, key: string) => (
        <g className="m-pop" key={key} style={{ transformOrigin: `${x}px ${y + h / 2}px` }}>
          <path d={`M${x} ${y + 18}h${w * 0.38}l16 -18h${w * 0.2}v18z`} fill={fill} opacity=".85" />
          <rect x={x} y={y + 18} width={w} height={h - 18} fill={fill} />
        </g>
      );
      return (
        <svg viewBox="0 0 600 600" width="100%" height="100%" aria-hidden>
          {['M240 300H290V120H330', 'M240 300H330', 'M240 300H290V480H330', 'M520 120H560', 'M520 300H560', 'M520 480H560'].map((d, i) => <path key={i} className="m-draw" d={d} stroke={fg} strokeWidth="8" {...S()} />)}
          {folder(30, 230, 210, 150, acc, 'r')}
          {folder(330, 60, 190, 120, fg, 'a')}{folder(330, 240, 190, 120, a2, 'b')}{folder(330, 420, 190, 120, fg, 'c')}
          {[120, 300, 480].map((y) => <circle key={y} className="m-pop" cx="572" cy={y} r="12" fill={acc} style={{ transformOrigin: `572px ${y}px` }} />)}
        </svg>
      );
    }
    case 'burst': {
      const pts = Array.from({ length: 24 }).map((_, i) => { const a = (i * 15 * Math.PI) / 180 - Math.PI / 2; const r = i % 2 ? 78 : 140; return `${300 + Math.cos(a) * r},${300 + Math.sin(a) * r}`; }).join(' ');
      const pill = (x: number, y: number, w: number, t: string, c: string, tc: string) => (
        <g className="m-pop" key={t} style={{ transformOrigin: `${x + w / 2}px ${y + 30}px` }}><rect x={x} y={y} width={w} height="60" rx="30" fill={c} /><text x={x + w / 2} y={y + 40} fontSize="27" fontWeight="700" textAnchor="middle" fill={tc}>{t}</text></g>
      );
      return (
        <svg viewBox="0 0 600 600" width="100%" height="100%" aria-hidden>
          {['M300 300L120 90', 'M300 300L480 90', 'M300 300L120 510', 'M300 300L480 510'].map((d, i) => <path key={i} className="m-draw" d={d} stroke={fg} strokeWidth="5" strokeDasharray="1" {...S()} />)}
          <g className="m-spin" style={{ transformOrigin: '300px 300px' }}><polygon className="m-pop" points={pts} fill={acc} style={{ transformOrigin: '300px 300px' }} /></g>
          {pill(10, 60, 220, 'FOTOGRAFI', '#fff', '#111827')}{pill(370, 60, 220, 'VIDEOGRAFI', a2, '#fff')}
          {pill(40, 480, 190, 'DESAIN', a2, '#fff')}{pill(370, 480, 190, 'MEDIA', '#fff', '#111827')}
        </svg>
      );
    }
  }
}
// warna helper untuk timeline (variabel CSS)
const accc = () => 'var(--accent)';
const fgc = () => 'var(--fg)';
const accent2 = () => 'var(--accent2)';
