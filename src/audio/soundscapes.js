/*
 * Original generative soundscapes, synthesized live in the visitor's browser with the Web Audio API.
 * No recordings are bundled, so there is nothing to license: every track is generated from the small
 * recipes below. Playback only ever starts from a user gesture (a click on the play control).
 */
export const SOUND_CATEGORIES = ["Ambient", "Cinematic", "Romantic", "Nostalgic", "Dreamy", "Electronic", "Indie", "Acoustic", "Dark", "Nature"];

// Scale degrees → semitones. Chords are built from a scale degree as stacked thirds.
const SCALES = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10], lydian: [0, 2, 4, 6, 7, 9, 11], dorian: [0, 2, 3, 5, 7, 9, 10], phrygian: [0, 1, 3, 5, 7, 8, 10] };

const R = (id, label, category, description, recipe) => ({ id, label, category, description, recipe });
export const SOUNDSCAPES = [
  R("ambient-drift", "Drift", "Ambient", "Slow, airy pads with the odd glassy bell.", { root: 57, scale: "lydian", chords: [0, 5, 3, 4], bpm: 58, bar: 8, pad: { wave: "triangle", cutoff: 1800, level: 0.5 }, arp: { voice: "bell", every: 2, prob: 0.4, oct: 1, level: 0.18 }, delay: 0.45 }),
  R("cinematic-rise", "Horizon", "Cinematic", "A low drone with wide string swells and a distant heartbeat drum.", { root: 50, scale: "minor", chords: [0, 5, 2, 6], bpm: 56, bar: 8, pad: { wave: "sawtooth", cutoff: 900, level: 0.42, attack: 3 }, bass: { level: 0.32 }, kick: { every: 8, level: 0.35 }, delay: 0.25 }),
  R("romantic-strings", "Candlelight", "Romantic", "Warm string pads under a gentle piano line.", { root: 55, scale: "major", chords: [0, 2, 3, 4], bpm: 70, bar: 8, pad: { wave: "sawtooth", cutoff: 1500, level: 0.32 }, arp: { voice: "piano", every: 1, prob: 0.62, oct: 1, level: 0.22 }, delay: 0.3 }),
  R("nostalgic-tape", "Old Reels", "Nostalgic", "Wobbly tape chords, soft keys and vinyl crackle.", { root: 52, scale: "major", chords: [0, 5, 3, 4], seventh: true, bpm: 74, bar: 8, pad: { wave: "triangle", cutoff: 1300, level: 0.42, wow: true }, arp: { voice: "piano", every: 1, prob: 0.5, oct: 1, level: 0.2 }, noise: { kind: "crackle", level: 0.16 } }),
  R("dreamy-shimmer", "Shimmer", "Dreamy", "Sparkling bells drifting through long echoes.", { root: 64, scale: "major", chords: [0, 3, 5, 4], bpm: 84, bar: 8, pad: { wave: "sine", cutoff: 2400, level: 0.32 }, arp: { voice: "bell", every: 0.5, prob: 0.55, oct: 1, level: 0.15 }, delay: 0.55 }),
  R("electronic-pulse", "City Pulse", "Electronic", "A bright synth arpeggio over a soft pulse.", { root: 57, scale: "minor", chords: [0, 5, 2, 6], bpm: 108, bar: 8, pad: { wave: "sawtooth", cutoff: 1100, level: 0.22 }, arp: { voice: "synth", every: 0.5, prob: 1, oct: 1, level: 0.13, pattern: [0, 2, 1, 2] }, bass: { level: 0.3, every: 1 }, kick: { every: 2, level: 0.3 }, delay: 0.3 }),
  R("indie-strum", "Back Porch", "Indie", "Bright strummed chords with a loose, lo-fi feel.", { root: 55, scale: "major", chords: [0, 4, 5, 3], bpm: 92, bar: 8, strum: { every: 2, level: 0.2 }, bass: { level: 0.22, every: 2 }, noise: { kind: "crackle", level: 0.06 } }),
  R("acoustic-pluck", "Fingerpick", "Acoustic", "A fingerpicked guitar-like pattern, warm and close.", { root: 52, scale: "major", chords: [0, 3, 5, 4], bpm: 82, bar: 8, arp: { voice: "pluck", every: 0.5, prob: 1, oct: 0, level: 0.26, pattern: [0, 2, 1, 2, 3, 2, 1, 2] }, bass: { level: 0.18, every: 4 } }),
  R("dark-noir", "Noir", "Dark", "Shadowy low drones, a slow pulse and cold wind.", { root: 45, scale: "phrygian", chords: [0, 1, 0, 6], bpm: 62, bar: 8, pad: { wave: "sawtooth", cutoff: 520, level: 0.48, attack: 2.5 }, bass: { level: 0.38 }, kick: { every: 4, level: 0.32 }, noise: { kind: "wind", level: 0.14 }, delay: 0.2 }),
  R("nature-forest", "Forest Morning", "Nature", "Wind in the trees, birdsong and a faint warm hum.", { root: 55, scale: "major", chords: [0, 3], bpm: 50, bar: 16, pad: { wave: "sine", cutoff: 900, level: 0.12 }, noise: { kind: "wind", level: 0.28 }, birds: true }),
  R("nature-rain", "Rainfall", "Nature", "Steady rain on the window with a distant, low pad.", { root: 50, scale: "minor", chords: [0, 5], bpm: 50, bar: 16, pad: { wave: "sine", cutoff: 700, level: 0.12 }, noise: { kind: "rain", level: 0.42 } }),
  R("midnight-piano", "After Hours", "Romantic", "Sparse late-night keys over soft rain.", { root: 50, scale: "dorian", chords: [0, 5, 2, 6], seventh: true, bpm: 64, bar: 8, pad: { wave: "triangle", cutoff: 900, level: 0.22 }, arp: { voice: "piano", every: 1, prob: 0.45, oct: 1, level: 0.24 }, noise: { kind: "rain", level: 0.1 }, delay: 0.35 }),
];
export const SOUND_BY_ID = Object.fromEntries(SOUNDSCAPES.map((s) => [s.id, s]));

