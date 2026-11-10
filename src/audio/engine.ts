import type { Sfx } from '../data/presentation-data';

/**
 * AudioEngine — sound design prosedural (WebAudio), tanpa file eksternal.
 * - Musik: pad ambient instrumental (4 akor, loop lambat) di bus musik bervolume rendah.
 * - SFX: whoosh / impact / riser / sweep / tick. Hanya SATU SFX aktif pada satu waktu (tidak overlap).
 * - Opening MP4 memakai audio aslinya (elemen <video>), bukan engine ini.
 * Ganti dengan file audio sungguhan: lihat README bagian "Asset replacement".
 */
const CHORDS = [
  [220.0, 261.63, 329.63], // Am
  [174.61, 220.0, 261.63], // F
  [196.0, 261.63, 329.63], // C/G
  [196.0, 246.94, 293.66], // G
];

export class AudioEngine {
  ctx: AudioContext | null = null;
  private master!: GainNode;
  private musicBus!: GainNode;
  private sfxBus!: GainNode;
  private noise!: AudioBuffer;
  private musicOscs: OscillatorNode[] = [];
  private musicTimer: number | null = null;
  private chordIdx = 0;
  private musicOn = false;
  private activeSfx: { stop: () => void } | null = null;
  volume = 0.6;
  muted = false;
  /** untuk pengujian */
  stats = { sfxPlayed: 0, musicStarts: 0, lastSfx: '' as string };

