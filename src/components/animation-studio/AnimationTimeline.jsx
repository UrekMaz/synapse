import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronUp, Play, RotateCcw } from "lucide-react";
import { TRIGGERS, getPreset, timingOf } from "../../animations/presets/index.js";

const PPS = 120;      // pixels per second
const LABEL_W = 236;
const snap = (v) => Math.round(v / 0.05) * 0.05;
const fix = (v) => +v.toFixed(2);
const COLOR = { entrance: "bg-ed-accent", emphasis: "bg-ed-accent2", exit: "bg-pink-500", hover: "bg-amber-500", scroll: "bg-amber-500" };

export default function AnimationTimeline({ node, selectedElementId, api, onPlay }) {
  const tracks = node.elements
    .filter((e) => e.visible !== false && e.animation?.preset && e.animation.preset !== "none")
    .map((el) => ({ el, t: timingOf(el.animation) }))
    .filter((x) => x.t);
  const total = Math.max(0, ...tracks.filter((x) => x.t.auto).map((x) => x.t.start + x.t.duration));
  const span = Math.max(4, Math.ceil(total + 1));

  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const play = () => {
    cancelAnimationFrame(raf.current);
    onPlay();
    setPlaying(true);
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      setTime(Math.min(t, total));
      if (t < total + 0.25) raf.current = requestAnimationFrame(tick);
      else setPlaying(false);
    };
    raf.current = requestAnimationFrame(tick);
  };
  const reset = () => { cancelAnimationFrame(raf.current); setPlaying(false); setTime(0); };

  // Reorder = swap start times with the auto-playing track that starts just before / after this one.
  const order = tracks.filter((x) => x.t.auto).sort((a, b) => a.t.start - b.t.start);
  const neighbour = (el, dir) => order[order.findIndex((x) => x.el.id === el.id) + dir];
  const swap = (el, dir) => {
    const other = neighbour(el, dir);
    if (!other) return;
    api.setAnimation(el.id, { delay: other.el.animation.delay ?? 0 });
    api.setAnimation(other.el.id, { delay: el.animation.delay ?? 0 });
  };

  const drag = (e, el, mode) => {
    e.preventDefault();
    e.stopPropagation();
    api.select(el.id);
    const x0 = e.clientX;
    const d0 = el.animation.delay ?? 0;
    const dur0 = el.animation.duration ?? getPreset(el.animation.preset).defaults.duration ?? 0.8;
    const move = (ev) => {
      const dt = (ev.clientX - x0) / PPS;
      if (mode === "move") api.setAnimation(el.id, { delay: fix(Math.max(0, snap(d0 + dt))) });
      else api.setAnimation(el.id, { duration: fix(Math.max(0.1, snap(dur0 + dt))) });
    };
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", () => window.removeEventListener("pointermove", move), { once: true });
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex items-center gap-2 border-b border-ed-border px-3 py-2">
        <button onClick={play} className="flex h-8 items-center gap-1.5 rounded-lg bg-ed-accent px-3 text-xs font-semibold"><Play size={13} /> {playing ? "Replay" : "Play"}</button>
        <button onClick={reset} title="Reset playhead" className="grid h-8 w-8 place-items-center rounded-lg border border-ed-border bg-ed-raised"><RotateCcw size={13} /></button>
        <span className="ml-2 text-xs tabular-nums text-ed-muted">{time.toFixed(2)}s / {total.toFixed(2)}s</span>
        <span className="ml-auto hidden text-[11px] text-ed-muted md:block">Drag a bar to change its start · drag its right edge for duration · ▲▼ reorder · ▶ play one</span>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="relative" style={{ width: LABEL_W + span * PPS, minWidth: "100%" }}>
          <div className="sticky top-0 z-10 flex h-6 border-b border-ed-border bg-ed-panel">
            <div style={{ width: LABEL_W }} className="shrink-0 border-r border-ed-border" />
            <div className="relative flex-1">
              {Array.from({ length: span * 2 + 1 }).map((_, i) => (
                <div key={i} className="absolute top-0 h-full border-l border-ed-border/60" style={{ left: i * 0.5 * PPS }}>
                  {i % 2 === 0 && <span className="ml-1 text-[10px] text-ed-muted">{i / 2}s</span>}
                </div>
              ))}
            </div>
          </div>

          {tracks.map(({ el, t }) => (
            <div key={el.id} onPointerDown={() => api.select(el.id)}
              className={`flex h-9 border-b border-ed-border/50 ${selectedElementId === el.id ? "bg-ed-accent/10" : ""}`}>
              <div style={{ width: LABEL_W }} className="flex shrink-0 items-center gap-0.5 border-r border-ed-border pl-3 pr-1 text-xs">
                <span className="min-w-0 flex-1 truncate">{el.label}<span className="ml-1 text-ed-muted">· {t.preset.label}</span></span>
                <button title="Play only this animation" onPointerDown={(e) => e.stopPropagation()} onClick={() => api.previewElement(el.id)} className="grid h-6 w-6 place-items-center rounded text-ed-muted hover:bg-white/10 hover:text-white"><Play size={11} /></button>
                {t.auto && <>
                  <button title="Play earlier (swap with previous)" disabled={!neighbour(el, -1)} onPointerDown={(e) => e.stopPropagation()} onClick={() => swap(el, -1)} className="grid h-6 w-5 place-items-center rounded text-ed-muted hover:text-white disabled:opacity-25"><ChevronUp size={12} /></button>
                  <button title="Play later (swap with next)" disabled={!neighbour(el, 1)} onPointerDown={(e) => e.stopPropagation()} onClick={() => swap(el, 1)} className="grid h-6 w-5 place-items-center rounded text-ed-muted hover:text-white disabled:opacity-25"><ChevronDown size={12} /></button>
                </>}
              </div>
              <div className="relative flex-1">
                {t.auto ? (
                  <div onPointerDown={(e) => drag(e, el, "move")}
                    className={`absolute top-1.5 h-6 cursor-grab rounded-md ${COLOR[t.preset.kind]} ${selectedElementId === el.id ? "ring-2 ring-white/70" : ""}`}
                    style={{ left: t.start * PPS, width: Math.max(12, t.duration * PPS) }}>
                    <span className="pointer-events-none px-2 text-[10px] leading-6 text-white">{t.start.toFixed(2)}s</span>
                    <span onPointerDown={(e) => drag(e, el, "resize")} className="absolute right-0 top-0 h-full w-2 cursor-ew-resize rounded-r-md bg-white/35" />
                  </div>
                ) : (
                  <div className="absolute left-1 top-1.5 h-6 rounded-md border border-dashed border-ed-border px-2 text-[11px] leading-6 text-ed-muted">
                    {TRIGGERS.find((x) => x.value === (el.animation.trigger || "page-load"))?.label}
                  </div>
                )}
              </div>
            </div>
          ))}
          {tracks.length === 0 && <p className="p-4 text-xs text-ed-muted">No animated elements yet. Pick a preset in the Animations tab.</p>}

          <div className="pointer-events-none absolute bottom-0 top-0 w-px bg-ed-accent" style={{ left: LABEL_W + time * PPS }} />
        </div>
      </div>
    </div>
  );
}