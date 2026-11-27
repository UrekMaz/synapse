import { useContext, useLayoutEffect, useRef } from "react";
import { HeroCtx } from "./heroContext.js";

/*
 * Inline text editing on the canvas. Double-click shows a contentEditable field in place;
 * Enter (or clicking away) saves, Escape cancels, Shift+Enter adds a line break in multi-line text.
 * Works for any string prop of any element: <EditableText id="card-1" k="title" value={p.title} />.
 */
export default function EditableText({ id, k = "text", value, multiline = false, as: Tag = "span", style, className }) {
  const rt = useContext(HeroCtx);
  const ref = useRef(null);
  const active = !!rt && rt.editing?.id === id && rt.editing.key === k;

  useLayoutEffect(() => {
    if (!active || !ref.current) return;
    ref.current.focus();
    const range = document.createRange();
    range.selectNodeContents(ref.current);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }, [active]);

  if (!active) {
    return (
      <Tag key="static" style={style} className={className}
        onDoubleClick={rt?.startEdit ? (e) => { e.stopPropagation(); rt.startEdit(id, k); } : undefined}>
        {value}
      </Tag>
    );
  }

  const finish = (e) => {
    const next = e.currentTarget.innerText.replace(/\n$/, "");
    if (e.currentTarget.dataset.cancel || next === value) rt.cancelEdit();
    else rt.commitEdit(id, k, multiline ? next : next.replace(/\s*\n\s*/g, " "));
  };

  return (
    <Tag key="editing" ref={ref} className={className} data-editing=""
      style={{ ...style, outline: "2px solid #8b6cff", outlineOffset: 4, cursor: "text", userSelect: "text", WebkitUserSelect: "text", whiteSpace: multiline ? "pre-wrap" : style?.whiteSpace, minWidth: 20 }}
      contentEditable="plaintext-only" suppressContentEditableWarning spellCheck={false}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => { e.stopPropagation(); e.preventDefault(); }}
      onKeyDown={(e) => {
        e.stopPropagation();
        if (e.key === "Escape") { e.currentTarget.dataset.cancel = "1"; e.currentTarget.blur(); }
        else if (e.key === "Enter" && !(multiline && e.shiftKey)) { e.preventDefault(); e.currentTarget.blur(); }
      }}
      onBlur={finish}>
      {value}
    </Tag>
  );
}
