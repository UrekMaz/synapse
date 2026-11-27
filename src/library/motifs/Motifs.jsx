import { seeded } from "../heroes/shared/spatial.js";
import { css } from "../../utils/tokens.js";
import { MOTIF_BY_ID, CUSTOM_MOTIF } from "./catalog.js";

/*
 * Motif renderers. Everything is original vector artwork drawn with SVG + CSS animations
 * (SMIL morphs for organic motion such as the flowing scarf and the slithering serpent).
 * Layers never receive pointer events, so motifs can't block links, buttons or text.
 */
const hash = (s) => [...String(s)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) >>> 0, 7);
const f2 = (v) => +v.toFixed(1);

/* ---------- Procedural organic shapes ---------- */
// Closed ribbon around a sine centreline; `width(t)` gives the thickness along the length (t 0 → 1).
function ribbon({ w, h, amp, waves, phase, width, steps = 28, x0 = 0 }) {
  const top = [], bot = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps, x = x0 + t * (w - x0);
    const y = h / 2 + amp * Math.sin(t * Math.PI * 2 * waves + phase) * Math.sin(Math.PI * Math.min(1, t * 1.15 + 0.08));
    const dy = amp * Math.cos(t * Math.PI * 2 * waves + phase) * (Math.PI * 2 * waves) / w;
    const nx = -dy / Math.hypot(1, dy), ny = 1 / Math.hypot(1, dy);
    const half = width(t) / 2;
    top.push([x + nx * half, y - ny * half]);
    bot.push([x - nx * half, y + ny * half]);
  }
  const pts = [...top, ...bot.reverse()];
  return `M${pts.map(([x, y]) => `${f2(x)},${f2(y)}`).join(" L")} Z`;
}
const centre = ({ w, h, amp, waves, phase, t }) => [t * w, h / 2 + amp * Math.sin(t * Math.PI * 2 * waves + phase) * Math.sin(Math.PI * Math.min(1, t * 1.15 + 0.08))];

function Grad({ id, c, a, angle = 0, stops }) {
  return (
    <linearGradient id={id} gradientTransform={`rotate(${angle} .5 .5)`}>
      {(stops || [[0, c], [1, a]]).map(([o, col], i) => <stop key={i} offset={o} style={{ stopColor: col }} />)}
    </linearGradient>
  );
}

/* ---------- Objects ---------- */
function Scarf({ c, a, uid, motion, s }) {
  const W = 600, H = 220;
  const frame = (phase) => ribbon({ w: W, h: H, amp: 52, waves: 1.25, phase, width: (t) => 34 + 18 * Math.sin(t * Math.PI) - 10 * t });
  const frames = [0, 1.4, 2.8, 1.4, 0].map(frame);
  const dur = `${9 / s}s`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: "visible" }} aria-hidden>
      <defs>
        <Grad id={`${uid}g`} c={c} a={a} stops={[[0, a], [0.35, c], [0.55, `color-mix(in srgb, ${c} 70%, #fff)`], [0.7, c], [1, a]]} />
        <pattern id={`${uid}k`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><path d="M0 5h10" style={{ stroke: "rgba(0,0,0,.12)", strokeWidth: 3 }} /></pattern>
      </defs>
      <path d={frames[0]} style={{ fill: `url(#${uid}g)`, filter: "drop-shadow(0 18px 18px rgba(60,10,10,.28))" }}>
        {motion && <animate attributeName="d" dur={dur} repeatCount="indefinite" values={frames.join(";")} calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1" />}
      </path>
      <path d={frames[0]} style={{ fill: `url(#${uid}k)` }}>
        {motion && <animate attributeName="d" dur={dur} repeatCount="indefinite" values={frames.join(";")} calcMode="spline" keySplines=".4 0 .6 1;.4 0 .6 1;.4 0 .6 1;.4 0 .6 1" />}
      </path>
      {/* fringe */}
      {Array.from({ length: 7 }, (_, i) => {
        const [x, y] = centre({ w: W, h: H, amp: 52, waves: 1.25, phase: 0, t: 1 });
        return <line key={i} x1={x - 4} y1={y - 15 + i * 5} x2={x + 22 + (i % 2) * 6} y2={y - 18 + i * 6} style={{ stroke: a, strokeWidth: 2.2, strokeLinecap: "round" }} />;
      })}
    </svg>
  );
}

function Snake({ c, a, uid, motion, s, texture = true }) {
  const W = 640, H = 240;
  const width = (t) => (t < 0.05 ? 18 + 260 * t : 32 * (1 - t) + 2);
  const frame = (phase) => ribbon({ w: W, h: H, amp: 58, waves: 1.6, phase, width, steps: 40, x0: 24 });
  const frames = [0, 1.1, 2.2, 1.1, 0].map(frame);
  const eye = (phase) => centre({ w: W, h: H, amp: 58, waves: 1.6, phase, t: 0.05 });
  const eyes = [0, 1.1, 2.2, 1.1, 0].map(eye);
  const dur = `${14 / s}s`;
  const anim = (vals) => motion && <animate attributeName="d" dur={dur} repeatCount="indefinite" values={vals} calcMode="spline" keySplines=".45 0 .55 1;.45 0 .55 1;.45 0 .55 1;.45 0 .55 1" />;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" style={{ overflow: "visible" }} aria-hidden>
      <defs>
        <linearGradient id={`${uid}m`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" style={{ stopColor: `color-mix(in srgb, ${c} 60%, #fff)` }} /><stop offset=".35" style={{ stopColor: c }} />
          <stop offset=".55" style={{ stopColor: a }} /><stop offset=".8" style={{ stopColor: c }} /><stop offset="1" style={{ stopColor: `color-mix(in srgb, ${a} 70%, #000)` }} />
        </linearGradient>
        <pattern id={`${uid}s`} width="12" height="9" patternUnits="userSpaceOnUse">
          <path d="M0 9 Q6 0 12 9" style={{ fill: "none", stroke: "rgba(0,0,0,.35)", strokeWidth: 1.1 }} />
          <path d="M-6 4.5 Q0 -4.5 6 4.5 M6 4.5 Q12 -4.5 18 4.5" style={{ fill: "none", stroke: "rgba(255,255,255,.18)", strokeWidth: 0.8 }} />
        </pattern>
      </defs>
      <path d={frames[0]} style={{ fill: `url(#${uid}m)`, filter: "drop-shadow(0 14px 22px rgba(0,0,0,.5))" }}>{anim(frames.join(";"))}</path>
      {texture && <path d={frames[0]} style={{ fill: `url(#${uid}s)` }}>{anim(frames.join(";"))}</path>}
      <circle r="3.4" cx={eyes[0][0] + 2} cy={eyes[0][1] - 5} style={{ fill: "#c1121f", filter: "drop-shadow(0 0 4px #ff2d3a)" }}>
        {motion && <><animate attributeName="cx" dur={dur} repeatCount="indefinite" values={eyes.map((e) => e[0] + 2).join(";")} /><animate attributeName="cy" dur={dur} repeatCount="indefinite" values={eyes.map((e) => e[1] - 5).join(";")} /></>}
      </circle>
    </svg>
  );
}

