/*
 * Drag handles for the selected element (editor only).
 *   right edge → width · bottom edge → height · corner → scale (text & buttons) or width + height (images, cards…)
 * Sizes are stored as element props (_w, _h px and _zoom factor) so they follow the normal per-device overrides.
 * Double-click any handle to go back to the automatic size.
 */
const MIN_W = 24, MIN_H = 16;

export default function ResizeHandles({ targetRef, scalable, zoom = 1, onResize, onReset }) {
  const start = (mode) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    const el = targetRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    // Canvas zoom = screen px per CSS px, measured on the parent (which has no element zoom of its own).
    const parent = el.parentElement;
    const k = (parent && parent.offsetWidth ? parent.getBoundingClientRect().width / parent.offsetWidth : 1) || 1;
    // Current size in the element's own (pre-zoom) CSS px.
    const w0 = rect.width / k / zoom, h0 = rect.height / k / zoom, x0 = e.clientX, y0 = e.clientY;
    const handle = e.currentTarget;
    handle.setPointerCapture(e.pointerId);
    let raf = 0, last = null;
    const move = (ev) => {
      const dx = (ev.clientX - x0) / k / zoom, dy = (ev.clientY - y0) / k / zoom;
      if (mode === "e") last = { _w: Math.max(MIN_W, Math.round(w0 + dx)) };
      else if (mode === "s") last = { _h: Math.max(MIN_H, Math.round(h0 + dy)) };
      else if (scalable) last = { _zoom: Math.min(4, Math.max(0.3, +((zoom * (w0 + dx)) / w0).toFixed(2))) };
      else last = { _w: Math.max(MIN_W, Math.round(w0 + dx)), _h: Math.max(MIN_H, Math.round(h0 + dy)) };
      if (!raf) raf = requestAnimationFrame(() => { raf = 0; onResize(last); });
    };
    const up = () => {
      cancelAnimationFrame(raf);
      if (last) onResize(last);
      handle.removeEventListener("pointermove", move);
      handle.removeEventListener("pointerup", up);
      handle.removeEventListener("pointercancel", up);
      document.body.classList.remove("syn-resizing");
    };
    handle.addEventListener("pointermove", move);
    handle.addEventListener("pointerup", up);
    handle.addEventListener("pointercancel", up);
    document.body.classList.add("syn-resizing");
  };
  const reset = (e) => { e.stopPropagation(); onReset(); };
  const props = (mode, title) => ({ "data-handle": mode, title, onPointerDown: start(mode), onDoubleClick: reset, onClick: (e) => e.stopPropagation() });
  return (
    <>
      <span className="syn-rh syn-rh-e" {...props("e", "Drag to change width · double-click to reset")} />
      <span className="syn-rh syn-rh-s" {...props("s", "Drag to change height · double-click to reset")} />
      <span className="syn-rh syn-rh-se" {...props("se", scalable ? "Drag to scale · double-click to reset" : "Drag to resize · double-click to reset")} />
    </>
  );
}
