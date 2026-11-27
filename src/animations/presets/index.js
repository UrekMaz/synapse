import { baseTransition } from "../../utils/easings.js";

export const REST = { opacity: 1, x: 0, y: 0, scale: 1, rotate: 0, rotateX: 0, rotateY: 0, skewX: 0, filter: "blur(0px)", clipPath: "inset(0% 0% 0% 0%)" };
export const pick = (src, keys) => Object.fromEntries(keys.filter((k) => k in src).map((k) => [k, src[k]]));
const num = (v, d) => (typeof v === "number" && !Number.isNaN(v) ? v : d);
const CLIP = {
  up: "inset(100% 0% 0% 0%)", down: "inset(0% 0% 100% 0%)",
  left: "inset(0% 0% 0% 100%)", right: "inset(0% 100% 0% 0%)",
};

export const PRESETS = {};
const add = (p) => { PRESETS[p.id] = p; };
const E = ["duration", "delay", "easing"];
const TXT = ["split", "stagger"];
const LOOP = ["duration", "delay", "easing", "repeat", "reverse"];

/* ---------- Entrance ---------- */
add({ id: "fade-in", label: "Fade In", kind: "entrance", controls: [...E, "opacity", ...TXT], defaults: { duration: 0.8, easing: "ease-out", opacity: 0 }, from: (c) => ({ opacity: num(c.opacity, 0) }) });
add({ id: "slide-up", label: "Slide Up", kind: "entrance", controls: [...E, "distance", ...TXT], defaults: { duration: 0.8, easing: "ease-out", distance: 48 }, from: (c) => ({ opacity: 0, y: num(c.distance, 48) }) });
add({ id: "slide-down", label: "Slide Down", kind: "entrance", controls: [...E, "distance"], defaults: { duration: 0.8, easing: "ease-out", distance: 48 }, from: (c) => ({ opacity: 0, y: -num(c.distance, 48) }) });
add({ id: "slide-left", label: "Slide Left", kind: "entrance", controls: [...E, "distance"], defaults: { duration: 0.8, easing: "ease-out", distance: 60 }, from: (c) => ({ opacity: 0, x: num(c.distance, 60) }) });
add({ id: "slide-right", label: "Slide Right", kind: "entrance", controls: [...E, "distance"], defaults: { duration: 0.8, easing: "ease-out", distance: 60 }, from: (c) => ({ opacity: 0, x: -num(c.distance, 60) }) });
add({ id: "zoom-in", label: "Zoom In", kind: "entrance", controls: [...E, "scale"], defaults: { duration: 0.7, easing: "ease-out", scale: 0.6 }, from: (c) => ({ opacity: 0, scale: num(c.scale, 0.6) }) });
add({ id: "zoom-out", label: "Zoom Out", kind: "entrance", controls: [...E, "scale"], defaults: { duration: 0.9, easing: "ease-out", scale: 1.4 }, from: (c) => ({ opacity: 0, scale: num(c.scale, 1.4) }) });
add({ id: "rotate-in", label: "Rotate In", kind: "entrance", controls: [...E, "rotation"], defaults: { duration: 0.9, easing: "ease-out", rotation: -15 }, from: (c) => ({ opacity: 0, rotate: num(c.rotation, -15), scale: 0.9 }) });
add({ id: "blur-reveal", label: "Blur Reveal", kind: "entrance", controls: [...E, "blur", ...TXT], defaults: { duration: 0.9, easing: "ease-out", blur: 16 }, from: (c) => ({ opacity: 0, filter: `blur(${num(c.blur, 16)}px)`, y: 12 }) });
add({ id: "clip-reveal", label: "Clip Reveal", kind: "entrance", controls: [...E, "direction"], defaults: { duration: 1, easing: "expo-out", direction: "up" }, from: (c) => ({ clipPath: CLIP[c.direction] || CLIP.up }) });
add({ id: "mask-up", label: "Slide Up Reveal", kind: "entrance", mask: true, controls: E, defaults: { duration: 0.9, easing: "expo-out" }, from: () => ({ y: "110%" }) });
add({ id: "char-reveal", label: "Character Reveal", kind: "entrance", mask: true, split: "chars", textOnly: true, controls: [...E, ...TXT], defaults: { duration: 0.8, easing: "expo-out", split: "chars", stagger: 0.035 }, from: () => ({ y: "110%" }) });
add({ id: "word-stagger", label: "Word Stagger", kind: "entrance", textOnly: true, controls: [...E, ...TXT], defaults: { duration: 0.8, easing: "ease-out", split: "words", stagger: 0.08 }, from: () => ({ opacity: 0, y: 36, filter: "blur(6px)" }) });
add({ id: "distort-in", label: "Text Distortion", kind: "entrance", controls: E, defaults: { duration: 0.9, easing: "expo-out" }, from: () => ({ opacity: 0, skewX: -30, x: -80, filter: "blur(10px)" }) });
/* Spatial / cinematic entrances used by the signature heroes (available to every element). */
add({ id: "wipe-horizontal", label: "Horizontal Wipe", kind: "entrance", controls: [...E, "direction"], defaults: { duration: 1.1, easing: "expo-out", direction: "right" }, from: (c) => ({ clipPath: c.direction === "left" ? CLIP.left : CLIP.right }) });
add({ id: "wipe-vertical", label: "Vertical Wipe", kind: "entrance", controls: [...E, "direction"], defaults: { duration: 1.1, easing: "expo-out", direction: "up" }, from: (c) => ({ clipPath: c.direction === "down" ? CLIP.down : CLIP.up }) });
add({ id: "curtain", label: "Curtain Reveal", kind: "entrance", controls: E, defaults: { duration: 1.2, easing: "expo-out" }, from: () => ({ clipPath: "inset(0% 50% 0% 50%)" }) });
add({ id: "expand-reveal", label: "Panel Expansion", kind: "entrance", controls: [...E, "scale"], defaults: { duration: 1.2, easing: "expo-out", scale: 0.86 }, from: (c) => ({ clipPath: "inset(18% 18% 18% 18%)", scale: num(c.scale, 0.86), opacity: 0 }) });
add({ id: "image-zoom", label: "Image Zoom", kind: "entrance", controls: [...E, "scale"], defaults: { duration: 1.6, easing: "expo-out", scale: 1.35 }, from: (c) => ({ scale: num(c.scale, 1.35), opacity: 0 }) });
add({ id: "crossfade", label: "Crossfade", kind: "entrance", controls: [...E, "blur"], defaults: { duration: 1.2, easing: "ease-in-out", blur: 10 }, from: (c) => ({ opacity: 0, scale: 1.04, filter: `blur(${num(c.blur, 10)}px)` }) });
add({ id: "perspective-in", label: "Perspective Reveal", kind: "entrance", controls: [...E, "rotation", "distance"], defaults: { duration: 1.3, easing: "expo-out", rotation: 24, distance: 90 }, from: (c) => ({ opacity: 0, rotateX: num(c.rotation, 24), y: num(c.distance, 90), scale: 0.94, transformPerspective: 1400 }) });
add({ id: "orbit-in", label: "Orbit In", kind: "entrance", controls: [...E, "rotation", "scale"], defaults: { duration: 1.4, easing: "back-out", rotation: -140, scale: 0.2 }, from: (c) => ({ opacity: 0, scale: num(c.scale, 0.2), rotate: num(c.rotation, -140) }) });
add({ id: "light-reveal", label: "Light Reveal", kind: "entrance", controls: [...E, "blur", "scale"], defaults: { duration: 1.6, easing: "expo-out", blur: 30, scale: 0.82 }, from: (c) => ({ opacity: 0, scale: num(c.scale, 0.82), filter: `blur(${num(c.blur, 30)}px)` }) });