function Car({ c, a, uid }) {
  return (
    <svg viewBox="0 0 400 150" width="100%" height="100%" aria-hidden style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id={`${uid}b`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: `color-mix(in srgb, ${c} 75%, #fff)` }} /><stop offset=".45" style={{ stopColor: c }} /><stop offset="1" style={{ stopColor: `color-mix(in srgb, ${c} 60%, #000)` }} /></linearGradient>
        <linearGradient id={`${uid}w`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: "#e8eef5" }} /><stop offset="1" style={{ stopColor: "#5a6472" }} /></linearGradient>
      </defs>
      <ellipse cx="205" cy="128" rx="190" ry="9" style={{ fill: "rgba(0,0,0,.28)", filter: "blur(4px)" }} />
      <path d="M20,100 C20,86 30,80 54,77 L122,71 C152,51 186,40 230,40 C266,40 292,52 314,66 L352,72 C374,75 386,85 388,97 L389,105 C389,111 383,113 377,113 L344,113 A28,28 0 0 0 290,113 L132,113 A28,28 0 0 0 78,113 L32,113 C24,113 20,109 20,100 Z" style={{ fill: `url(#${uid}b)` }} />
      <path d="M140,71 C162,56 190,48 226,48 C253,48 274,56 292,68 L140,71 Z" style={{ fill: `url(#${uid}w)`, opacity: 0.92 }} />
      <path d="M218,48 L214,70" style={{ stroke: `color-mix(in srgb, ${c} 60%, #000)`, strokeWidth: 5 }} />
      <path d="M40,90 C120,84 250,84 380,92" style={{ fill: "none", stroke: "rgba(255,255,255,.35)", strokeWidth: 1.5 }} />
      <ellipse cx="28" cy="92" rx="7" ry="4" style={{ fill: a, filter: `drop-shadow(0 0 6px ${a})` }} />
      <rect x="380" y="88" width="7" height="6" rx="2" style={{ fill: "#ff3b3b" }} />
      {[105, 317].map((x) => (
        <g key={x}>
          <circle cx={x} cy="113" r="24" style={{ fill: "#141414" }} />
          <circle cx={x} cy="113" r="14" style={{ fill: "none", stroke: a, strokeWidth: 3 }} />
          {[0, 60, 120].map((r) => <line key={r} x1={x - 13} y1="113" x2={x + 13} y2="113" transform={`rotate(${r} ${x} 113)`} style={{ stroke: a, strokeWidth: 1.6 }} />)}
          <circle cx={x} cy="113" r="3.5" style={{ fill: a }} />
        </g>
      ))}
    </svg>
  );
}

function Polaroid({ c, a, uid, text, image }) {
  return (
    <svg viewBox="0 0 170 205" width="100%" height="100%" aria-hidden style={{ overflow: "visible", filter: "drop-shadow(0 14px 22px rgba(0,0,0,.28))" }}>
      <defs><linearGradient id={`${uid}p`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: "#f7c59f" }} /><stop offset=".5" style={{ stopColor: a }} /><stop offset="1" style={{ stopColor: "#5e3a2e" }} /></linearGradient></defs>
      <rect width="170" height="205" rx="3" style={{ fill: c }} />
      {image ? <image href={image} x="12" y="12" width="146" height="146" preserveAspectRatio="xMidYMid slice" /> : (
        <g><rect x="12" y="12" width="146" height="146" style={{ fill: `url(#${uid}p)` }} /><circle cx="110" cy="70" r="20" style={{ fill: "rgba(255,240,210,.75)" }} /><path d="M12,140 L60,100 L95,128 L125,104 L158,134 L158,158 L12,158 Z" style={{ fill: "rgba(40,20,15,.55)" }} /></g>
      )}
      <text x="85" y="186" textAnchor="middle" style={{ font: "22px 'Caveat', cursive", fill: "#3a2a24" }}>{text}</text>
    </svg>
  );
}

function Filmstrip({ c, a, uid }) {
  return (
    <svg viewBox="0 0 360 120" width="100%" height="100%" aria-hidden>
      <defs><linearGradient id={`${uid}f`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: a }} /><stop offset="1" style={{ stopColor: "#5e3a2e" }} /></linearGradient></defs>
      <rect width="360" height="120" rx="4" style={{ fill: c }} />
      {Array.from({ length: 18 }, (_, i) => <g key={i}><rect x={8 + i * 20} y="6" width="10" height="8" rx="2" style={{ fill: "#f4ead9", opacity: 0.85 }} /><rect x={8 + i * 20} y="106" width="10" height="8" rx="2" style={{ fill: "#f4ead9", opacity: 0.85 }} /></g>)}
      {[0, 1, 2].map((i) => <rect key={i} x={12 + i * 116} y="22" width="104" height="76" rx="2" style={{ fill: `url(#${uid}f)`, opacity: 0.6 + i * 0.15 }} />)}
    </svg>
  );
}

function Postcard({ c, a, text }) {
  return (
    <svg viewBox="0 0 240 160" width="100%" height="100%" aria-hidden style={{ filter: "drop-shadow(0 12px 18px rgba(0,0,0,.2))" }}>
      <rect width="240" height="160" rx="4" style={{ fill: c }} />
      <rect x="186" y="14" width="40" height="48" style={{ fill: "none", stroke: a, strokeWidth: 2, strokeDasharray: "3 3" }} />
      <circle cx="176" cy="58" r="18" style={{ fill: "none", stroke: a, strokeWidth: 1.4, opacity: 0.6 }} />
      <line x1="122" y1="20" x2="122" y2="146" style={{ stroke: "rgba(0,0,0,.15)" }} />
      {[92, 112, 132].map((y) => <line key={y} x1="134" y1={y} x2="226" y2={y} style={{ stroke: "rgba(0,0,0,.2)" }} />)}
      <text x="16" y="70" style={{ font: "21px 'Caveat', cursive", fill: a }}>{text}</text>
      <text x="16" y="96" style={{ font: "16px 'Caveat', cursive", fill: "#5c4a42" }}>x, me</text>
    </svg>
  );
}

function Note({ c, a, text }) {
  return (
    <svg viewBox="0 0 220 180" width="100%" height="100%" aria-hidden style={{ overflow: "visible", filter: "drop-shadow(0 10px 16px rgba(0,0,0,.18))" }}>
      <path d="M6,10 L214,4 L210,174 L10,178 Z" style={{ fill: c }} />
      {[48, 76, 104, 132, 160].map((y) => <line key={y} x1="18" y1={y} x2="204" y2={y - 2} style={{ stroke: "rgba(70,90,140,.25)" }} />)}
      <rect x="80" y="-6" width="64" height="20" transform="rotate(-4 112 4)" style={{ fill: "rgba(240,200,170,.75)" }} />
      <text x="22" y="70" style={{ font: "26px 'Caveat', cursive", fill: a }}>{text}</text>
    </svg>
  );
}

