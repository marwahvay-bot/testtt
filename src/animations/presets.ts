import gsap from 'gsap';

/** Ease bahasa gerak opening: cepat di awal, mendarat halus (expo-out) & wipe diagonal (power4.inOut). */
export const EASE = { out: 'expo.out', inOut: 'power4.inOut', snap: 'power3.out', back: 'back.out(1.5)' };

type TL = gsap.core.Timeline;
type Scope = string | Element | Element[] | null;

/** Reveal baris bertopeng (masking): isi naik dari bawah garis. */
export const maskLines = (st: TL, sel: Scope, pos: gsap.Position = '>', stagger = 0.09, dur = 0.8) =>
  st.fromTo(sel as gsap.TweenTarget, { yPercent: 118, rotate: 3 }, { yPercent: 0, rotate: 0, duration: dur, stagger, ease: EASE.out }, pos);

/** Kinetic typography per huruf. */
export const kineticChars = (st: TL, sel: Scope, pos: gsap.Position = '>', stagger = 0.025) =>
  st.fromTo(sel as gsap.TweenTarget, { yPercent: 105, rotateX: -80, opacity: 0 }, { yPercent: 0, rotateX: 0, opacity: 1, duration: 0.75, stagger, ease: EASE.out }, pos);

export const fadeUp = (st: TL, sel: Scope, pos: gsap.Position = '>', stagger = 0.08, y = 40, dur = 0.7) =>
  st.fromTo(sel as gsap.TweenTarget, { y, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: dur, stagger, ease: EASE.out }, pos);

export const popIn = (st: TL, sel: Scope, pos: gsap.Position = '>', stagger = 0.07) =>
  st.fromTo(sel as gsap.TweenTarget, { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, stagger, ease: EASE.back }, pos);

export const slideX = (st: TL, sel: Scope, pos: gsap.Position = '>', from = -120, stagger = 0.08) =>
  st.fromTo(sel as gsap.TweenTarget, { x: from, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.75, stagger, ease: EASE.out }, pos);

/** Gambar stroke SVG (elemen wajib punya pathLength="1"). */
export const draw = (st: TL, sel: Scope, pos: gsap.Position = '>', stagger = 0.08, dur = 0.9) =>
  st.fromTo(sel as gsap.TweenTarget, { strokeDasharray: 1, strokeDashoffset: 1, autoAlpha: 1 }, { strokeDashoffset: 0, duration: dur, stagger, ease: 'power2.inOut' }, pos);

/** Wipe horizontal bertopeng (clip-path). */
export const wipeIn = (st: TL, sel: Scope, pos: gsap.Position = '>', stagger = 0.1, dur = 0.8) =>
  st.fromTo(sel as gsap.TweenTarget, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', duration: dur, stagger, ease: EASE.inOut }, pos);

export const reduceMotionQuery = '(prefers-reduced-motion: reduce)';