  ensure() {
    if (!this.ctx) {
      const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AC) return null;
      this.ctx = new AC();
      this.master = this.ctx.createGain();
      this.musicBus = this.ctx.createGain();
      this.sfxBus = this.ctx.createGain();
      this.musicBus.gain.value = 0;
      this.sfxBus.gain.value = 0.55;
      this.musicBus.connect(this.master);
      this.sfxBus.connect(this.master);
      this.master.connect(this.ctx.destination);
      this.applyGain();
      const len = this.ctx.sampleRate * 2;
      this.noise = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const d = this.noise.getChannelData(0);
      for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    }
    if (this.ctx.state === 'suspended') void this.ctx.resume();
    return this.ctx;
  }

  private applyGain() {
    if (!this.ctx) return;
    this.master.gain.setTargetAtTime(this.muted ? 0 : this.volume, this.ctx.currentTime, 0.05);
  }
  setVolume(v: number) { this.volume = Math.min(1, Math.max(0, v)); this.applyGain(); }
  setMuted(m: boolean) { this.muted = m; this.applyGain(); }

  /* ───── Musik ───── */
  startMusic() {
    const ctx = this.ensure();
    if (!ctx || this.musicOn) return;
    this.musicOn = true;
    this.stats.musicStarts++;
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass'; filter.frequency.value = 900; filter.Q.value = 0.6;
    filter.connect(this.musicBus);
    const lfo = ctx.createOscillator(); const lfoG = ctx.createGain();
    lfo.frequency.value = 0.08; lfoG.gain.value = 350; lfo.connect(lfoG); lfoG.connect(filter.frequency); lfo.start();
    this.musicOscs = [lfo];
    CHORDS[0].forEach((f, i) => {
      [-6, 6].forEach((det) => {
        const o = ctx.createOscillator(); o.type = i === 0 ? 'sawtooth' : 'triangle';
        o.frequency.value = f; o.detune.value = det;
        const g = ctx.createGain(); g.gain.value = 0.16;
        o.connect(g); g.connect(filter); o.start(); this.musicOscs.push(o);
      });
    });
    const sub = ctx.createOscillator(); sub.type = 'sine'; sub.frequency.value = CHORDS[0][0] / 2;
    const sg = ctx.createGain(); sg.gain.value = 0.3; sub.connect(sg); sg.connect(this.musicBus); sub.start();
    this.musicOscs.push(sub);
    this.musicBus.gain.cancelScheduledValues(ctx.currentTime);
    this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, ctx.currentTime);
    this.musicBus.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 3);
    this.chordIdx = 0;
    this.musicTimer = window.setInterval(() => this.nextChord(), 7000);
  }
  private nextChord() {
    if (!this.ctx || !this.musicOn) return;
    this.chordIdx = (this.chordIdx + 1) % CHORDS.length;
    const ch = CHORDS[this.chordIdx];
    const t = this.ctx.currentTime;
    // osilator: [lfo, (3 notes × 2 detune), sub]
    for (let n = 0; n < 3; n++) for (let k = 0; k < 2; k++) this.musicOscs[1 + n * 2 + k].frequency.setTargetAtTime(ch[n], t, 1.2);
    this.musicOscs[7].frequency.setTargetAtTime(ch[0] / 2, t, 1.2);
  }
  stopMusic(fade = 1.2) {
    if (!this.ctx || !this.musicOn) return;
    this.musicOn = false;
    if (this.musicTimer) { clearInterval(this.musicTimer); this.musicTimer = null; }
    const t = this.ctx.currentTime;
    this.musicBus.gain.cancelScheduledValues(t);
    this.musicBus.gain.setValueAtTime(this.musicBus.gain.value, t);
    this.musicBus.gain.linearRampToValueAtTime(0, t + fade);
    const oscs = this.musicOscs; this.musicOscs = [];
    window.setTimeout(() => oscs.forEach((o) => { try { o.stop(); o.disconnect(); } catch { /* noop */ } }), fade * 1000 + 100);
  }
  get musicPlaying() { return this.musicOn; }

  /* ───── SFX ───── */
  play(name: Sfx) {
    if (!name) return;
    const ctx = this.ensure();
    if (!ctx || this.muted) return;
    this.activeSfx?.stop(); // anti-overlap
    const t = ctx.currentTime;
    const out = ctx.createGain(); out.connect(this.sfxBus);
    const nodes: AudioScheduledSourceNode[] = [];
    const src = (): AudioBufferSourceNode => { const s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true; nodes.push(s); return s; };
    const osc = (type: OscillatorType): OscillatorNode => { const o = ctx.createOscillator(); o.type = type; nodes.push(o); return o; };
    let dur = 0.6;
    switch (name) {
      case 'whoosh': {
        const n = src(); const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 1.1;
        f.frequency.setValueAtTime(300, t); f.frequency.exponentialRampToValueAtTime(3200, t + 0.45);
        out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.5, t + 0.2); out.gain.exponentialRampToValueAtTime(0.0001, t + 0.6);
        n.connect(f); f.connect(out); dur = 0.65; break;
      }
      case 'sweep': {
        const n = src(); const f = ctx.createBiquadFilter(); f.type = 'highpass'; f.Q.value = 0.8;
        f.frequency.setValueAtTime(6000, t); f.frequency.exponentialRampToValueAtTime(700, t + 0.5);
        out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.28, t + 0.08); out.gain.exponentialRampToValueAtTime(0.0001, t + 0.55);
        n.connect(f); f.connect(out); dur = 0.6; break;
      }
      case 'impact': {
        const o = osc('sine'); o.frequency.setValueAtTime(130, t); o.frequency.exponentialRampToValueAtTime(38, t + 0.5);
        const n = src(); const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 900;
        const ng = ctx.createGain(); ng.gain.setValueAtTime(0.35, t); ng.gain.exponentialRampToValueAtTime(0.0001, t + 0.25);
        out.gain.setValueAtTime(0.9, t); out.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
        o.connect(out); n.connect(f); f.connect(ng); ng.connect(out); dur = 1.2; break;
      }
      case 'riser': {
        const n = src(); const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.Q.value = 2.2;
        f.frequency.setValueAtTime(200, t); f.frequency.exponentialRampToValueAtTime(5000, t + 1.8);
        out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.42, t + 1.7); out.gain.linearRampToValueAtTime(0.0001, t + 1.9);
        n.connect(f); f.connect(out); dur = 2; break;
      }
      case 'tick': {
        const o = osc('triangle'); o.frequency.setValueAtTime(1180, t); o.frequency.exponentialRampToValueAtTime(680, t + 0.09);
        out.gain.setValueAtTime(0.0001, t); out.gain.exponentialRampToValueAtTime(0.35, t + 0.005); out.gain.exponentialRampToValueAtTime(0.0001, t + 0.14);
        o.connect(out); dur = 0.18; break;
      }
    }
    nodes.forEach((n) => n.start(t));
    const stop = () => {
      try { out.gain.cancelScheduledValues(ctx.currentTime); out.gain.setTargetAtTime(0, ctx.currentTime, 0.015); } catch { /* noop */ }
      window.setTimeout(() => { nodes.forEach((n) => { try { n.stop(); } catch { /* noop */ } }); out.disconnect(); }, 80);
      if (this.activeSfx?.stop === stop) this.activeSfx = null;
    };
    this.activeSfx = { stop };
    window.setTimeout(() => { if (this.activeSfx?.stop === stop) { nodes.forEach((n) => { try { n.stop(); } catch { /* noop */ } }); out.disconnect(); this.activeSfx = null; } }, dur * 1000 + 100);
    this.stats.sfxPlayed++; this.stats.lastSfx = name;
  }
  stopSfx() { this.activeSfx?.stop(); }

  dispose() { this.stopMusic(0.1); this.stopSfx(); void this.ctx?.close(); this.ctx = null; }
}
