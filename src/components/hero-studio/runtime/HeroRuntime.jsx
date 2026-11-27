import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import AnimatedElement from "../../../animations/engine/AnimatedElement.jsx";
import { getMaskMode } from "../../../animations/presets/index.js";
import { paletteOf, resolveProps, useBreakpoint } from "../../../utils/heroResolve.js";
import EditableText from "./EditableText.jsx";
import ResizeHandles from "./ResizeHandles.jsx";
import { HeroCtx as Ctx } from "./heroContext.js";
import { css, isToken } from "../../../utils/tokens.js";

// Signature heroes use their colour props directly in CSS, so "$tokens" become var(--syn-…) before they render.
// Token-native sections (body, nav, footer, Spotlight) keep the raw tokens and resolve them themselves.
const resolveTokens = (o) => Object.fromEntries(Object.entries(o).map(([k, v]) => [k, isToken(v) ? css(v) : v]));
export const useHeroRuntime = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("Hero components must render inside <HeroHost>");
  return v;
};

/*
 * preview = { elementId, n }: replays one element on its own (delay zeroed) so the animation being edited is actually visible.
 * onEditProp(id, key, value): commits inline (double-click) text edits from the canvas.
 */
export function HeroHost({ node, editor, forcedBp, animated, playKey, preview, selectedElementId, onSelectElement, onEditProp, onResizeElement, children }) {
  const ref = useRef(null);
  const bp = useBreakpoint(ref, forcedBp);
  const prefersReduced = useReducedMotion();
  const reduced = !!prefersReduced && node.animationSettings?.respectReducedMotion !== false;
  const [editing, setEditing] = useState(null);
  const canEdit = !!(editor && onEditProp);

  const value = useMemo(() => {
    const native = node.kind !== "hero" || node.tokenNative;
    const sectionProps = native ? resolveProps(node.props, node.responsive, bp) : resolveTokens(resolveProps(node.props, node.responsive, bp));
    return {
      node, bp, editor, animated, playKey, reduced, selectedElementId, preview, editing,
      motion: animated && !reduced,
      elements: node.elements,
      elementsById: Object.fromEntries(node.elements.map((e) => [e.id, e])),
      sectionProps,
      palette: paletteOf(sectionProps),
      selectElement: (id) => onSelectElement?.(id),
      resolveEl: (e) => (native ? resolveProps(e.props, e.responsive, bp) : resolveTokens(resolveProps(e.props, e.responsive, bp))),
      startEdit: canEdit ? (id, key) => { onSelectElement?.(id); setEditing({ id, key }); } : null,
      commitEdit: (id, key, v) => { setEditing(null); onEditProp?.(id, key, v); },
      cancelEdit: () => setEditing(null),
      resizeElement: editor && onResizeElement ? (id, patch) => onResizeElement(id, patch, bp) : null,
    };
  }, [node, bp, editor, animated, playKey, reduced, selectedElementId, preview, editing, canEdit, onSelectElement, onEditProp, onResizeElement]);

  return (
    <Ctx.Provider value={value}>
      <div ref={ref} className="hero-host" data-kind={node.kind} data-editor={editor || undefined} data-bp={bp} data-motion={value.motion ? undefined : "off"} style={{ width: "100%" }}>{children}</div>
    </Ctx.Provider>
  );
}

// Smoothed pointer position written to CSS vars (--mx / --my in -1..1) on the given element. No React re-renders.
export function useMouseVars(ref, enabled) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--mx", "0");
    el.style.setProperty("--my", "0");
    if (!enabled) return;
    let tx = 0, ty = 0, x = 0, y = 0, raf = 0;
    const loop = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--mx", x.toFixed(4));
      el.style.setProperty("--my", y.toFixed(4));
      raf = Math.abs(tx - x) > 0.001 || Math.abs(ty - y) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const move = (e) => {
      const r = el.getBoundingClientRect();
      tx = ((e.clientX - r.left) / r.width) * 2 - 1;
      ty = ((e.clientY - r.top) / r.height) * 2 - 1;
      kick();
    };
    const leave = () => { tx = 0; ty = 0; kick(); };
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    };
  }, [ref, enabled]);
}