function Lipstick({ c, a }) {
  return (
    <svg viewBox="0 0 100 60" width="100%" height="100%" aria-hidden>
      <path d="M8,28 C20,10 36,6 50,18 C64,6 80,10 92,28 C78,30 62,30 50,26 C38,30 22,30 8,28 Z" style={{ fill: c, opacity: 0.9 }} />
      <path d="M10,31 C24,33 38,34 50,30 C62,34 76,33 90,31 C80,50 64,56 50,56 C36,56 20,50 10,31 Z" style={{ fill: a, opacity: 0.9 }} />
      {[20, 32, 44, 56, 68, 80].map((x) => <path key={x} d={`M${x},34 q2,8 0,16`} style={{ fill: "none", stroke: "rgba(0,0,0,.18)", strokeWidth: 1 }} />)}
    </svg>
  );
}

function Rose({ c, a }) {
  const edge = { stroke: `color-mix(in srgb, ${a} 55%, #fff)`, strokeOpacity: 0.35, strokeWidth: 1.4 };
  return (
    <svg viewBox="0 0 120 170" width="100%" height="100%" aria-hidden style={{ overflow: "visible" }}>
      <path d="M60,84 C58,112 64,140 58,168" style={{ fill: "none", stroke: "#1f2a22", strokeWidth: 4, strokeLinecap: "round" }} />
      <path d="M60,124 C42,112 30,118 26,128 C40,134 52,132 60,124 Z M61,140 C80,130 92,136 96,146 C82,150 70,148 61,140 Z" style={{ fill: "#24342a" }} />
      {/* outer petals: three overlapping cups instead of one disc */}
      <path d="M60,92 C36,92 18,76 20,54 C30,62 44,64 52,60 C44,72 50,86 60,92 Z" style={{ fill: c, ...edge }} />
      <path d="M60,92 C84,92 102,76 100,54 C90,62 76,64 68,60 C76,72 70,86 60,92 Z" style={{ fill: c, ...edge }} />
      <path d="M24,52 C22,32 40,18 60,18 C80,18 98,32 96,52 C86,44 72,42 60,46 C48,42 34,44 24,52 Z" style={{ fill: `color-mix(in srgb, ${c} 85%, ${a})`, ...edge }} />
      {/* inner bloom */}
      <path d="M60,30 C78,32 86,46 82,60 C78,72 68,78 60,78 C50,78 40,72 38,60 C36,46 44,34 60,30 Z" style={{ fill: `color-mix(in srgb, ${c} 60%, ${a})`, ...edge }} />
      <path d="M60,42 C70,44 74,52 71,60 C68,67 61,68 57,66 C50,63 49,54 52,48 C54,45 57,43 60,42 Z" style={{ fill: a, ...edge }} />
      <path d="M60,50 C65,52 65,58 62,60 C58,62 55,58 57,55" style={{ fill: "none", stroke: "rgba(255,255,255,.3)", strokeWidth: 1.4 }} />
    </svg>
  );
}

function Newspaper({ c, a, text }) {
  return (
    <svg viewBox="0 0 340 220" width="100%" height="100%" aria-hidden style={{ filter: "drop-shadow(0 16px 24px rgba(0,0,0,.35))" }}>
      <rect width="340" height="220" style={{ fill: c }} />
      <text x="170" y="30" textAnchor="middle" style={{ font: "700 20px 'Playfair Display', Georgia, serif", fill: a, letterSpacing: "0.12em" }}>THE EVENING EDITION</text>
      <line x1="16" y1="40" x2="324" y2="40" style={{ stroke: a, strokeWidth: 2 }} /><line x1="16" y1="44" x2="324" y2="44" style={{ stroke: a, strokeWidth: 0.6 }} />
      <text x="170" y="86" textAnchor="middle" textLength="300" lengthAdjust="spacingAndGlyphs" style={{ font: "700 40px 'Oswald', 'Arial Narrow', sans-serif", fill: a }}>{text}</text>
      {Array.from({ length: 3 }, (_, col) => Array.from({ length: 9 }, (_, i) => <line key={`${col}-${i}`} x1={18 + col * 104} y1={106 + i * 12} x2={18 + col * 104 + 94 - (i === 8 ? 40 : 0)} y2={106 + i * 12} style={{ stroke: "rgba(0,0,0,.28)", strokeWidth: 4 }} />))}
    </svg>
  );
}

function Chain({ c, a, uid }) {
  return (
    <svg width="100%" height="100%" aria-hidden preserveAspectRatio="none">
      <defs>
        <linearGradient id={`${uid}c`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" style={{ stopColor: "#f1f2f4" }} /><stop offset=".5" style={{ stopColor: c }} /><stop offset="1" style={{ stopColor: a }} /></linearGradient>
        <pattern id={`${uid}p`} width="56" height="40" patternUnits="userSpaceOnUse">
          <rect x="4" y="10" width="34" height="20" rx="10" style={{ fill: "none", stroke: `url(#${uid}c)`, strokeWidth: 5 }} />
          <rect x="32" y="16" width="26" height="8" rx="4" style={{ fill: "none", stroke: `url(#${uid}c)`, strokeWidth: 5 }} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" style={{ fill: `url(#${uid}p)` }} />
    </svg>
  );
}

function Camera({ c, a }) {
  return (
    <svg viewBox="0 0 160 120" width="100%" height="100%" aria-hidden>
      <rect x="10" y="30" width="140" height="80" rx="14" style={{ fill: c }} /><rect x="24" y="18" width="36" height="16" rx="5" style={{ fill: c }} />
      <rect x="10" y="52" width="140" height="10" style={{ fill: "rgba(255,255,255,.12)" }} />
      <circle cx="84" cy="72" r="28" style={{ fill: a }} /><circle cx="84" cy="72" r="19" style={{ fill: "#0d1b2a" }} /><circle cx="78" cy="66" r="6" style={{ fill: "rgba(255,255,255,.55)" }} />
      <rect x="120" y="40" width="18" height="10" rx="3" style={{ fill: "#fff7d6" }} />
    </svg>
  );
}

function Clock({ c, a, motion, s }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <circle cx="60" cy="60" r="54" style={{ fill: `color-mix(in srgb, ${a} 85%, #000)`, stroke: c, strokeWidth: 4 }} />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1="60" y1="12" x2="60" y2={i % 3 ? 18 : 22} transform={`rotate(${i * 30} 60 60)`} style={{ stroke: c, strokeWidth: i % 3 ? 1.5 : 3 }} />)}
      <line x1="60" y1="60" x2="60" y2="32" style={{ stroke: c, strokeWidth: 4, strokeLinecap: "round" }}>{motion && <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur={`${600 / s}s`} repeatCount="indefinite" />}</line>
      <line x1="60" y1="60" x2="60" y2="20" style={{ stroke: c, strokeWidth: 2, strokeLinecap: "round" }}>{motion && <animateTransform attributeName="transform" type="rotate" from="0 60 60" to="360 60 60" dur={`${40 / s}s`} repeatCount="indefinite" />}</line>
      <circle cx="60" cy="60" r="4" style={{ fill: c }} />
    </svg>
  );
}