/* ---------- Emphasis (loops) ---------- */
add({ id: "pulse", label: "Pulse", kind: "emphasis", controls: [...LOOP, "scale"], defaults: { duration: 1.6, easing: "ease-in-out", repeat: "infinite", scale: 1.08 }, loop: (c) => ({ scale: [1, num(c.scale, 1.08), 1] }) });
add({ id: "bounce", label: "Bounce", kind: "emphasis", controls: [...LOOP, "amplitude"], defaults: { duration: 1.2, easing: "ease-out", repeat: "infinite", amplitude: 26 }, loop: (c) => ({ y: [0, -num(c.amplitude, 26), 0, -num(c.amplitude, 26) * 0.35, 0] }) });
add({ id: "float", label: "Float", kind: "emphasis", controls: [...LOOP, "amplitude"], defaults: { duration: 3.2, easing: "ease-in-out", repeat: "infinite", amplitude: 14 }, loop: (c) => ({ y: [0, -num(c.amplitude, 14), 0] }) });
add({ id: "shake", label: "Shake", kind: "emphasis", controls: [...LOOP, "amplitude"], defaults: { duration: 0.6, easing: "ease-in-out", repeat: 2, amplitude: 7 }, loop: (c) => ({ x: [0, -num(c.amplitude, 7), num(c.amplitude, 7), -num(c.amplitude, 7), num(c.amplitude, 7), 0] }) });
add({ id: "glow", label: "Glow", kind: "emphasis", controls: [...LOOP, "amplitude", "color"], defaults: { duration: 1.8, easing: "ease-in-out", repeat: "infinite", amplitude: 22, color: "#8b6cff" }, loop: (c) => ({ filter: [`drop-shadow(0 0 0px ${c.color})`, `drop-shadow(0 0 ${num(c.amplitude, 22)}px ${c.color})`, `drop-shadow(0 0 0px ${c.color})`] }) });
add({ id: "tilt", label: "Tilt", kind: "emphasis", controls: [...LOOP, "amplitude"], defaults: { duration: 2.4, easing: "ease-in-out", repeat: "infinite", amplitude: 4 }, loop: (c) => ({ rotate: [-num(c.amplitude, 4), num(c.amplitude, 4), -num(c.amplitude, 4)] }) });
add({ id: "scale", label: "Scale", kind: "emphasis", controls: [...LOOP, "scale"], defaults: { duration: 1.4, easing: "ease-in-out", repeat: "infinite", scale: 1.12 }, loop: (c) => ({ scale: [1, num(c.scale, 1.12), 1] }) });
add({ id: "orbit", label: "Orbit", kind: "emphasis", controls: [...LOOP, "amplitude"], defaults: { duration: 6, easing: "linear", repeat: "infinite", amplitude: 18 }, loop: (c) => { const a = num(c.amplitude, 18); return { x: [0, a, 0, -a, 0], y: [-a, 0, a, 0, -a] }; } });
add({ id: "drift", label: "Drift", kind: "emphasis", controls: [...LOOP, "amplitude"], defaults: { duration: 7, easing: "ease-in-out", repeat: "infinite", amplitude: 22 }, loop: (c) => { const a = num(c.amplitude, 22); return { x: [0, a, -a * 0.4, 0], y: [0, -a * 0.6, a * 0.3, 0] }; } });
add({ id: "spin", label: "Continuous Spin", kind: "emphasis", controls: ["duration", "delay", "repeat"], defaults: { duration: 14, easing: "linear", repeat: "infinite" }, loop: () => ({ rotate: [0, 360] }) });
add({ id: "wobble", label: "Wobble", kind: "emphasis", controls: [...LOOP, "amplitude"], defaults: { duration: 1.2, easing: "ease-in-out", repeat: 1, amplitude: 6 }, loop: (c) => ({ rotate: [0, -num(c.amplitude, 6), num(c.amplitude, 6) * 0.6, -num(c.amplitude, 6) * 0.3, 0] }) });

