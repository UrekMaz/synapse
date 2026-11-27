import { useState } from "react";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Buttons } from "../shared/Shell.jsx";
import { useItems, T } from "../shared/style.js";
import { Icon } from "../shared/icons.jsx";

function ToggleIcon({ style, open }) {
  if (style === "plus") {
    return (
      <span aria-hidden style={{ position: "relative", width: 16, height: 16, flexShrink: 0 }}>
        <i style={{ position: "absolute", left: 0, right: 0, top: 7, height: 2, borderRadius: 2, background: "currentColor" }} />
        <i style={{ position: "absolute", top: 0, bottom: 0, left: 7, width: 2, borderRadius: 2, background: "currentColor", transition: "transform .35s ease", transform: open ? "scaleY(0)" : "none" }} />
      </span>
    );
  }
  return <span aria-hidden style={{ lineHeight: 0, transition: "transform .35s ease", transform: open ? (style === "arrow" ? "rotate(-45deg)" : "rotate(180deg)") : style === "arrow" ? "rotate(45deg)" : "none" }}><Icon name={style === "arrow" ? "arrow" : "chevron"} size={18} /></span>;
}

function Item({ id, sp, open, onToggle }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  const panel = `${id}-panel`;
  return (
    <HeroElement id={id} style={{
      borderRadius: sp.boxed ? 16 : 0, background: sp.boxed ? "var(--syn-surface)" : "transparent", border: sp.boxed ? "1px solid var(--syn-border)" : "none",
      borderBottom: sp.boxed ? undefined : "1px solid var(--syn-border)", padding: sp.boxed ? "0 22px" : 0, transition: "background-color .3s",
    }}>
      <button type="button" aria-expanded={open} aria-controls={panel} onClick={onToggle}
        style={{ display: "flex", width: "100%", alignItems: "center", justifyContent: "space-between", gap: 20, padding: "22px 0", border: 0, background: "none", color: "var(--syn-text)", font: "inherit", textAlign: "left", cursor: "pointer" }}>
        <EditableText id={id} k="question" value={p.question} style={{ fontFamily: "var(--syn-font-heading)", fontWeight: 600, fontSize: sp.questionSize, lineHeight: 1.35 }} />
        <span style={{ color: open ? "var(--syn-primary)" : "var(--syn-muted)", display: "inline-flex" }}><ToggleIcon style={sp.iconStyle} open={open} /></span>
      </button>
      <div id={panel} role="region" className="syn-collapse" data-open={open || undefined} style={{ "--collapse-dur": `${sp.duration}s` }}>
        <div style={{ overflow: "hidden" }}>
          <EditableText id={id} k="answer" value={p.answer} as="p" multiline style={{ ...T.body(), padding: "0 36px 24px 0", opacity: open ? 1 : 0, transition: `opacity ${sp.duration}s ease` }} />
        </div>
      </div>
    </HeroElement>
  );
}

// Open state = the user's clicks layered over each question's "open by default".
function useAccordion(items, multiple) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const [state, setState] = useState({});
  const isOpen = (id) => (id in state ? state[id] : !!resolveEl(elementsById[id]).open);
  const toggle = (id) => {
    const next = !isOpen(id);
    setState((s) => (multiple ? { ...s, [id]: next } : { ...Object.fromEntries(items.map((i) => [i.id, false])), [id]: next }));
  };
  return [isOpen, toggle];
}

export default function FAQ() {
  const { sectionProps: sp, bp, elementsById, resolveEl } = useHeroRuntime();
  const items = useItems("faq");
  const [isOpen, toggle] = useAccordion(items, sp.multiple);
  const desktop = bp === "desktop";
  const list = (subset) => <div style={{ display: "grid", gap: sp.boxed ? 12 : 0, borderTop: sp.boxed ? "none" : "1px solid var(--syn-border)" }}>{subset.map((i) => <Item key={i.id} id={i.id} sp={sp} open={isOpen(i.id)} onToggle={() => toggle(i.id)} />)}</div>;

  if (sp.variant === "minimal") {
    return (
      <SectionShell>
        <SectionHeader />
        <div style={{ display: "grid", gridTemplateColumns: bp === "mobile" ? "1fr" : "1fr 1fr", gap: "44px 64px" }}>
          {items.map((i) => {
            const p = resolveEl(elementsById[i.id]);
            return (
              <HeroElement key={i.id} id={i.id} style={{ display: "grid", gap: 10 }}>
                <EditableText id={i.id} k="question" value={p.question} as="h3" style={{ margin: 0, fontFamily: "var(--syn-font-heading)", fontWeight: 600, fontSize: sp.questionSize, color: "var(--syn-text)" }} />
                <EditableText id={i.id} k="answer" value={p.answer} as="p" multiline style={T.body()} />
              </HeroElement>
            );
          })}
        </div>
        <Buttons ids={["cta"]} style={{ marginTop: 48 }} />
      </SectionShell>
    );
  }

  if (sp.variant === "twocol") {
    return (
      <SectionShell>
        <div style={{ display: "grid", gridTemplateColumns: desktop ? "minmax(0, 0.8fr) minmax(0, 1.2fr)" : "1fr", gap: desktop ? 80 : 36, alignItems: "start" }}>
          <div style={{ position: desktop ? "sticky" : "static", top: 100 }}>
            <SectionHeader align="left" marginBottom={28} />
            <Buttons ids={["cta"]} />
          </div>
          {list(items)}
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <SectionHeader />
      <div style={{ maxWidth: sp.maxWidth, margin: "0 auto" }}>{list(items)}</div>
      <Buttons ids={["cta"]} justify="center" style={{ marginTop: 40 }} />
    </SectionShell>
  );
}