/* ---------- Engine ---------- */
const mtof = (m) => 440 * 2 ** ((m - 69) / 12);
let ctx = null, master = null, bus = null, current = null;
const listeners = new Set();
const emit = () => listeners.forEach((fn) => fn(state()));
export const state = () => ({ playing: !!current, track: current?.id || null });
export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn); }
export const supported = () => typeof window !== "undefined" && !!(window.AudioContext || window.webkitAudioContext);

function ensure() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0;
    master.connect(ctx.destination);
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function noiseBuffer(kind) {
  const len = ctx.sampleRate * 2, buf = ctx.createBuffer(1, len, ctx.sampleRate), d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) {
    if (kind === "crackle") d[i] = Math.random() < 0.0009 ? (Math.random() * 2 - 1) * 0.9 : (Math.random() * 2 - 1) * 0.015;
    else d[i] = Math.random() * 2 - 1;
  }
  return buf;
}

function env(g, t, a, peak, rel, hold = 0) {
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(peak, t + a);
  g.gain.setValueAtTime(peak, t + a + hold);
  g.gain.exponentialRampToValueAtTime(0.0001, t + a + hold + rel);
}

const VOICES = {
  bell(out, f, t, lv) {
    [1, 2.76, 5.4].forEach((h, i) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = "sine"; o.frequency.value = f * h;
      env(g, t, 0.005, lv / (i * 2 + 1), 2.6 / (i + 1));
      o.connect(g).connect(out); o.start(t); o.stop(t + 3);
    });
  },
  piano(out, f, t, lv) {
    [[1, "triangle", 1], [2, "sine", 0.35], [3, "sine", 0.12]].forEach(([h, w, k]) => {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.type = w; o.frequency.value = f * h;
      env(g, t, 0.008, lv * k, 2.4);
      o.connect(g).connect(out); o.start(t); o.stop(t + 2.6);
    });
  },
  pluck(out, f, t, lv) {
    const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = "sawtooth"; o.frequency.value = f;
    lp.type = "lowpass"; lp.frequency.setValueAtTime(f * 8, t); lp.frequency.exponentialRampToValueAtTime(f * 1.2, t + 0.4);
    env(g, t, 0.003, lv, 1.1);
    o.connect(lp).connect(g).connect(out); o.start(t); o.stop(t + 1.3);
  },
  synth(out, f, t, lv) {
    const o = ctx.createOscillator(), g = ctx.createGain(), lp = ctx.createBiquadFilter();
    o.type = "square"; o.frequency.value = f;
    lp.type = "lowpass"; lp.frequency.setValueAtTime(2600, t); lp.frequency.exponentialRampToValueAtTime(500, t + 0.25);
    env(g, t, 0.004, lv, 0.32);
    o.connect(lp).connect(g).connect(out); o.start(t); o.stop(t + 0.4);
  },
};

