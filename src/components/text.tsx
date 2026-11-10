import { CSSProperties } from 'react';

/** Baris bertopeng untuk reveal (class .line > .in). */
export const Lines = ({ lines, className = '', style, hiLast = false }: { lines: string[]; className?: string; style?: CSSProperties; hiLast?: boolean }) => (
  <>
    {lines.map((l, i) => (
      <span className={`line ${className}`} style={style} key={i}><span className={`in ${hiLast && i === lines.length - 1 ? 'hi' : ''}`}>{l}</span></span>
    ))}
  </>
);

/** Teks per-huruf untuk kinetic typography. */
export const Chars = ({ text, className = '' }: { text: string; className?: string }) => (
  <span className={`line ${className}`} aria-label={text}>
    {Array.from(text).map((c, i) => (
      <span className="ch" aria-hidden key={i} style={{ display: 'inline-block', whiteSpace: 'pre', transformOrigin: '50% 100%' }}>{c}</span>
    ))}
  </span>
);

/** Sorot kata kunci dalam kalimat sumber (tidak mengubah teks). */
export function Highlight({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const re = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'gi');
  return <>{text.split(re).map((p, i) => (words.some((w) => w.toLowerCase() === p.toLowerCase()) ? <mark key={i}>{p}</mark> : <span key={i}>{p}</span>))}</>;
}

export const LogoChip = ({ src, size, alt, className = '', style }: { src: string; size: number; alt: string; className?: string; style?: CSSProperties }) => (
  <div className={`logo-chip ${className}`} style={{ width: size, height: size, ...style }}><img src={src} alt={alt} draggable={false} /></div>
);
