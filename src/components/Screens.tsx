import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Lines, LogoChip } from './text';
import { EASE } from '../animations/presets';
import { identity } from '../data/presentation-data';
import type { Deck } from '../presenter/deck';
import type { AudioEngine } from '../audio/engine';
import { openPresenter, toggleFullscreen } from '../presenter/windows';

/** Cinematic Start Screen — mengikuti Visual DNA opening (navy, garis kuning, tiga logo, SEKBID 6). */
export function StartScreen({ deck, audio, reduced, role }: { deck: Deck; audio: AudioEngine | null; reduced: boolean; role: 'audience' | 'preview' }) {
  const ref = useRef<HTMLDivElement>(null);
  const [popupMsg, setPopupMsg] = useState('');
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: EASE.out } });
      tl.fromTo('.s-line', { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: EASE.inOut, transformOrigin: '50% 50%' }, 0)
        .fromTo('.s-arc', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0.1)
        .fromTo('.s-logo', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.14, ease: EASE.back }, 0.3)
        .fromTo('.s-title .in', { yPercent: 118 }, { yPercent: 0, duration: 0.9, stagger: 0.1 }, 0.7)
        .fromTo('.s-six', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, ease: EASE.back }, 1.0)
        .fromTo('.s-tag, .s-org', { y: 24, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 }, 1.2)
        .fromTo('.btn-start, .hint', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.1 }, 1.5);
      if (reduced) tl.progress(1);
    }, ref);
    return () => ctx.revert();
  }, [reduced]);
  const start = () => {
    audio?.ensure();
    if (role === 'audience') void toggleFullscreen(true);
    deck.dispatch({ type: 'startOpening' });
  };
  return (
    <div className="start" ref={ref}>
      <svg className="abs" style={{ left: 0, top: 0 }} width="1920" height="1080" viewBox="0 0 1920 1080" aria-hidden>
        <circle className="s-arc" cx="960" cy="470" r="420" fill="none" stroke="var(--yellow)" strokeWidth="2" opacity=".35" pathLength={1} />
        <circle className="s-arc" cx="960" cy="470" r="520" fill="none" stroke="#fff" strokeWidth="1.5" opacity=".1" pathLength={1} />
      </svg>
      <div className="abs s-line" style={{ left: 260, right: 260, top: 330, height: 3, background: 'var(--yellow)', opacity: 0.65 }} />
      <div className="abs" style={{ left: 0, right: 0, top: 130, display: 'flex', justifyContent: 'center', gap: 44 }}>
        {[identity.logos.osis, identity.logos.sekolah, identity.logos.sekbid6].map((src, i) => <LogoChip key={i} className="s-logo" src={src} size={170} alt={['Logo OSIS', 'Logo SMAN 3 Kuala Kapuas', 'Logo Sekbid 6'][i]} />)}
      </div>
      <div className="abs display s-title" style={{ left: 0, right: 0, top: 360, textAlign: 'center', fontSize: 270, display: 'flex', justifyContent: 'center', gap: 36 }}>
        <Lines lines={['SEKBID']} />
        <span className="s-six" style={{ color: 'var(--yellow)', textShadow: '14px 14px 0 var(--red)', display: 'inline-block' }}>6</span>
      </div>
      <div className="abs s-tag" style={{ left: 0, right: 0, top: 690, textAlign: 'center', fontWeight: 700, fontSize: 36, letterSpacing: '.12em' }}><span style={{ color: 'var(--yellow)' }}>PUBLIKASI,</span> DOKUMENTASI & DESAIN</div>
      <div className="abs s-org mono-tag" style={{ left: 0, right: 0, top: 750, textAlign: 'center', fontSize: 22, color: 'rgba(255,255,255,.7)' }}>{identity.org} · {identity.period}</div>
      <button className="btn-start" onClick={start} aria-label="Start Presentation">START PRESENTATION</button>
      <div className="hint">
        Spasi / → lanjut · ← mundur · F fullscreen · R ulang animasi · O overview ·{' '}
        {role === 'audience' && (
          <button onClick={() => { const w = openPresenter(); setPopupMsg(w ? '' : 'Popup diblokir browser. Izinkan popup untuk situs ini, lalu coba lagi.'); }}>Buka Presenter View (P)</button>
        )}
        {popupMsg && <div style={{ color: '#ff7b78', marginTop: 8 }}>{popupMsg}</div>}
      </div>
    </div>
  );
}

/** Opening MP4 — audio asli dipertahankan. Autoplay: dipicu oleh klik START; jika gagal tampil retry. */
export function Opening({ deck, showVideo }: { deck: Deck; showVideo: boolean }) {
  const v = useRef<HTMLVideoElement>(null);
  const [failed, setFailed] = useState(false);
  const { muted, volume } = deck.state;
  useEffect(() => { const el = v.current; if (el) { el.muted = muted; el.volume = volume; } }, [muted, volume]);
  const play = () => { const el = v.current; if (!el) return; setFailed(false); el.currentTime = el.ended ? 0 : el.currentTime; el.muted = deck.state.muted; el.play().catch(() => setFailed(true)); };
  useEffect(() => { if (showVideo) play(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  if (!showVideo) return <div className="opening-wrap" style={{ display: 'grid', placeItems: 'center', fontSize: 40 }}>Opening berlangsung di layar audiens…</div>;
  return (
    <div className="opening-wrap">
      <video ref={v} src="./opening/opening.mp4" poster="./assets/graphics/opening-poster.jpg" playsInline preload="auto" data-testid="opening-video"
        onEnded={() => deck.dispatch({ type: 'finishOpening' })} onError={() => setFailed(true)} />
      {failed && (
        <div className="retry" role="alert">
          <p>Opening belum bisa diputar otomatis (kebijakan autoplay browser atau file gagal dimuat).</p>
          <button onClick={play}>PUTAR OPENING</button>
          <button style={{ fontSize: 28, background: 'transparent', color: '#fff', border: '2px solid #fff' }} onClick={() => deck.dispatch({ type: 'finishOpening' })}>LEWATI KE PRESENTASI</button>
        </div>
      )}
    </div>
  );
}