function pad(out, freqs, t, dur, p) {
  const lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = p.cutoff; lp.Q.value = 0.4;
  const g = ctx.createGain();
  const a = p.attack ?? 1.6;
  g.gain.setValueAtTime(0.0001, t); g.gain.linearRampToValueAtTime(p.level / freqs.length, t + a);
  g.gain.setValueAtTime(p.level / freqs.length, t + Math.max(a, dur - 1.2)); g.gain.linearRampToValueAtTime(0.0001, t + dur + 1.4);
  lp.connect(g).connect(out);
  freqs.forEach((f) => [-6, 6].forEach((cents) => {
    const o = ctx.createOscillator(); o.type = p.wave; o.frequency.value = f; o.detune.value = cents;
    if (p.wow) { const l = ctx.createOscillator(), lg = ctx.createGain(); l.frequency.value = 0.4; lg.gain.value = 9; l.connect(lg).connect(o.detune); l.start(t); l.stop(t + dur + 1.6); }
    o.connect(lp); o.start(t); o.stop(t + dur + 1.6);
  }));
}

function kick(out, t, lv) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.frequency.setValueAtTime(110, t); o.frequency.exponentialRampToValueAtTime(42, t + 0.18);
  env(g, t, 0.004, lv, 0.35);
  o.connect(g).connect(out); o.start(t); o.stop(t + 0.45);
}

function chirp(out, t) {
  const o = ctx.createOscillator(), g = ctx.createGain();
  const base = 2600 + Math.random() * 1600;
  o.type = "sine";
  for (let i = 0; i < 3 + Math.floor(Math.random() * 4); i++) {
    o.frequency.setValueAtTime(base, t + i * 0.09); o.frequency.exponentialRampToValueAtTime(base * 1.35, t + i * 0.09 + 0.06);
  }
  env(g, t, 0.01, 0.035, 0.6);
  o.connect(g).connect(out); o.start(t); o.stop(t + 0.8);
}

function startNoise(out, n) {
  const src = ctx.createBufferSource(); src.buffer = noiseBuffer(n.kind); src.loop = true;
  const g = ctx.createGain(); g.gain.value = n.level;
  const f = ctx.createBiquadFilter();
  let lfo = null;
  if (n.kind === "rain") { f.type = "bandpass"; f.frequency.value = 1400; f.Q.value = 0.5; }
  else if (n.kind === "wind") {
    f.type = "lowpass"; f.frequency.value = 500;
    lfo = ctx.createOscillator(); const lg = ctx.createGain(); lfo.frequency.value = 0.08; lg.gain.value = 300; lfo.connect(lg).connect(f.frequency); lfo.start();
  } else { f.type = "highpass"; f.frequency.value = 900; }
  src.connect(f).connect(g).connect(out); src.start();
  return () => { try { src.stop(); lfo?.stop(); } catch { /* already stopped */ } };
}

