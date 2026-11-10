import { useRef } from 'react';
import gsap from 'gsap';
import { useStageTimeline } from '../animations/useStageTimeline';
import { EASE, draw, fadeUp, kineticChars, maskLines, popIn, slideX, wipeIn } from '../animations/presets';
import { Chars, Highlight, Lines, LogoChip } from '../components/text';
import { Motif } from '../components/Motifs';
import * as D from '../data/presentation-data';
import type { SceneMeta } from '../data/presentation-data';

export interface SceneProps { meta: SceneMeta; stage: number; always: boolean; jump: boolean; delay: number }
type R = React.RefObject<HTMLDivElement>;
const useScene = (p: SceneProps, build: Parameters<typeof useStageTimeline>[1]['build']) => {
  const ref = useRef<HTMLDivElement>(null);
  useStageTimeline(ref, { stage: p.stage, always: p.always, initialJump: p.jump, delay: p.delay, build });
  return ref as R;
};

/* ───────────────────────── INTRO — slide 01 ───────────────────────── */
export function IntroScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => {
      st.fromTo('.arc', { strokeDasharray: 1, strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.4, ease: 'power2.inOut' }, 0);
      maskLines(st, '.h .in', 0.05, 0.12, 0.95);
      popIn(st, '.sq', 0.5, 0.1);
    });
    b.stage((st) => { fadeUp(st, '.body-l .in', 0, 0.12, 50, 0.8); });
    b.stage((st) => {
      fadeUp(st, '.flow-label', 0, 0, 20, 0.5);
      st.fromTo('.flow-box', { y: 70, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.18, ease: EASE.out }, 0.1);
      draw(st, '.flow-arrow', 0.35, 0.18, 0.4);
    });
  });
  const colors = ['#fff', 'var(--yellow)', 'var(--red)', 'var(--navy)'];
  const fgs = ['var(--navy)', 'var(--navy)', '#fff', '#fff'];
  return (
    <div className="scene theme-blue" ref={ref}>
      <svg className="abs" style={{ left: 1100, top: -120 }} width="900" height="900" viewBox="0 0 900 900" aria-hidden>
        <circle className="arc" cx="450" cy="450" r="400" fill="none" stroke="var(--yellow)" strokeWidth="3" pathLength={1} opacity=".32" />
        <circle className="arc" cx="450" cy="450" r="300" fill="none" stroke="#fff" strokeWidth="2" pathLength={1} opacity=".1" />
      </svg>
      <div className="abs display h" style={{ left: 110, top: 100, fontSize: 205 }}>
        <Lines lines={D.intro.headline} hiLast />
      </div>
      <div className="abs body-l" style={{ left: 1150, top: 150, width: 650 }}>
        <Lines lines={[D.intro.body]} style={{ fontSize: 38, lineHeight: 1.45 }} />
      </div>
      <div className="sq abs" style={{ right: 70, top: 70 }} />
      <div className="abs flow-label mono-tag" style={{ left: 110, top: 745, color: 'var(--yellow)' }}>{D.intro.flowLabel}</div>
      <div className="abs" style={{ left: 110, top: 800, display: 'flex', alignItems: 'center', gap: 0 }}>
        {D.intro.flow.map((f, i) => (
          <div key={f} style={{ display: 'flex', alignItems: 'center' }}>
            <div className="flow-box display" style={{ background: colors[i], color: fgs[i], fontSize: 46, padding: '30px 38px', minWidth: 330, textAlign: 'center' }}>{f}</div>
            {i < 3 && <svg width="70" height="30" viewBox="0 0 70 30" aria-hidden><path className="flow-arrow" d="M6 15H60M48 5L62 15L48 25" fill="none" stroke="#fff" strokeWidth="4" pathLength={1} /></svg>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── OVERVIEW — slide 02 ───────────────────────── */
export function OverviewScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => { maskLines(st, '.t .in', 0, 0.1, 0.9); popIn(st, '.sq', 0.45, 0.1); st.fromTo('.panel', { xPercent: 100 }, { xPercent: 0, duration: 0.9, ease: EASE.inOut }, 0); });
    b.stage((st) => {
      st.fromTo('.cell', { y: 60, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, stagger: 0.14, ease: EASE.out }, 0);
      st.fromTo('.cell .rule', { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.14, ease: EASE.inOut, transformOrigin: '0 50%' }, 0.05);
    });
  });
  return (
    <div className="scene theme-blue" ref={ref}>
      <div className="abs display t" style={{ left: 110, top: 150, fontSize: 150 }}><Lines lines={D.overview.title} /></div>
      <div className="abs display t" style={{ left: 110, top: 480, fontSize: 150, color: 'var(--yellow)' }}><Lines lines={D.overview.accent} /></div>
      <div className="sq abs" style={{ left: 110, top: 880 }} />
      <div className="abs panel" style={{ left: 800, top: 0, width: 1120, height: 1080, background: '#fff', color: 'var(--navy)', padding: '88px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: 'repeat(3, 1fr)', columnGap: 60 }}>
        {D.prokers.map((pk, i) => (
          <div className="cell" key={pk.id} style={{ position: 'relative', paddingTop: 22 }}>
            <div className="rule" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 4, background: 'var(--navy)' }} />
            <div className="display" style={{ fontSize: 150, color: i % 2 ? 'var(--red)' : 'var(--blue)', lineHeight: 1 }}>{pk.no}</div>
            <div style={{ fontWeight: 700, fontSize: 32, lineHeight: 1.15, marginTop: 4 }}>{pk.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── GOALS — slide 03 ───────────────────────── */
const GoalIcon = ({ kind, c }: { kind: string; c: string }) => {
  const common = { fill: 'none', stroke: c, strokeWidth: 8 };
  return (
    <svg className="gicon" viewBox="0 0 120 120" width="120" height="120" aria-hidden>
      {kind === 'target' && (<><circle {...common} cx="60" cy="60" r="50" pathLength={1} /><circle cx="60" cy="60" r="22" fill={c} /></>)}
      {kind === 'bars' && [[10, 70, 24], [48, 40, 24], [86, 10, 24]].map(([x, y, w], i) => <rect key={i} x={x} y={y} width={w} height={110 - y} fill={c} />)}
      {kind === 'folder' && (<><path d="M6 24h42l12 14h54v70H6z" fill={c} /></>)}
      {kind === 'ring' && (<><circle {...common} cx="60" cy="60" r="50" /><circle {...common} cx="60" cy="60" r="24" stroke="var(--red)" /></>)}
    </svg>
  );
};
export function GoalsScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => { kineticChars(st, '.ttl .ch', 0, 0.025); popIn(st, '.sq', 0.5); });
    b.stage((st) => { st.fromTo('.gcard:nth-child(-n+2)', { yPercent: 18, autoAlpha: 0, clipPath: 'inset(100% 0 0 0)' }, { yPercent: 0, autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.8, stagger: 0.18, ease: EASE.out }, 0); popIn(st, '.gcard:nth-child(-n+2) .gicon', 0.45, 0.15); });
    b.stage((st) => { st.fromTo('.gcard:nth-child(n+3)', { yPercent: 18, autoAlpha: 0, clipPath: 'inset(100% 0 0 0)' }, { yPercent: 0, autoAlpha: 1, clipPath: 'inset(0% 0 0 0)', duration: 0.8, stagger: 0.18, ease: EASE.out }, 0); popIn(st, '.gcard:nth-child(n+3) .gicon', 0.45, 0.15); });
  });
  const st = [
    { bg: 'var(--blue)', num: 'var(--yellow)', fg: '#fff' }, { bg: 'var(--yellow)', num: 'var(--blue)', fg: 'var(--navy)' },
    { bg: '#fff', num: 'var(--blue)', fg: 'var(--navy)' }, { bg: 'var(--blue)', num: 'var(--yellow)', fg: '#fff' },
  ];
  return (
    <div className="scene theme-navy" ref={ref}>
      <div className="abs display ttl" style={{ left: 104, top: 80, fontSize: 118 }}><Chars text={D.goals.title} /></div>
      <div className="sq abs" style={{ right: 80, top: 80 }} />
      <div className="abs" style={{ left: 104, top: 290, right: 104, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, height: 690 }}>
        {D.goals.items.map((g, i) => (
          <div className="gcard" key={g.no} style={{ background: st[i].bg, color: st[i].fg, padding: '38px 36px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div className="display" style={{ fontSize: 210, color: st[i].num, lineHeight: .85 }}>{g.no}</div>
              <GoalIcon kind={g.icon} c={st[i].num} />
            </div>
            <div style={{ marginTop: 'auto' }}>
              <div style={{ fontWeight: 700, fontSize: 38, lineHeight: 1.15 }}>{g.title}</div>
              <div style={{ fontSize: 28, lineHeight: 1.4, marginTop: 16, opacity: .95 }}>{g.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── PROKER (×6) — slide 02 + keterkaitan slide 01/06 ───────────────────────── */
export function ProkerScene(p: SceneProps) {
  const pk = D.prokers[p.meta.proker!];
  const ref = useScene(p, (b) => {
    b.stage((st) => {
      wipeIn(st, '.pnum', 0, 0, 0.9);
      kineticChars(st, '.ptitle .ch', 0.25, 0.03);
      st.fromTo('.motif', { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 0.9, ease: EASE.out }, 0.1);
      draw(st, '.motif .m-draw', 0.25, 0.1, 0.9);
      popIn(st, '.motif .m-pop', 0.55, 0.1);
      st.fromTo('.motif .m-clip', { scaleX: 0 }, { scaleX: 1, duration: 0.7, stagger: 0.09, ease: EASE.inOut }, 0.3);
      st.fromTo('.motif .m-play', { x: 40 }, { x: 330, duration: 1.2, ease: 'power2.inOut' }, 0.5);
      st.fromTo('.motif .m-spin', { rotate: -40 }, { rotate: 0, duration: 1.2, ease: EASE.out }, 0.2);
      st.fromTo('.pbar', { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: EASE.inOut, transformOrigin: '0 50%' }, 0.5);
    });
    b.stage((st) => { fadeUp(st, '.pdesc', 0, 0, 40, 0.8); });
    b.stage((st) => {
      slideX(st, '.panel-h', 0, 60, 0.1);
      st.fromTo('.fstep', { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.55, stagger: 0.09, ease: EASE.out }, 0.1);
      st.fromTo('.fstep.on', { scale: 1 }, { scale: 1.04, duration: 0.4, ease: EASE.back, transformOrigin: '0 50%' }, 0.65);
      st.fromTo('.ochip', { y: 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.55, stagger: 0.12, ease: EASE.out }, 0.3);
    });
  });
  return (
    <div className={`scene theme-${pk.theme}`} ref={ref}>
      <div className="abs display pnum stroke-num" style={{ left: 104, top: 20, fontSize: 380, lineHeight: 1 }}>{pk.no}</div>
      <div className="abs" style={{ left: 110, top: 420, width: 1020 }}>
        <div className="display ptitle" style={{ fontSize: 172 }}>{pk.lines.map((l, i) => <Chars key={i} text={l} className={i === pk.lines.length - 1 && pk.lines.length > 1 ? 'hi' : ''} />)}</div>
        <div className="pbar" style={{ height: 10, width: 220, background: 'var(--accent2)', margin: '30px 0 0' }} />
        <div className="pdesc body-l" style={{ marginTop: 28, fontSize: 40 }}><Highlight text={pk.desc} words={pk.keywords} /></div>
      </div>
      <div className="abs motif" style={{ left: 1190, top: 60, width: 560, height: 560 }}><Motif kind={pk.motif} /></div>
      <div className="abs" style={{ left: 1170, top: 650, width: 660, display: 'grid', gridTemplateColumns: '300px 1fr', columnGap: 36 }}>
        <div>
          <div className="mono-tag panel-h" style={{ fontSize: 20, marginBottom: 14, color: 'var(--accent)' }}>Posisi di alur kerja</div>
          {D.intro.flow.map((f, i) => (
            <div key={f} className={`fstep ${i === pk.flowStep ? 'on' : ''}`} style={{ fontWeight: 700, fontSize: 28, letterSpacing: '.05em', padding: '9px 16px', marginBottom: 8, background: i === pk.flowStep ? 'var(--accent)' : 'var(--soft)', color: i === pk.flowStep ? (pk.theme === 'yellow' ? '#fff' : 'var(--navy)') : 'inherit', opacity: i === pk.flowStep ? 1 : .8 }}>{`0${i + 1}  ${f}`}</div>
          ))}
        </div>
        <div>
          <div className="mono-tag panel-h" style={{ fontSize: 20, marginBottom: 14, color: 'var(--accent)' }}>Contoh output</div>
          {pk.outputs.length ? pk.outputs.map((o) => <div className="ochip" key={o} style={{ fontWeight: 700, fontSize: 27, lineHeight: 1.2, padding: '10px 14px', marginBottom: 8, borderLeft: '8px solid var(--accent2)', background: 'var(--soft)' }}>{o}</div>)
            : <div className="ochip" style={{ fontSize: 27, fontStyle: 'italic', opacity: .9 }}>{D.NOT_IN_SOURCE}</div>}
        </div>
      </div>
      <div className="sq abs" style={{ right: 60, bottom: 80, width: 40, height: 40, background: 'var(--accent2)' }} />
    </div>
  );
}

/* ───────────────────────── ROLES — slide 04 ───────────────────────── */
export function RolesScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => { maskLines(st, '.rt .in', 0, 0.12, 0.9); });
    b.stage((st) => {
      popIn(st, '.hub', 0, 0.1);
      draw(st, '.spoke', 0.2, 0.1, 0.7);
      st.fromTo('.node', { scale: 0, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.6, stagger: 0.12, ease: EASE.back }, 0.45);
      st.to('.hubring', { attr: { r: 150 }, opacity: 0, duration: 0.9, ease: 'power2.out' }, 0.9);
    });
    b.stage((st) => { fadeUp(st, '.rlead', 0, 0, 20, 0.5); st.fromTo('.rpoint', { x: -40, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.55, stagger: 0.14, ease: EASE.out }, 0.1); fadeUp(st, '.rclose', 0.8, 0, 30, 0.7); });
  });
  const pos = [[0, -310], [305, -110], [200, 235], [-200, 235], [-305, -110]];
  return (
    <div className="scene theme-blue" ref={ref}>
      <div className="abs display" style={{ left: 110, top: 70, fontSize: 126 }}>
        <Lines className="rt" lines={[D.roles.title[0]]} />
        <Lines className="rt" lines={[D.roles.title[1]]} hiLast />
        <Lines className="rt" lines={[D.roles.title2[0]]} />
        <Lines className="rt" lines={[D.roles.title2[1]]} hiLast />
      </div>
      <div className="abs rlead" style={{ left: 110, top: 640, fontWeight: 700, fontSize: 34 }}>{D.roles.lead}</div>
      <div className="abs" style={{ left: 110, top: 700, width: 800 }}>
        {D.roles.points.map((t) => <div className="rpoint" key={t} style={{ display: 'flex', alignItems: 'center', gap: 22, fontSize: 36, lineHeight: 1.45 }}><i style={{ width: 20, height: 20, background: 'var(--yellow)', flex: 'none' }} />{t}</div>)}
      </div>
      <div className="abs rclose" style={{ left: 110, top: 940, width: 820, fontWeight: 700, fontSize: 30, color: 'var(--yellow)', lineHeight: 1.3 }}>{D.roles.closing}</div>
      <svg className="abs" style={{ left: 880, top: 0 }} width="960" height="1080" viewBox="-480 -540 960 1080" aria-hidden>
        {pos.map(([x, y], i) => <line key={i} className="spoke" x1="0" y1="0" x2={x} y2={y} stroke="#fff" strokeWidth="4" strokeDasharray="1" pathLength={1} opacity=".7" />)}
        <circle className="hubring" cx="0" cy="0" r="120" fill="none" stroke="var(--yellow)" strokeWidth="4" />
        <g className="hub" style={{ transformOrigin: '0 0' }}><circle cx="0" cy="0" r="125" fill="var(--yellow)" /><text x="0" y="14" textAnchor="middle" fontFamily="Anton" fontSize="52" fill="var(--navy)">SEKBID 6</text></g>
        {D.roles.nodes.map((n, i) => {
          const [x, y] = pos[i]; const last = n === 'ARSIP';
          return (
            <g className="node" key={n} style={{ transformOrigin: `${x}px ${y}px` }}>
              <rect x={x - 150} y={y - 44} width="300" height="88" rx="44" fill={last ? 'var(--red)' : '#fff'} />
              <text x={x} y={y + 11} textAnchor="middle" fontWeight="700" fontSize="31" fill={last ? '#fff' : 'var(--navy)'}>{n}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

/* ───────────────────────── WORKFLOW — slide 05 ───────────────────────── */
export function WorkflowScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => { kineticChars(st, '.wt .ch', 0, 0.02); draw(st, '.wline', 0.3, 0, 1.2); st.fromTo('.wend', { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3 }, 1.2); });
    const step = (idx: number[]) => (st: gsap.core.Timeline) => {
      idx.forEach((i, k) => {
        st.fromTo(`.ws${i} .dot`, { scale: 0 }, { scale: 1, duration: 0.5, ease: EASE.back }, k * 0.3);
        st.fromTo(`.ws${i} .stick`, { scaleY: 0 }, { scaleY: 1, duration: 0.4, ease: EASE.inOut }, k * 0.3 + 0.1);
        st.fromTo(`.ws${i} .txt`, { y: i % 2 ? -30 : 30, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.65, ease: EASE.out }, k * 0.3 + 0.2);
      });
    };
    b.stage(step([0, 1, 2]));
    b.stage(step([3, 4, 5]));
  });
  const xs = D.workflow.steps.map((_, i) => 235 + i * 290);
  return (
    <div className="scene theme-white" ref={ref}>
      <div className="abs display wt" style={{ left: 104, top: 80, fontSize: 112, color: 'var(--blue)' }}><Chars text={D.workflow.title} /></div>
      <svg className="abs" width="1920" height="1080" viewBox="0 0 1920 1080" style={{ left: 0, top: 0 }} aria-hidden>
        <line className="wline" x1="104" y1="560" x2="1816" y2="560" stroke="var(--navy)" strokeWidth="12" strokeLinecap="round" pathLength={1} />
        <g className="wend"><polygon points="1800,540 1830,560 1800,580" fill="var(--navy)" /></g>
      </svg>
      {D.workflow.steps.map((s, i) => {
        const above = i % 2 === 0; const last = i === 5;
        return (
          <div className={`ws${i}`} key={s.no}>
            <div className="abs stick" style={{ left: xs[i] - 2, top: above ? 480 : 560, width: 4, height: above ? 80 : 80, background: 'var(--blue)', transformOrigin: above ? '50% 100%' : '50% 0' }} />
            <div className="abs dot display" style={{ left: xs[i] - 50, top: 510, width: 100, height: 100, borderRadius: '50%', background: last ? 'var(--yellow)' : 'var(--blue)', border: '6px solid var(--navy)', color: last ? 'var(--navy)' : '#fff', display: 'grid', placeItems: 'center', fontSize: 46 }}>{s.no}</div>
            <div className="abs txt" style={{ left: xs[i] - 150, width: 300, textAlign: 'center', color: 'var(--navy)', ...(above ? { bottom: 1080 - 470 } : { top: 650 }) }}>
              <div className="display" style={{ fontSize: 56, color: 'var(--blue)', marginBottom: 10 }}>{s.title}</div>
              <div style={{ fontSize: 28, lineHeight: 1.35 }}>{s.body}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ───────────────────────── OUTPUTS — slide 06 ───────────────────────── */
const OutIcon = ({ id, c }: { id: string; c: string }) => {
  const p = { fill: 'none', stroke: c, strokeWidth: 7, strokeLinejoin: 'round' as const, strokeLinecap: 'round' as const };
  return (
    <svg viewBox="0 0 200 140" width="200" height="140" aria-hidden>
      {id === 'foto' && (<><rect {...p} x="24" y="36" width="152" height="90" rx="10" /><circle {...p} cx="100" cy="80" r="26" /><path {...p} d="M70 36l8-16h44l8 16" /></>)}
      {id === 'video' && (<><rect {...p} x="22" y="22" width="156" height="96" rx="10" /><path d="M85 48v44l38-22z" fill={c} /></>)}
      {id === 'poster' && (<><rect {...p} x="52" y="10" width="96" height="124" /><circle cx="100" cy="52" r="18" fill={c} /><path {...p} d="M70 96h60M70 114h38" /></>)}
      {id === 'medsos' && (<><rect {...p} x="66" y="8" width="68" height="124" rx="12" /><path d="M100 88c-14-10-20-17-20-25 0-6 5-10 10-10 4 0 8 2 10 6 2-4 6-6 10-6 5 0 10 4 10 10 0 8-6 15-20 25z" fill={c} /></>)}
      {id === 'arsip' && (<><rect {...p} x="36" y="14" width="128" height="36" /><rect {...p} x="36" y="56" width="128" height="36" /><rect {...p} x="36" y="98" width="128" height="30" /></>)}
      {id === 'folder' && (<><path {...p} d="M24 36h40l10 12h70v70H24z" /><path {...p} d="M60 78h80M60 98h50" /></>)}
    </svg>
  );
};
export function OutputsScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => { maskLines(st, '.ot .in', 0, 0.1, 0.85); fadeUp(st, '.onote', 0.4, 0, 20, 0.5); });
    const row = (sel: string) => (st: gsap.core.Timeline) => { st.fromTo(sel, { y: 60, autoAlpha: 0, clipPath: 'inset(0 0 100% 0)' }, { y: 0, autoAlpha: 1, clipPath: 'inset(0 0 0% 0)', duration: 0.7, stagger: 0.13, ease: EASE.out }, 0); };
    b.stage(row('.otile:nth-child(-n+4)'));
    b.stage(row('.otile:nth-child(n+5)'));
  });
  const vis = ['var(--navy)', 'var(--navy)', 'var(--yellow)', 'var(--navy)', '#000', '#fff', '#fff', '#fff'];
  const ic = ['#fff', '#fff', 'var(--navy)', '#fff', '', 'var(--blue)', 'var(--blue)', ''];
  return (
    <div className="scene theme-blue" ref={ref}>
      <div className="abs display ot" style={{ left: 104, top: 70, fontSize: 112 }}><Lines lines={[`${D.outputs.title[0]} ${D.outputs.title[1]}`]} /></div>
      <div className="abs onote mono-tag" style={{ left: 108, top: 205, color: 'var(--yellow)', fontSize: 24 }}>{D.outputs.note}</div>
      <div className="abs" style={{ left: 104, right: 104, top: 275, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gridTemplateRows: '1fr 1fr', gap: 24, height: 705 }}>
        {D.outputs.items.map((it, i) => (
          <div className="otile" key={it.id} style={{ display: 'flex', flexDirection: 'column', background: '#000', overflow: 'hidden' }}>
            <div style={{ flex: 1, background: vis[i], display: 'grid', placeItems: 'center', position: 'relative' }}>
              {it.kind === 'concept' && <OutIcon id={it.id} c={ic[i]} />}
              {it.kind === 'real' && <img src="./assets/graphics/opening-title-frame.jpg" alt="Cuplikan video opening Sekbid 6" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />}
              {it.kind === 'web' && (
                <div style={{ position: 'absolute', inset: 0, background: '#fff', color: 'var(--blue)', display: 'flex', alignItems: 'center', gap: 20, padding: '0 22px' }}>
                  <LogoChip src={D.identity.logos.osis} size={110} alt="Logo OSIS" style={{ boxShadow: 'none', flex: 'none' }} />
                  <div><div className="display" style={{ fontSize: 42, lineHeight: 1 }}>{D.outputs.webTitle}</div><div style={{ color: 'var(--navy)', fontSize: 24, marginTop: 6 }}>{D.outputs.webStatus}</div></div>
                </div>
              )}
            </div>
            <div style={{ background: 'var(--yellow)', color: 'var(--navy)', fontWeight: 700, fontSize: 25, padding: '14px 18px', letterSpacing: '.03em' }}>{it.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── PRINCIPLES — slide 07 ───────────────────────── */
export function PrinciplesScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => { maskLines(st, '.pt .in', 0, 0.12, 0.9); popIn(st, '.sq', 0.5); });
    b.stage((st) => {
      st.fromTo('.pcard', { yPercent: 40, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.85, stagger: 0.2, ease: EASE.out }, 0);
      st.fromTo('.pcard .pn', { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.7, stagger: 0.2, ease: EASE.back, transformOrigin: '0 100%' }, 0.3);
    });
  });
  const c = [{ bg: 'var(--blue)', n: 'var(--yellow)', fg: '#fff', t: '#fff' }, { bg: 'var(--yellow)', n: 'var(--blue)', fg: 'var(--navy)', t: 'var(--navy)' }, { bg: '#fff', n: 'var(--red)', fg: 'var(--navy)', t: 'var(--blue)' }];
  return (
    <div className="scene theme-navy" ref={ref}>
      <div className="abs display" style={{ left: 104, top: 80, fontSize: 118 }}><Lines className="pt" lines={D.principles.title} hiLast /></div>
      <div className="sq abs" style={{ right: 90, top: 90 }} />
      <div className="abs" style={{ left: 104, right: 104, top: 380, height: 600, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 28 }}>
        {D.principles.items.map((it, i) => (
          <div className="pcard" key={it.no} style={{ background: c[i].bg, color: c[i].fg, padding: '36px 44px', display: 'flex', flexDirection: 'column' }}>
            <div className="pn display" style={{ fontSize: 230, color: c[i].n, lineHeight: .85 }}>{it.no}</div>
            <div style={{ marginTop: 'auto' }}>
              <div className="display" style={{ fontSize: 76, color: c[i].t }}>{it.title}</div>
              <div style={{ fontSize: 32, lineHeight: 1.4, marginTop: 14 }}>{it.body}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ───────────────────────── CLOSING — slide 08 (+ klimaks logo OSIS) ───────────────────────── */
export function ClosingScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    const line = (i: number) => (st: gsap.core.Timeline) => {
      maskLines(st, `.cl${i} .in`, 0, 0, 0.85);
      if (i === 0) { popIn(st, '.cb', 0.2, 0.08); }
    };
    b.stage(line(0)); b.stage(line(1)); b.stage(line(2));
    b.stage((st) => {
      st.to('.clines', { scale: 0.68, x: -10, y: -70, duration: 1, ease: EASE.inOut, transformOrigin: '0 0' }, 0);
      st.fromTo('.stripe', { xPercent: 130 }, { xPercent: 0, duration: 1, stagger: 0.09, ease: EASE.inOut }, 0.1);
      st.fromTo('.bigLogo', { scale: 0.2, autoAlpha: 0, rotate: -60 }, { scale: 1, autoAlpha: 1, rotate: 0, duration: 1.1, ease: EASE.out }, 0.55);
      draw(st, '.lring', 0.7, 0.15, 1.1);
      fadeUp(st, '.ident > *', 0.9, 0.12, 30, 0.7);
      popIn(st, '.smallLogo', 1.1, 0.15);
    });
  });
  const stripes = [['var(--yellow)', 0], ['#fff', 1], ['var(--red)', 2], ['var(--navy)', 3]];
  return (
    <div className="scene theme-blue" ref={ref}>
      {stripes.map(([c, i]) => (
        <div className="stripe abs" key={i as number} style={{ left: 1160 + (i as number) * 150, top: -80, width: 130, height: 1240, background: c as string, transform: 'skewX(-14deg)', opacity: i === 1 ? 0.95 : 1 }} />
      ))}
      <div className="abs display clines" style={{ left: 110, top: 110, fontSize: 168 }}>
        {D.closing.lines.map((l, i) => (
          <span key={i} className={`line cl${i}`}><span className="in">{l.pre}<span className="hi">{l.hi}</span></span></span>
        ))}
      </div>
      <div className="abs ident" style={{ left: 110, top: 640 }}>
        <div className="display" style={{ fontSize: 96 }}>{D.identity.sekbid}</div>
        <div style={{ fontWeight: 700, fontSize: 34, color: 'var(--yellow)', letterSpacing: '.04em', marginTop: 6 }}>{D.identity.tagline}</div>
        <div style={{ fontWeight: 600, fontSize: 30, marginTop: 20, display: 'flex', gap: 22, alignItems: 'center' }}>{D.identity.org}<span style={{ background: 'var(--yellow)', color: 'var(--navy)', padding: '6px 18px', fontWeight: 700 }}>{D.identity.period}</span></div>
      </div>
      <svg className="abs" style={{ left: 1230, top: 130 }} width="620" height="620" viewBox="0 0 620 620" aria-hidden>
        <circle className="lring" cx="310" cy="310" r="298" fill="none" stroke="var(--yellow)" strokeWidth="6" pathLength={1} />
        <circle className="lring" cx="310" cy="310" r="276" fill="none" stroke="#fff" strokeWidth="3" pathLength={1} opacity=".6" />
      </svg>
      <LogoChip className="bigLogo abs" src={D.identity.logos.osis} size={500} alt="Logo OSIS" style={{ left: 1290, top: 190, position: 'absolute' }} />
      <LogoChip className="smallLogo abs" src={D.identity.logos.sekolah} size={150} alt="Logo SMAN 3 Kuala Kapuas" style={{ left: 1650, top: 800, position: 'absolute' }} />
      <div className="cb sq abs" style={{ left: 110, bottom: 70, width: 30, height: 30 }} />
    </div>
  );
}

/* ───────────────────────── Q&A ───────────────────────── */
export function QaScene(p: SceneProps) {
  const ref = useScene(p, (b) => {
    b.stage((st) => {
      maskLines(st, '.qt .in', 0, 0.12, 0.95);
      st.fromTo('.qmark', { autoAlpha: 0, scale: 0.85 }, { autoAlpha: 1, scale: 1, duration: 1.1, ease: EASE.out }, 0.1);
      st.fromTo('.ybar', { xPercent: -110 }, { xPercent: 0, duration: 1, ease: EASE.inOut }, 0.2);
    });
    b.stage((st) => {
      fadeUp(st, '.qsub', 0, 0, 30, 0.7);
      st.fromTo('.qchip', { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.6, stagger: 0.09, ease: EASE.out }, 0.15);
    });
  });
  return (
    <div className="scene theme-navy" ref={ref}>
      <div className="abs display qmark" style={{ left: 1130, top: -120, fontSize: 1100, lineHeight: 1, color: 'transparent', WebkitTextStroke: '4px rgba(242,230,0,.28)' }}>?</div>
      <div className="abs ybar" style={{ left: -100, top: 800, width: 1300, height: 90, background: 'var(--yellow)', transform: 'skewX(-14deg) rotate(-3deg)', transformOrigin: '0 0' }} />
      <div className="abs display" style={{ left: 110, top: 120, fontSize: 168 }}><Lines className="qt" lines={D.qa.title} hiLast /></div>
      <div className="abs qsub body-l" style={{ left: 110, top: 600, width: 900, fontSize: 44 }}>{D.qa.sub}</div>
      <div className="abs" style={{ left: 1190, top: 330, width: 640, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        {D.prokers.map((pk, i) => (
          <div className="qchip" key={pk.id} style={{ background: i % 3 === 0 ? 'var(--blue)' : i % 3 === 1 ? '#fff' : 'var(--yellow)', color: i % 3 === 0 ? '#fff' : 'var(--navy)', padding: '16px 20px', display: 'flex', gap: 14, alignItems: 'baseline' }}>
            <span className="display" style={{ fontSize: 54, color: i % 3 === 0 ? 'var(--yellow)' : 'var(--blue)', lineHeight: 1 }}>{pk.no}</span>
            <span style={{ fontWeight: 700, fontSize: 23, lineHeight: 1.15 }}>{pk.name}</span>
          </div>
        ))}
      </div>
      <LogoChip src={D.identity.logos.osis} size={110} alt="Logo OSIS" style={{ position: 'absolute', left: 110, bottom: 56 }} />
      <div className="abs mono-tag" style={{ left: 250, bottom: 90, fontSize: 22 }}>{D.identity.sekbid} · {D.identity.org} · {D.identity.period}</div>
    </div>
  );
}

export const sceneComponents: Record<SceneMeta['kind'], (p: SceneProps) => React.JSX.Element> = {
  intro: IntroScene, overview: OverviewScene, goals: GoalsScene, proker: ProkerScene, roles: RolesScene,
  workflow: WorkflowScene, outputs: OutputsScene, principles: PrinciplesScene, closing: ClosingScene, qa: QaScene,
};