/* ---------- Exit ---------- */
add({ id: "fade-out", label: "Fade Out", kind: "exit", controls: E, defaults: { duration: 0.6, easing: "ease-in" }, to: () => ({ opacity: 0 }) });
add({ id: "slide-out", label: "Slide Out", kind: "exit", controls: [...E, "distance"], defaults: { duration: 0.6, easing: "ease-in", distance: 60 }, to: (c) => ({ opacity: 0, y: -num(c.distance, 60) }) });
add({ id: "exit-zoom-out", label: "Zoom Out", kind: "exit", controls: [...E, "scale"], defaults: { duration: 0.6, easing: "ease-in", scale: 0.6 }, to: (c) => ({ opacity: 0, scale: num(c.scale, 0.6) }) });
add({ id: "rotate-out", label: "Rotate Out", kind: "exit", controls: [...E, "rotation"], defaults: { duration: 0.7, easing: "ease-in", rotation: 20 }, to: (c) => ({ opacity: 0, rotate: num(c.rotation, 20) }) });
add({ id: "shrink", label: "Shrink", kind: "exit", controls: E, defaults: { duration: 0.6, easing: "ease-in" }, to: () => ({ opacity: 0, scale: 0 }) });

/* ---------- Hover (trigger is always hover) ---------- */
const H = ["duration", "easing"];
add({ id: "hover-scale", label: "Scale on Hover", kind: "hover", controls: [...H, "scale"], defaults: { duration: 0.3, easing: "ease-out", scale: 1.08 }, hover: (c) => ({ scale: num(c.scale, 1.08) }) });
add({ id: "hover-lift", label: "Lift", kind: "hover", controls: [...H, "distance"], defaults: { duration: 0.3, easing: "ease-out", distance: 8 }, hover: (c) => ({ y: -num(c.distance, 8), scale: 1.02 }) });
add({ id: "hover-tilt", label: "Tilt on Hover", kind: "hover", controls: [...H, "rotation"], defaults: { duration: 0.3, easing: "ease-out", rotation: 3 }, hover: (c) => ({ rotate: num(c.rotation, 3) }) });
add({ id: "hover-glow", label: "Glow on Hover", kind: "hover", controls: [...H, "amplitude", "color"], defaults: { duration: 0.3, easing: "ease-out", amplitude: 18, color: "#8b6cff" }, hover: (c) => ({ filter: `drop-shadow(0 0 ${num(c.amplitude, 18)}px ${c.color})` }) });
add({ id: "hover-color", label: "Color Transition", kind: "hover", controls: [...H, "color"], defaults: { duration: 0.3, easing: "ease-out", color: "#ff4a1c" }, hover: (c) => ({ color: c.color }) });
add({ id: "hover-image-zoom", label: "Image Zoom", kind: "hover", mask: true, controls: [...H, "scale"], defaults: { duration: 0.6, easing: "ease-out", scale: 1.1 }, hover: (c) => ({ scale: num(c.scale, 1.1) }) });

