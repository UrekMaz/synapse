import { useEffect, useRef, useState } from "react";
import { SYNAPSE_STROKES, SYNAPSE_VIEWBOX } from "./synapsePath.js";

const DRAW_MS = 1500; // the whole word — fast, like a sewing machine
const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

/*
 * "Synapse" written by a needle and thread: a solid thread races along each cursive stroke,
 * then pulls tight into a row of stitches. `onDone` fires once the word is complete.
 * Give it a new `key` to replay.
 */
export default function StitchedWordmark({ onDone, className = "" }) {
  const threads = useRef([]);
  const needle = useRef(null);
  const [phase, setPhase] = useState("drawing"); // drawing → stitched

  useEffect(() => {
    const paths = threads.current.filter(Boolean);
    const lens = paths.map((p) => p.getTotalLength());
    const total = lens.reduce((a, b) => a + b, 0);
    paths.forEach((p, i) => { p.style.strokeDasharray = `${lens[i]} ${lens[i]}`; });

    const paint = (progress) => {
      let left = progress * total;
      let head = null;
      paths.forEach((p, i) => {
        const drawn = Math.max(0, Math.min(lens[i], left));
        p.style.strokeDashoffset = String(lens[i] - drawn);
        if (drawn > 0) head = { p, at: drawn };
        left -= lens[i];
      });
      const n = needle.current;
      if (!n || !head) return;
      const a = head.p.getPointAtLength(head.at);
      const b = head.p.getPointAtLength(Math.max(0, head.at - 6));
      const angle = (Math.atan2(a.y - b.y, a.x - b.x) * 180) / Math.PI;
      n.setAttribute("transform", `translate(${a.x} ${a.y}) rotate(${angle})`);
    };

    // Reduced motion: finish on the first frame.
    const duration = reducedMotion() ? 0 : DRAW_MS;
    let raf, start;
    const tick = (now) => {
      start ??= now;
      const t = duration ? Math.min(1, (now - start) / duration) : 1;
      paint(ease(t));
      if (t < 1) raf = requestAnimationFrame(tick);
      else { setPhase("stitched"); onDone?.(); }
    };
    paint(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
    // Runs once per mount; remount (change the `key`) to replay.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stitched = phase === "stitched";
  return (
    <svg viewBox={SYNAPSE_VIEWBOX} className={`stitch-word ${className}`} role="img" aria-label="Synapse" data-phase={phase}>
      <defs>
        <linearGradient id="thread-grad" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0" stopColor="#b9a6ff" />
          <stop offset=".55" stopColor="#8b6cff" />
          <stop offset="1" stopColor="#4fb8e8" />
        </linearGradient>
        <linearGradient id="needle-grad" x1="0" x2="1">
          <stop offset="0" stopColor="#6b6b85" />
          <stop offset=".5" stopColor="#f4f4ff" />
          <stop offset="1" stopColor="#9a9ab5" />
        </linearGradient>
      </defs>

      {/* needle holes: faint, appear as the stitches settle */}
      <g className="stitch-holes" fill="none" stroke="#000" strokeOpacity=".7" strokeWidth="16" strokeLinecap="round" strokeDasharray="0 68" strokeDashoffset="-51">
        {SYNAPSE_STROKES.map((d, i) => <path key={i} d={d} />)}
      </g>
      {/* stitches: dashed thread with a soft shadow underneath */}
      <g className="stitch-stitches" fill="none" strokeLinecap="round" strokeDasharray="34 34">
        {SYNAPSE_STROKES.map((d, i) => <path key={`s${i}`} d={d} stroke="#000" strokeOpacity=".45" strokeWidth="26" transform="translate(5 9)" />)}
        {SYNAPSE_STROKES.map((d, i) => <path key={`t${i}`} d={d} stroke="url(#thread-grad)" strokeWidth="22" />)}
      </g>
      {/* the running thread drawn by the needle */}
      <g className="stitch-thread" fill="none" stroke="url(#thread-grad)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round">
        {SYNAPSE_STROKES.map((d, i) => <path key={i} d={d} ref={(el) => { threads.current[i] = el; }} />)}
      </g>
      {/* needle: tip at the origin, eye trailing behind */}
      <g ref={needle} className="stitch-needle" style={{ opacity: stitched ? 0 : 1 }}>
        <g transform="rotate(200)">
          <path d="M0 0 L190 -9 Q206 0 190 9 Z" fill="url(#needle-grad)" />
          <ellipse cx="178" cy="0" rx="10" ry="4" fill="#0a0a14" />
        </g>
      </g>
    </svg>
  );
}