// Builds a running soundscape from its recipe; returns a stop() function.
function runRecipe(rc, out) {
  const scale = SCALES[rc.scale] || SCALES.major;
  const note = (deg, oct = 0) => rc.root + scale[((deg % 7) + 7) % 7] + 12 * (Math.floor(deg / 7) + oct);
  const chord = (deg) => [0, 2, 4, ...(rc.seventh ? [6] : [])].map((s) => note(deg + s));
  let wet = out, delayStop = null;
  if (rc.delay) {
    const d = ctx.createDelay(1.5), fb = ctx.createGain(), mixG = ctx.createGain(), lp = ctx.createBiquadFilter();
    d.delayTime.value = (60 / rc.bpm) * 0.75; fb.gain.value = rc.delay; mixG.gain.value = 0.5; lp.type = "lowpass"; lp.frequency.value = 2400;
    const send = ctx.createGain(); send.connect(out); send.connect(d); d.connect(lp).connect(fb).connect(d); lp.connect(mixG).connect(out);
    wet = send; delayStop = () => { fb.gain.value = 0; };
  }
  const stopNoise = rc.noise ? startNoise(out, rc.noise) : null;
  const beat = 60 / rc.bpm;
  let step = 0, next = ctx.currentTime + 0.1;
  const tick = () => {
    while (next < ctx.currentTime + 0.4) {
      const beatIdx = step / 2; // steps are 8th notes
      const barLen = rc.bar;
      const ci = Math.floor(beatIdx / barLen) % rc.chords.length;
      const deg = rc.chords[ci];
      const atBar = beatIdx % barLen === 0;
      if (atBar && rc.pad) pad(out, chord(deg).map((m) => mtof(m - 12)), next, barLen * beat, rc.pad);
      if (rc.bass && beatIdx % (rc.bass.every || barLen) === 0) VOICES.piano(out, mtof(note(deg) - 24), next, rc.bass.level);
      if (rc.kick && beatIdx % rc.kick.every === 0) kick(out, next, rc.kick.level);
      if (rc.arp && (beatIdx / rc.arp.every) % 1 === 0 && Math.random() < rc.arp.prob) {
        const tones = chord(deg);
        const k = Math.round(beatIdx / rc.arp.every);
        const idx = rc.arp.pattern ? rc.arp.pattern[k % rc.arp.pattern.length] : Math.floor(Math.random() * tones.length);
        VOICES[rc.arp.voice](wet, mtof(tones[idx % tones.length] + 12 * rc.arp.oct), next, rc.arp.level);
      }
      if (rc.strum && beatIdx % rc.strum.every === 0) chord(deg).forEach((m, i) => VOICES.pluck(wet, mtof(m), next + i * 0.025, rc.strum.level));
      if (rc.birds && Math.random() < 0.06) chirp(wet, next + Math.random() * beat);
      next += beat / 2; step += 1;
    }
  };
  tick();
  const timer = setInterval(tick, 120);
  return () => { clearInterval(timer); stopNoise?.(); delayStop?.(); };
}

/* Uploaded audio file, routed through the master gain so fades and volume still apply. */
function runFile(url, loop, out) {
  const el = new Audio(); el.src = url; el.loop = loop; el.crossOrigin = "anonymous";
  const src = ctx.createMediaElementSource(el); src.connect(out);
  el.play().catch(() => {});
  return () => { el.pause(); src.disconnect(); };
}

/**
 * Starts playback. Must be called from a user gesture (browsers block audio otherwise).
 * source: soundscape id, or { url } for an uploaded file.
 */
export function play(source, { volume = 0.5, loop = true, fadeIn = 2 } = {}) {
  if (!supported()) return false;
  ensure();
  stop(0.2);
  bus = ctx.createGain(); bus.connect(master);
  const id = typeof source === "string" ? source : "upload";
  const rc = typeof source === "string" ? SOUND_BY_ID[source]?.recipe : null;
  if (!rc && !source?.url) return false;
  const stopper = rc ? runRecipe(rc, bus) : runFile(source.url, loop, bus);
  const t = ctx.currentTime;
  master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t);
  master.gain.linearRampToValueAtTime(volume * 0.6, t + Math.max(0.05, fadeIn));
  current = { id, stopper, bus };
  emit();
  return true;
}

export function stop(fadeOut = 1.5) {
  if (!current || !ctx) return;
  const { stopper, bus: b } = current;
  current = null;
  const t = ctx.currentTime, f = Math.max(0.05, fadeOut);
  b.gain.setValueAtTime(1, t); b.gain.linearRampToValueAtTime(0, t + f);
  setTimeout(() => { stopper(); b.disconnect(); }, f * 1000 + 60);
  emit();
}

export function setVolume(v) {
  if (!ctx || !current) return;
  master.gain.setTargetAtTime(v * 0.6, ctx.currentTime, 0.1);
}

// Tiny interaction cues (only when the visitor has turned sound on).
export function sfx(kind = "click", volume = 0.5) {
  if (!ctx || !current) return;
  const t = ctx.currentTime, o = ctx.createOscillator(), g = ctx.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(kind === "hover" ? 1500 : 900, t); o.frequency.exponentialRampToValueAtTime(kind === "hover" ? 1200 : 520, t + 0.06);
  env(g, t, 0.003, (kind === "hover" ? 0.02 : 0.05) * volume, 0.09);
  o.connect(g).connect(ctx.destination); o.start(t); o.stop(t + 0.15);
}