function Letters({ c, a }) {
  return (
    <svg viewBox="0 0 160 110" width="100%" height="100%" aria-hidden style={{ filter: "drop-shadow(0 10px 14px rgba(0,0,0,.18))" }}>
      <rect x="10" y="14" width="140" height="88" rx="4" transform="rotate(-6 80 58)" style={{ fill: `color-mix(in srgb, ${c} 85%, #000)` }} />
      <rect x="10" y="14" width="140" height="88" rx="4" style={{ fill: c }} />
      <path d="M10,18 L80,64 L150,18" style={{ fill: "none", stroke: "rgba(0,0,0,.18)", strokeWidth: 2 }} />
      <path d="M80,56 C72,46 60,52 66,62 L80,74 L94,62 C100,52 88,46 80,56 Z" style={{ fill: a }} />
    </svg>
  );
}

function Book({ c, a }) {
  return (
    <svg viewBox="0 0 200 120" width="100%" height="100%" aria-hidden style={{ filter: "drop-shadow(0 12px 16px rgba(0,0,0,.2))" }}>
      <path d="M100,24 C80,10 40,10 10,18 L10,108 C40,100 80,100 100,112 Z" style={{ fill: c }} />
      <path d="M100,24 C120,10 160,10 190,18 L190,108 C160,100 120,100 100,112 Z" style={{ fill: `color-mix(in srgb, ${c} 92%, #000)` }} />
      {[34, 48, 62, 76, 90].map((y) => <g key={y}><line x1="22" y1={y} x2="88" y2={y + 4} style={{ stroke: a, strokeWidth: 1.2, opacity: 0.4 }} /><line x1="112" y1={y + 4} x2="178" y2={y} style={{ stroke: a, strokeWidth: 1.2, opacity: 0.4 }} /></g>)}
      <line x1="100" y1="24" x2="100" y2="112" style={{ stroke: "rgba(0,0,0,.2)" }} />
    </svg>
  );
}

function Tape({ c, a, uid }) {
  return (
    <svg viewBox="0 0 160 40" width="100%" height="100%" aria-hidden>
      <defs><pattern id={`${uid}t`} width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="6" height="12" style={{ fill: a, opacity: 0.5 }} /></pattern></defs>
      <path d="M4,6 L8,2 L12,6 L156,4 L152,8 L156,12 L154,36 L150,32 L146,36 L6,38 L10,32 L4,28 Z" style={{ fill: c, opacity: 0.85 }} />
      <path d="M4,6 L8,2 L12,6 L156,4 L152,8 L156,12 L154,36 L150,32 L146,36 L6,38 L10,32 L4,28 Z" style={{ fill: `url(#${uid}t)` }} />
    </svg>
  );
}

function Moon({ c, a, uid }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden style={{ overflow: "visible" }}>
      <defs>
        <radialGradient id={`${uid}g`}><stop offset=".4" style={{ stopColor: a, stopOpacity: 0.55 }} /><stop offset="1" style={{ stopColor: a, stopOpacity: 0 }} /></radialGradient>
        <mask id={`${uid}m`}><rect width="120" height="120" fill="#fff" /><circle cx="78" cy="48" r="34" fill="#000" /></mask>
      </defs>
      <circle cx="60" cy="60" r="60" style={{ fill: `url(#${uid}g)` }} />
      <circle cx="60" cy="60" r="38" mask={`url(#${uid}m)`} style={{ fill: c }} />
    </svg>
  );
}

function Constellation({ c, a, motion }) {
  const pts = [[20, 70], [70, 40], [120, 58], [170, 20], [220, 46], [270, 30], [300, 80], [240, 100]];
  return (
    <svg viewBox="0 0 320 120" width="100%" height="100%" aria-hidden style={{ overflow: "visible" }}>
      <path d={`M${pts.map((p) => p.join(",")).join(" L")}`} pathLength="1" className={motion ? "syn-m-draw" : undefined} style={{ fill: "none", stroke: a, strokeWidth: 1, opacity: 0.7, strokeDasharray: 1 }} />
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={i % 3 ? 2.5 : 4} style={{ fill: c, filter: `drop-shadow(0 0 4px ${c})` }} />)}
    </svg>
  );
}

function Vinyl({ c, a }) {
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden>
      <circle cx="60" cy="60" r="58" style={{ fill: c }} />
      {[50, 44, 38, 32, 26].map((r) => <circle key={r} cx="60" cy="60" r={r} style={{ fill: "none", stroke: "rgba(255,255,255,.08)" }} />)}
      <path d="M22,40 A44,44 0 0 1 60,16" style={{ fill: "none", stroke: "rgba(255,255,255,.22)", strokeWidth: 3 }} />
      <circle cx="60" cy="60" r="17" style={{ fill: a }} /><circle cx="60" cy="60" r="3" style={{ fill: "#000" }} />
    </svg>
  );
}

function Cassette({ c, a, motion, s }) {
  const reel = (x) => (
    <g>
      <circle cx={x} cy="56" r="13" style={{ fill: "#fff", opacity: 0.9 }} />
      <g>{[0, 60, 120].map((r) => <rect key={r} x={x - 1.5} y="45" width="3" height="22" transform={`rotate(${r} ${x} 56)`} style={{ fill: c }} />)}{motion && <animateTransform attributeName="transform" type="rotate" from={`0 ${x} 56`} to={`360 ${x} 56`} dur={`${4 / s}s`} repeatCount="indefinite" />}</g>
    </g>
  );
  return (
    <svg viewBox="0 0 200 128" width="100%" height="100%" aria-hidden>
      <rect x="4" y="4" width="192" height="120" rx="10" style={{ fill: c }} />
      <rect x="18" y="16" width="164" height="70" rx="6" style={{ fill: a }} />
      <rect x="46" y="40" width="108" height="32" rx="16" style={{ fill: "rgba(0,0,0,.6)" }} />
      {reel(66)}{reel(134)}
      <path d="M44,124 L56,96 L144,96 L156,124" style={{ fill: "rgba(255,255,255,.08)" }} />
    </svg>
  );
}

function Headphones({ c, a }) {
  return (
    <svg viewBox="0 0 140 120" width="100%" height="100%" aria-hidden>
      <path d="M20,78 C20,36 44,12 70,12 C96,12 120,36 120,78" style={{ fill: "none", stroke: c, strokeWidth: 9, strokeLinecap: "round" }} />
      <rect x="8" y="66" width="30" height="46" rx="12" style={{ fill: a }} /><rect x="102" y="66" width="30" height="46" rx="12" style={{ fill: a }} />
    </svg>
  );
}