/* ---------- Scroll (trigger is always scroll progress) ---------- */
add({ id: "reveal-scroll", label: "Reveal on Scroll", kind: "scroll", controls: ["distance"], defaults: { distance: 60 }, offset: ["start end", "center center"], scrub: (c) => ({ opacity: [0, 1], y: [num(c.distance, 60), 0] }) });
add({ id: "parallax", label: "Parallax", kind: "scroll", controls: ["distance"], defaults: { distance: 80 }, offset: ["start end", "end start"], scrub: (c) => ({ y: [num(c.distance, 80), -num(c.distance, 80)] }) });
add({ id: "scroll-fade", label: "Fade on Scroll", kind: "scroll", controls: [], defaults: {}, offset: ["start end", "center center"], scrub: () => ({ opacity: [0, 1] }) });
add({ id: "scroll-scale", label: "Scale on Scroll", kind: "scroll", controls: ["scale"], defaults: { scale: 0.8 }, offset: ["start end", "center center"], scrub: (c) => ({ scale: [num(c.scale, 0.8), 1] }) });
add({ id: "scroll-slide", label: "Horizontal Movement", kind: "scroll", controls: ["distance"], defaults: { distance: 200 }, offset: ["start end", "end start"], scrub: (c) => ({ x: [num(c.distance, 200), -num(c.distance, 200)] }) });