// Preview runs the element's own animation immediately, whatever its choreography delay or trigger.
const previewCfg = (cfg) => ({ ...cfg, delay: 0, trigger: cfg.trigger === "after-delay" || cfg.trigger === "viewport" ? "page-load" : cfg.trigger });

// Wrapper = positioning + selection chrome. Inner motion element = animation (so transforms never collide).
export function HeroElement({ id, as = "div", wrapperStyle, wrapperClassName, style, className, htmlProps, text, displace, maskPad = 8, editKey, multiline = false, children }) {
  const rt = useHeroRuntime();
  const wrapRef = useRef(null);
  const el = rt.elementsById[id];
  const r = el ? rt.resolveEl(el) : null;
  if (!el || el.visible === false || r.hidden) return null;
  // Sizes set by dragging the resize handles (per device, like any other element prop).
  const sized = {
    ...(r._w ? { width: r._w, maxWidth: "100%", flexShrink: 0 } : null),
    ...(r._h ? { height: r._h } : null),
    ...(r._zoom && r._zoom !== 1 ? { zoom: r._zoom } : null),
  };
  const scalable = text != null || /button|cta|link|badge|meta|label|logo/i.test(el.type);

  const pv = rt.preview?.elementId === id ? rt.preview : null;
  const cfg = pv && el.animation ? previewCfg(el.animation) : el.animation;
  const maskMode = getMaskMode(cfg, text != null);
  const selected = rt.editor && rt.selectedElementId === id;
  const resizable = selected && rt.resizeElement && el.type !== "background";
  const key = editKey || (text != null ? "text" : null);
  const editingText = text != null && rt.editing?.id === id && rt.editing.key === key;

  const inner = editingText ? (
    <EditableText id={id} k={key} value={text} multiline={multiline} as={as} style={style} className={className} />
  ) : (
    <AnimatedElement
      key={`${rt.playKey}-${pv?.n || 0}-${el.animation?.preset}-${el.animation?.trigger}`}
      cfg={cfg} tag={as} style={style} className={[className, htmlProps?.className].filter(Boolean).join(" ") || undefined} htmlProps={htmlProps}
      text={text} displace={displace} maskPad={maskPad} animated={rt.animated} reduced={rt.reduced}
    >
      {children}
    </AnimatedElement>
  );

  return (
    <div
      ref={wrapRef}
      className={`hero-el${wrapperClassName ? ` ${wrapperClassName}` : ""}`} data-type={el.type} data-el={id} data-label={el.label}
      data-editor={rt.editor || undefined} data-selected={selected || undefined} data-editable={rt.startEdit && key ? "" : undefined} data-h={r._h ? "" : undefined}
      style={{ ...wrapperStyle, ...sized }}
      onPointerDown={rt.editor ? (e) => { e.stopPropagation(); rt.selectElement(id); } : undefined}
      onDoubleClick={rt.startEdit && key ? (e) => { e.stopPropagation(); rt.startEdit(id, key); } : undefined}
      onClickCapture={rt.editor ? (e) => e.preventDefault() : undefined}
    >
      {maskMode === "element" && !editingText ? (
        <div style={{ overflow: "hidden", padding: `${maskPad}px ${maskPad / 2}px`, margin: `-${maskPad}px -${maskPad / 2}px` }}>{inner}</div>
      ) : inner}
      {resizable && !editingText && (
        <ResizeHandles targetRef={wrapRef} scalable={scalable} zoom={r._zoom || 1}
          onResize={(patch) => rt.resizeElement(id, patch)} onReset={() => rt.resizeElement(id, { _w: undefined, _h: undefined, _zoom: undefined })} />
      )}
    </div>
  );
}