function Speaker({ c, a }) {
  return (
    <svg viewBox="0 0 120 170" width="100%" height="100%" aria-hidden>
      <rect x="4" y="4" width="112" height="162" rx="10" style={{ fill: c }} />
      <circle cx="60" cy="48" r="22" style={{ fill: "#111", stroke: a, strokeWidth: 3 }} />
      <circle cx="60" cy="112" r="38" style={{ fill: "#111", stroke: a, strokeWidth: 3 }} /><circle cx="60" cy="112" r="12" style={{ fill: a, opacity: 0.6 }} />
    </svg>
  );
}

function Liquid({ c, a, uid, motion, s }) {
  const blobs = [
    "M60,8 C88,8 112,26 112,56 C112,86 92,112 62,112 C32,112 8,92 8,60 C8,30 32,8 60,8 Z",
    "M64,6 C96,12 114,34 108,62 C102,92 84,114 56,110 C26,106 6,86 12,56 C18,26 34,2 64,6 Z",
    "M56,10 C86,4 116,28 110,60 C104,90 86,110 58,114 C30,116 4,92 10,62 C16,32 26,16 56,10 Z",
  ];
  return (
    <svg viewBox="0 0 120 120" width="100%" height="100%" aria-hidden style={{ overflow: "visible" }}>
      <defs><linearGradient id={`${uid}l`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" style={{ stopColor: c }} /><stop offset="1" style={{ stopColor: a }} /></linearGradient></defs>
      <path d={blobs[0]} style={{ fill: `url(#${uid}l)`, opacity: 0.85 }}>{motion && <animate attributeName="d" dur={`${10 / s}s`} repeatCount="indefinite" values={[...blobs, blobs[0]].join(";")} />}</path>
    </svg>
  );
}

const OBJECTS = { scarf: Scarf, snake: Snake, car: Car, polaroid: Polaroid, filmstrip: Filmstrip, postcard: Postcard, note: Note, lipstick: Lipstick, rose: Rose, newspaper: Newspaper, camera: Camera, clock: Clock, letters: Letters, book: Book, tape: Tape, moon: Moon, constellation: Constellation, vinyl: Vinyl, cassette: Cassette, headphones: Headphones, speaker: Speaker, liquid: Liquid };
const ASPECT = { scarf: 600 / 220, snake: 640 / 240, car: 400 / 150, polaroid: 170 / 205, filmstrip: 3, postcard: 1.5, note: 220 / 180, lipstick: 100 / 60, rose: 120 / 170, newspaper: 340 / 220, camera: 160 / 120, letters: 160 / 110, book: 200 / 120, tape: 4, constellation: 320 / 120, cassette: 200 / 128, headphones: 140 / 120, speaker: 120 / 170 };

/* ---------- Particle glyphs ---------- */
const GLYPHS = {
  leaves: (c, a, i) => <path d="M50,4 L58,30 L84,20 L72,44 L96,52 L70,60 L78,86 L54,72 L50,98 L46,72 L22,86 L30,60 L4,52 L28,44 L16,20 L42,30 Z" style={{ fill: i % 3 ? c : a }} />,
  petals: (c, a, i) => <path d="M50,6 C78,18 88,58 50,94 C12,58 22,18 50,6 Z" style={{ fill: i % 2 ? c : a, opacity: 0.9 }} />,
  hearts: (c, a, i) => <path d="M50,88 L14,52 C-2,36 10,10 32,12 C42,13 48,20 50,26 C52,20 58,13 68,12 C90,10 102,36 86,52 Z" style={{ fill: i % 3 ? c : a }} />,
  stars: (c, a, i) => <path d="M50,0 C53,40 60,47 100,50 C60,53 53,60 50,100 C47,60 40,53 0,50 C40,47 47,40 50,0 Z" style={{ fill: i % 4 ? c : a }} />,
  fireflies: (c) => <circle cx="50" cy="50" r="22" style={{ fill: c, filter: `drop-shadow(0 0 14px ${c}) drop-shadow(0 0 4px ${c})` }} />,
  particles: (c, a, i) => <circle cx="50" cy="50" r="30" style={{ fill: i % 2 ? c : a, filter: `blur(6px)`, opacity: 0.8 }} />,
  bokeh: (c, a, i) => <circle cx="50" cy="50" r="46" style={{ fill: i % 2 ? c : a, opacity: 0.32, filter: "blur(3px)" }} />,
  lamps: (c) => <circle cx="50" cy="50" r="40" style={{ fill: `radial-gradient(circle, ${c}, transparent)`, opacity: 0 }} />,
  rain: (c) => <line x1="50" y1="0" x2="46" y2="100" style={{ stroke: c, strokeWidth: 3, strokeLinecap: "round", opacity: 0.55 }} />,
  clouds: (c) => <path d="M22,70 C6,70 4,50 18,46 C16,30 34,22 46,32 C52,16 76,16 82,34 C98,32 104,52 92,60 C100,70 92,78 82,76 L26,76 C24,76 22,72 22,70 Z" style={{ fill: c, opacity: 0.85, filter: "blur(1.5px)" }} />,
  seagulls: (c) => <path d="M6,56 C22,40 38,40 50,58 C62,40 78,40 94,56" style={{ fill: "none", stroke: c, strokeWidth: 6, strokeLinecap: "round" }} />,
  butterflies: (c, a, i, motion) => (
    <g>
      <g style={{ transformOrigin: "50px 50px" }}>
        <path d="M50,50 C36,20 6,18 10,42 C12,56 34,58 50,52 C36,62 16,76 30,88 C40,96 50,74 50,56 Z" style={{ fill: i % 2 ? c : a }} />
        {motion && <animateTransform attributeName="transform" type="scale" values="1 1;0.25 1;1 1" additive="sum" dur={`${0.55 + (i % 3) * 0.1}s`} repeatCount="indefinite" />}
      </g>
      <g style={{ transformOrigin: "50px 50px" }}>
        <path d="M50,50 C64,20 94,18 90,42 C88,56 66,58 50,52 C64,62 84,76 70,88 C60,96 50,74 50,56 Z" style={{ fill: i % 2 ? a : c }} />
        {motion && <animateTransform attributeName="transform" type="scale" values="1 1;0.25 1;1 1" additive="sum" dur={`${0.55 + (i % 3) * 0.1}s`} repeatCount="indefinite" />}
      </g>
      <rect x="48" y="36" width="4" height="34" rx="2" style={{ fill: "#2b2140" }} />
    </g>
  ),
  stickers: (c, a, i) => [
    <path key="s" d="M50,6 L62,38 L96,38 L68,58 L78,92 L50,72 L22,92 L32,58 L4,38 L38,38 Z" style={{ fill: c, stroke: "#fff", strokeWidth: 7, paintOrder: "stroke" }} />,
    <path key="h" d="M50,88 L14,52 C-2,36 10,10 32,12 C42,13 48,20 50,26 C52,20 58,13 68,12 C90,10 102,36 86,52 Z" style={{ fill: a, stroke: "#fff", strokeWidth: 7, paintOrder: "stroke" }} />,
    <g key="f"><circle cx="50" cy="50" r="40" style={{ fill: c, stroke: "#fff", strokeWidth: 7 }} /><circle cx="36" cy="42" r="5" style={{ fill: "#2b2140" }} /><circle cx="64" cy="42" r="5" style={{ fill: "#2b2140" }} /><path d="M32,60 Q50,78 68,60" style={{ fill: "none", stroke: "#2b2140", strokeWidth: 5, strokeLinecap: "round" }} /></g>,
    <path key="b" d="M56,4 L20,56 L46,56 L38,96 L80,40 L54,40 Z" style={{ fill: a, stroke: "#fff", strokeWidth: 7, paintOrder: "stroke" }} />,
  ][i % 4],
  doodles: (c, a, i, motion) => {
    const d = ["M50,8 L60,40 L94,40 L66,60 L76,92 L50,72 L24,92 L34,60 L6,40 L40,40 Z", "M50,50 m-6,0 a6,6 0 1,1 12,0 a12,12 0 1,1 -24,0 a20,20 0 1,1 40,0 a30,30 0 1,1 -60,0", "M50,86 L16,52 C2,38 14,14 34,16 C44,17 48,24 50,28 C52,24 56,17 66,16 C86,14 98,38 84,52 Z", "M10,80 C30,20 60,20 70,50 C78,72 92,60 94,40"][i % 4];
    return <path d={d} pathLength="1" className={motion ? "syn-m-draw" : undefined} style={{ fill: "none", stroke: c, strokeWidth: 4, strokeLinecap: "round", strokeLinejoin: "round", strokeDasharray: 1, animationDelay: `${0.4 + i * 0.25}s` }} />;
  },
  shapes: (c, a, i) => [
    <path key="t" d="M50,8 L94,88 L6,88 Z" style={{ fill: "none", stroke: c, strokeWidth: 7 }} />,
    <circle key="c" cx="50" cy="50" r="40" style={{ fill: a }} />,
    <rect key="r" x="14" y="14" width="72" height="72" transform="rotate(18 50 50)" style={{ fill: "none", stroke: a, strokeWidth: 7 }} />,
    <path key="x" d="M14,14 L86,86 M86,14 L14,86" style={{ stroke: c, strokeWidth: 10, strokeLinecap: "round" }} />,
  ][i % 4],
  bolts: (c, a, i) => <path d="M58,2 L18,56 L46,56 L34,98 L84,38 L56,38 Z" style={{ fill: i % 2 ? c : a, filter: `drop-shadow(0 0 10px ${c})` }} />,
  notes: (c, a, i) => <path d="M70,8 L70,66 C70,80 54,88 44,82 C34,76 38,62 50,58 C56,56 62,58 64,60 L64,22 L36,28 L36,74 C36,88 20,96 10,90 C0,84 4,70 16,66 C22,64 28,66 30,68 L30,16 Z" style={{ fill: i % 2 ? c : a }} />,
  "shooting-star": (c) => <g><line x1="0" y1="0" x2="100" y2="28" style={{ stroke: c, strokeWidth: 2.5, strokeLinecap: "round", opacity: 0.9 }} /><circle cx="100" cy="28" r="4" style={{ fill: c, filter: `drop-shadow(0 0 6px ${c})` }} /></g>,
};
// Particle animation per motif (class + keyframe-friendly variables).
const PARTICLE_TRACK = { fall: "y", rain: "y", rise: "y-up", drift: "x", glide: "x", shoot: "shoot" };

function Particles({ m, c, a, motion, anim }) {
  const r = seeded(hash(m.id));
  const glyph = GLYPHS[m.asset];
  const lamps = m.asset === "lamps";
  return Array.from({ length: Math.max(1, Math.round(m.count)) }, (_, i) => {
    const size = m.size * (0.55 + r() * 0.8);
    const left = r() * 100, top = r() * 100;
    const dur = (({ fall: 14, rain: 1.1, rise: 12, drift: 70, glide: 40, shoot: 9, twinkle: 4, pulse: 6, float: 7, pop: 7, flutter: 9, draw: 6 })[anim] || 8) * (0.7 + r() * 0.6) / Math.max(0.1, m.speed);
    const delay = -r() * dur;
    const track = motion ? PARTICLE_TRACK[anim] : null;
    const glyphEl = lamps
      ? <div style={{ width: size, height: size, borderRadius: "50%", background: `radial-gradient(circle, ${c} 0%, color-mix(in srgb, ${a} 45%, transparent) 35%, transparent 70%)` }} />
      : <svg viewBox="0 0 100 100" width={size} height={size} style={{ overflow: "visible", display: "block" }}>{glyph?.(c, a, i, motion)}</svg>;
    const spin = { fall: `${(r() - 0.5) * 720}deg`, rain: "0deg" }[anim] || "0deg";
    const inner = (
      <div className={motion && !track && anim !== "none" && anim !== "draw" ? `syn-loop-m syn-m-${anim}` : undefined}
        style={{ "--dur": `${dur}s`, animationDelay: `${delay}s`, transform: `rotate(${(r() - 0.5) * (anim === "rain" ? 0 : 60)}deg)` }}>
        {glyphEl}
      </div>
    );
    if (track === "y" || track === "y-up") {
      return (
        <div key={i} style={{ position: "absolute", left: `${left}%`, top: 0, bottom: 0, width: size }}>
          <div className="syn-loop-m syn-m-track-y" style={{ "--dur": `${dur}s`, "--dx": `${(r() - 0.5) * 160}px`, "--spin": spin, animationDelay: `${delay}s`, animationDirection: track === "y-up" ? "reverse" : "normal", position: "absolute", top: 0, left: 0 }}>{glyphEl}</div>
        </div>
      );
    }
    if (track === "x") {
      return (
        <div key={i} style={{ position: "absolute", top: `${top}%`, left: 0, right: 0, height: size }}>
          <div className="syn-loop-m syn-m-track-x" style={{ "--dur": `${dur}s`, animationDelay: `${delay}s`, position: "absolute", left: 0, top: 0 }}>{glyphEl}</div>
        </div>
      );
    }
    if (track === "shoot") {
      return <div key={i} className="syn-loop-m syn-m-shoot" style={{ position: "absolute", left: `${left * 0.7}%`, top: `${top * 0.5}%`, "--dur": `${dur}s`, animationDelay: `${-delay / 3}s` }}>{glyphEl}</div>;
    }
    return <div key={i} style={{ position: "absolute", left: `${left}%`, top: `${top}%`, transform: "translate(-50%,-50%)" }}>{inner}</div>;
  });
}

/* ---------- Bands & overlays ---------- */
function Band({ m, c, a, motion, uid }) {
  const r = seeded(hash(m.id));
  switch (m.asset) {
    case "trees": {
      const row = (n, base, hMin, hMax, fill, op) => {
        let d = "";
        for (let i = 0; i < n; i++) {
          const x = (i / n) * 1000 + r() * 30, h = hMin + r() * (hMax - hMin), w = h * 0.42;
          d += `M${f2(x)},${base} L${f2(x + w / 2)},${f2(base - h)} L${f2(x + w)},${base} Z `;
        }
        return <path d={d} style={{ fill, opacity: op }} />;
      };
      return <svg viewBox="0 0 1000 260" preserveAspectRatio="none" width="100%" height="100%" aria-hidden>{row(34, 260, 120, 230, a, 0.55)}{row(26, 260, 80, 190, c, 1)}<rect y="240" width="1000" height="20" style={{ fill: c }} /></svg>;
    }
    case "wildflowers":
      return (
        <svg viewBox="0 0 1000 120" preserveAspectRatio="none" width="100%" height="100%" aria-hidden>
          {Array.from({ length: 60 }, (_, i) => {
            const x = i * 17 + r() * 10, h = 40 + r() * 70;
            return (
              <g key={i} className={motion ? "syn-loop-m syn-m-sway" : undefined} style={{ transformOrigin: `${x}px 120px`, "--dur": `${4 + r() * 3}s`, animationDelay: `${-r() * 4}s` }}>
                <path d={`M${x},120 Q${x + 6},${120 - h / 2} ${x + 2},${120 - h}`} style={{ fill: "none", stroke: c, strokeWidth: 2 }} />
                {i % 2 === 0 && <circle cx={x + 2} cy={120 - h} r={4 + r() * 3} style={{ fill: i % 4 ? a : "#fff" }} />}
              </g>
            );
          })}
        </svg>
      );
    case "skyline": {
      const blds = []; let x = 0;
      while (x < 1000) { const w = 40 + r() * 70, h = 60 + r() * 150; blds.push([x, w, h]); x += w + 4; }
      return (
        <svg viewBox="0 0 1000 220" preserveAspectRatio="none" width="100%" height="100%" aria-hidden>
          {blds.map(([bx, w, h], i) => (
            <g key={i}>
              <rect x={bx} y={220 - h} width={w} height={h} style={{ fill: c }} />
              {Array.from({ length: Math.floor(h / 18) * Math.floor(w / 14) }, (_, k) => {
                const cols = Math.floor(w / 14), wx = bx + 6 + (k % cols) * 14, wy = 220 - h + 8 + Math.floor(k / cols) * 18;
                if (r() > 0.42) return null;
                return <rect key={k} x={wx} y={wy} width="6" height="8" className={motion && r() > 0.8 ? "syn-loop-m syn-m-flicker" : undefined} style={{ fill: a, opacity: 0.85, "--dur": `${3 + r() * 5}s` }} />;
              })}
            </g>
          ))}
        </svg>
      );
    }
    case "torn-paper": {
      let d = "M0,60 ";
      for (let i = 0; i <= 50; i++) d += `L${i * 20},${f2(8 + r() * 22)} `;
      return <svg viewBox="0 0 1000 60" preserveAspectRatio="none" width="100%" height="100%" aria-hidden><path d={`${d}L1000,60 Z`} style={{ fill: c, filter: "drop-shadow(0 -4px 6px rgba(0,0,0,.15))" }} /></svg>;
    }
    case "chain": return <Chain c={c} a={a} uid={uid} />;
    case "waveform":
      return (
        <div style={{ display: "flex", alignItems: "center", gap: "0.6%", height: "100%", padding: "0 2%" }}>
          {Array.from({ length: 70 }, (_, i) => <i key={i} className={motion ? "syn-loop-m syn-m-wave" : undefined} style={{ flex: 1, height: `${20 + r() * 80}%`, borderRadius: 4, background: i % 5 ? c : a, transformOrigin: "center", "--dur": `${0.9 + r() * 1.4}s`, animationDelay: `${-r() * 2}s` }} />)}
        </div>
      );
    default: return null;
  }
}

function Overlay({ m, c, a, motion, uid }) {
  const r = seeded(hash(m.id));
  switch (m.asset) {
    case "mist":
      return Array.from({ length: 4 }, (_, i) => (
        <div key={i} className={motion ? "syn-loop-m syn-m-mist" : undefined}
          style={{ position: "absolute", left: "-30%", width: "160%", top: `${20 + i * 18}%`, height: "28%", background: `radial-gradient(50% 50% at 50% 50%, ${c}, transparent 70%)`, filter: "blur(30px)", opacity: 0.5 + i * 0.1, "--dur": `${(40 + i * 15) / m.speed}s`, animationDelay: `${-i * 9}s`, animationDirection: i % 2 ? "reverse" : "normal" }} />
      ));
    case "smoke":
      return Array.from({ length: 5 }, (_, i) => (
        <div key={i} className={motion ? "syn-loop-m syn-m-smoke" : undefined}
          style={{ position: "absolute", left: `${r() * 80}%`, top: `${r() * 70}%`, width: "45%", aspectRatio: "1", borderRadius: "50%", background: `radial-gradient(circle, ${i % 2 ? c : a}, transparent 65%)`, filter: "blur(40px)", "--dur": `${(26 + r() * 20) / m.speed}s`, animationDelay: `${-r() * 20}s` }} />
      ));
    case "sheen":
      return <div className={motion ? "syn-loop-m syn-m-sheen" : undefined} style={{ position: "absolute", top: "-20%", bottom: "-20%", left: "-40%", width: "30%", background: `linear-gradient(100deg, transparent, ${c}, transparent)`, filter: "blur(18px)", transform: "skewX(-18deg)", "--dur": `${9 / m.speed}s` }} />;
    case "scales":
      return (
        <svg width="100%" height="100%" aria-hidden>
          <defs><pattern id={`${uid}s`} width="34" height="24" patternUnits="userSpaceOnUse"><path d="M0 24 Q17 0 34 24 M-17 12 Q0 -12 17 12 M17 12 Q34 -12 51 12" style={{ fill: "none", stroke: c, strokeWidth: 1.2 }} /></pattern></defs>
          <rect width="100%" height="100%" style={{ fill: `url(#${uid}s)` }} />
        </svg>
      );
    case "grain":
      return <div style={{ position: "absolute", inset: 0, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />;
    case "light-beams":
      return [0, 1, 2].map((i) => <div key={i} className={motion ? "syn-loop-m syn-m-sway" : undefined} style={{ position: "absolute", top: "-10%", left: `${15 + i * 30}%`, width: "18%", height: "130%", transformOrigin: "50% 0", transform: `rotate(${(i - 1) * 14}deg)`, background: `linear-gradient(${i % 2 ? a : c}, transparent 80%)`, filter: "blur(24px)", "--dur": `${12 + i * 4}s` }} />);
    case "curtains":
      return ["left", "right"].map((side) => (
        <div key={side} className={motion ? "syn-loop-m syn-m-curtain" : undefined} style={{ position: "absolute", top: 0, bottom: 0, [side]: 0, width: "16%", transformOrigin: `${side} top`, "--dur": `${9 / m.speed}s`,
          background: `repeating-linear-gradient(90deg, ${c} 0 22px, ${a} 34px, ${c} 46px)`, boxShadow: `inset ${side === "left" ? -30 : 30}px 0 40px rgba(0,0,0,.35)`, borderRadius: side === "left" ? "0 0 60% 0" : "0 0 0 60%" }} />
      ));
    case "rain-window":
      return (
        <>
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(180deg, rgba(255,255,255,.06), transparent)`, backdropFilter: "blur(1px)" }} />
          {Array.from({ length: 26 }, (_, i) => {
            const left = r() * 100, len = 20 + r() * 60;
            return (
              <div key={i} style={{ position: "absolute", left: `${left}%`, top: 0, bottom: 0, width: 3 }}>
                <div className={motion ? "syn-loop-m syn-m-track-y" : undefined} style={{ position: "absolute", top: 0, width: 3, height: len, borderRadius: 3, background: `linear-gradient(transparent, ${c})`, opacity: 0.55, "--dur": `${(6 + r() * 8) / m.speed}s`, "--dx": "0px", "--spin": "0deg", animationDelay: `${-r() * 10}s` }} />
              </div>
            );
          })}
          {Array.from({ length: 40 }, (_, i) => <i key={i} style={{ position: "absolute", left: `${r() * 100}%`, top: `${r() * 100}%`, width: 3 + r() * 6, aspectRatio: "1", borderRadius: "50%", background: c, opacity: 0.35, boxShadow: "inset -1px -1px 2px rgba(0,0,0,.3)" }} />)}
        </>
      );
    default: return null;
  }
}

const ENTRANCE = { pop: "syn-m-in-pop", reveal: "syn-m-in-reveal", slither: "syn-m-in-reveal", flow: "syn-m-in-flow", draw: null };
const LOOP_OBJECT = { float: "float", sway: "sway", spin: "spin", pulse: "pulse", glow: "pulse", "drift-slow": "drift-slow", tick: null, twinkle: "twinkle", pop: "float", reveal: "float-soft", slither: "float-soft", flow: null, morph: null, wave: null };

/* One motif instance (object / particles / band / overlay). */
export function Motif({ m: raw, motion = true, bp = "desktop" }) {
  // Objects and particles shrink on smaller screens (per-motif tablet / mobile scale).
  const k = bp === "mobile" ? raw.mobileScale ?? 0.55 : bp === "tablet" ? raw.tabletScale ?? 0.8 : 1;
  const m = k === 1 ? raw : { ...raw, size: raw.size * k, count: raw.count * (bp === "mobile" ? 0.6 : 1) };
  const cat = m.asset === "custom" ? CUSTOM_MOTIF : MOTIF_BY_ID[m.asset];
  if (!cat) return null;
  const c = css(m.color, "#888"), a = css(m.accent, c);
  const anim = m.animation === "auto" || !m.animation ? cat.anim : m.animation;
  const s = Math.max(0.1, m.speed || 1);
  const uid = `mt${hash(m.id)}`;
  const hoverT = m.hover === "parallax" ? `translate3d(calc(var(--mx, 0) * ${m.depth * 50}px), calc(var(--my, 0) * ${m.depth * 50}px), 0)`
    : m.hover === "follow" ? `translate3d(calc(var(--mx, 0) * ${m.depth * 160}px), calc(var(--my, 0) * ${m.depth * 110}px), 0)`
      : m.hover === "tilt" ? `rotate(calc(var(--mx, 0) * ${m.depth * 18}deg))` : undefined;
  const glow = m.glow > 0 ? `drop-shadow(0 0 ${Math.round(m.glow * 26)}px ${c})` : undefined;
  const layerStyle = { position: "absolute", inset: 0, zIndex: m.z, opacity: m.opacity, transform: hoverT, transition: "transform .2s linear", filter: glow };

  if (cat.kind === "particles") return <div style={{ ...layerStyle, overflow: "hidden" }}><Particles m={m} c={c} a={a} motion={motion} anim={anim} /></div>;
  if (cat.kind === "overlay") return <div style={{ ...layerStyle, overflow: "hidden" }}><Overlay m={m} c={c} a={a} motion={motion} uid={uid} /></div>;
  if (cat.kind === "band") {
    return (
      <div style={layerStyle}>
        <div style={{ position: "absolute", left: 0, right: 0, height: m.size, top: `${m.y}%`, transform: `translateY(-${m.y}%) scaleX(${m.flip ? -1 : 1})` }}>
          <Band m={m} c={c} a={a} motion={motion} uid={uid} />
        </div>
      </div>
    );
  }
  const Comp = OBJECTS[m.asset];
  const ratio = ASPECT[m.asset] || 1;
  const w = m.size, h = m.size / ratio;
  const entrance = motion ? ENTRANCE[anim] : null;
  const loop = motion ? LOOP_OBJECT[anim] : null;
  return (
    <div style={layerStyle}>
      <div className={entrance || undefined} style={{ position: "absolute", left: `${m.x}%`, top: `${m.y}%`, width: w, height: h, marginLeft: -w / 2, marginTop: -h / 2, animationDelay: `${m.delay || 0}s`, "--rot": `${m.rotation}deg` }}>
        <div style={{ width: "100%", height: "100%", transform: `rotate(${m.rotation}deg) scaleX(${m.flip ? -1 : 1})` }}>
          <div className={loop ? `syn-loop-m syn-m-${loop}` : undefined} style={{ width: "100%", height: "100%", "--dur": `${(anim === "spin" ? 14 : 8) / s}s` }}>
            {m.asset === "custom"
              ? (m.imageUrl ? <img src={m.imageUrl} alt="" draggable={false} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : null)
              : Comp ? <Comp c={c} a={a} uid={uid} motion={motion} s={s} text={m.text} image={m.imageUrl} texture={m.texture !== false} /> : null}
          </div>
        </div>
      </div>
    </div>
  );
}

// A whole layer of motifs for one section. Never interactive.
export default function MotifLayer({ motifs, motion = true, bp = "desktop", front = false, style }) {
  const list = motifs.filter((m) => m[bp] !== false).sort((x, y) => (x.z || 0) - (y.z || 0));
  if (!list.length) return null;
  return (
    <div aria-hidden className="syn-motifs" data-front={front || undefined}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", zIndex: front ? 4 : 0, ...style }}>
      {list.map((m) => <Motif key={m.id} m={m} motion={motion} bp={bp} />)}
    </div>
  );
}