/* ---------- Helpers ---------- */
export const PRESET_LIST = Object.values(PRESETS);
export const PRESET_KINDS = [
  { id: "entrance", label: "Entrance" }, { id: "emphasis", label: "Emphasis" }, { id: "exit", label: "Exit" },
  { id: "scroll", label: "Scroll" }, { id: "hover", label: "Hover" },
];
export const TRIGGERS = [
  { value: "page-load", label: "On page load" }, { value: "after-delay", label: "After delay" },
  { value: "viewport", label: "On viewport entry" }, { value: "hover", label: "On hover" },
  { value: "click", label: "On click" }, { value: "scroll", label: "On scroll progress" },
];
export const getPreset = (id) => PRESETS[id];

export function allowedTriggers(preset) {
  if (!preset) return TRIGGERS;
  if (preset.kind === "hover") return TRIGGERS.filter((t) => t.value === "hover");
  if (preset.kind === "scroll") return TRIGGERS.filter((t) => t.value === "scroll");
  if (preset.kind === "entrance") return TRIGGERS;
  return TRIGGERS.filter((t) => t.value !== "scroll");
}

// "element": whole element slides inside a mask. "char": each character has its own mask.
export function getMaskMode(cfg, isText) {
  const p = PRESETS[cfg?.preset];
  if (!p?.mask) return "none";
  const split = cfg.split ?? p.defaults.split ?? "none";
  return isText && split !== "none" ? "char" : "element";
}

const deriveScrub = (initial) => {
  const out = {};
  ["opacity", "x", "y", "scale", "rotate"].forEach((k) => {
    if (typeof initial[k] === "number") out[k] = [initial[k], REST[k]];
  });
  return Object.keys(out).length ? out : null;
};

// Turns a serializable animation config into Framer Motion values.
export function buildPlan(cfg) {
  const preset = PRESETS[cfg?.preset];
  if (!preset) return null;
  const c = { ...preset.defaults, ...cfg };
  const kind = preset.kind;
  const base = baseTransition(kind === "emphasis" && c.easing === "spring" ? { ...c, easing: "ease-in-out" } : c);
  const delay = (c.trigger === "after-delay" ? num(c.triggerDelay, 1) : 0) + num(c.delay, 0);
  const plan = { preset, c, kind, base, delay };

  if (kind === "entrance") {
    plan.initial = preset.from(c);
    plan.animate = pick(REST, Object.keys(plan.initial));
    Object.keys(plan.initial).forEach((k) => {
      if ((k === "x" || k === "y") && typeof plan.initial[k] === "string") plan.animate[k] = "0%";
    });
    plan.transition = { ...base, delay };
    plan.scrub = deriveScrub(plan.initial);
  } else if (kind === "exit") {
    plan.animate = preset.to(c);
    plan.initial = pick(REST, Object.keys(plan.animate));
    plan.transition = { ...base, delay };
  } else if (kind === "emphasis") {
    plan.animate = preset.loop(c);
    plan.initial = {};
    plan.transition = { ...base, delay, repeat: c.repeat === "infinite" ? Infinity : num(c.repeat, 0), repeatType: c.reverse ? "reverse" : "loop" };
  } else if (kind === "hover") {
    plan.hover = preset.hover(c);
    plan.transition = { ...base };
  } else if (kind === "scroll") {
    plan.scrub = preset.scrub(c);
    plan.offset = preset.offset;
  }
  return plan;
}

// Used by the timeline. `auto` = starts by itself (page load / after delay).
export function timingOf(cfg) {
  const preset = PRESETS[cfg?.preset];
  if (!preset) return null;
  const c = { ...preset.defaults, ...cfg };
  const trig = c.trigger || "page-load";
  // Viewport-triggered entrances are timed relative to the section entering view, so they sit on the timeline too.
  const auto = (trig === "page-load" || trig === "after-delay" || trig === "viewport") && preset.kind !== "hover" && preset.kind !== "scroll";
  return {
    preset, auto,
    start: (trig === "after-delay" ? num(c.triggerDelay, 1) : 0) + num(c.delay, 0),
    duration: num(c.duration, 0.8),
  };
}