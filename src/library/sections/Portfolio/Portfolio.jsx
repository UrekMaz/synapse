import { useState } from "react";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Buttons } from "../shared/Shell.jsx";
import { useItems, T, colsFor } from "../shared/style.js";
import { Icon } from "../shared/icons.jsx";
import { useLinkProps } from "../../../components/hero-studio/runtime/links.js";

const MASONRY = ["4/5", "1/1", "3/4", "4/3", "4/5", "1/1"];

function Project({ id, sp, ratio, big = false, mobile }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  const overlay = sp.info === "overlay";
  const side = big && !mobile;
  const cls = [sp.hover === "zoom" ? "syn-img-zoom" : "", sp.hover === "lift" ? "syn-card syn-hover-lift" : "", overlay ? "syn-reveal-info" : ""].filter(Boolean).join(" ");
  return (
    <HeroElement id={id} wrapperClassName={cls} wrapperStyle={{ breakInside: "avoid", marginBottom: sp.variant === "masonry" ? sp.gap : 0 }}
      style={{ display: side ? "grid" : "block", gridTemplateColumns: side ? "minmax(0, 1.5fr) minmax(0, 1fr)" : undefined, gap: side ? 48 : undefined, alignItems: "center" }}>
      <a {...linkProps(p.href)} style={{ display: "block", position: "relative", overflow: "hidden", borderRadius: sp.radius, aspectRatio: ratio, background: "var(--syn-surface)", color: "#fff", textDecoration: "none" }}>
        {p.imageUrl && <img src={p.imageUrl} alt={p.title} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${p.focalX}% ${p.focalY}%`, display: "block" }} />}
        {overlay && (
          <div className="syn-info" style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: 22, background: "linear-gradient(to top, rgba(0,0,0,.72), transparent 60%)" }}>
            <span style={{ ...T.label, fontSize: 11, opacity: 0.8 }}>{p.category}</span>
            <span style={{ fontFamily: "var(--syn-font-heading)", fontWeight: "var(--syn-weight-heading)", fontSize: 22, marginTop: 6 }}>{p.title}</span>
          </div>
        )}
      </a>
      {(!overlay || side) && (
        <div style={{ marginTop: side ? 0 : 16, display: "grid", gap: side ? 14 : 4 }}>
          <EditableText id={id} k="category" value={p.category} style={{ ...T.label, fontSize: 11, color: "var(--syn-primary)" }} />
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline" }}>
            <EditableText id={id} k="title" value={p.title} as="h3" style={{ ...T.title(sp), fontSize: side ? "var(--syn-h2)" : "var(--syn-h3)" }} />
            {!side && <span style={{ color: "var(--syn-muted)", lineHeight: 0 }}><Icon name="arrow-up-right" size={18} /></span>}
          </div>
          {(side || sp.variant === "grid") && <EditableText id={id} k="text" value={p.text} as="p" multiline style={side ? T.body(sp) : T.small(sp)} />}
          {side && <a {...linkProps(p.href)} className="syn-link-arrow" style={{ color: "var(--syn-primary)", fontWeight: 600, textDecoration: "none", marginTop: 8 }}>View case study <Icon name="arrow" size={16} /></a>}
        </div>
      )}
    </HeroElement>
  );
}

export default function Portfolio() {
  const { sectionProps: sp, bp, elementsById, resolveEl } = useHeroRuntime();
  const all = useItems("project");
  const [cat, setCat] = useState("All");
  const mobile = bp === "mobile";
  const cats = ["All", ...new Set(all.map((p) => resolveEl(elementsById[p.id]).category).filter(Boolean))];
  const items = sp.filter && cat !== "All" ? all.filter((p) => resolveEl(elementsById[p.id]).category === cat) : all;
  const cols = colsFor(sp, items.length);

  let body;
  if (sp.variant === "masonry") {
    body = <div style={{ columnCount: cols, columnGap: sp.gap }}>{items.map((p, i) => <Project key={p.id} id={p.id} sp={sp} ratio={MASONRY[i % MASONRY.length]} mobile={mobile} />)}</div>;
  } else if (sp.variant === "featured" && items.length) {
    const [lead, ...rest] = items;
    body = (
      <>
        <Project id={lead.id} sp={sp} ratio="16/10" big mobile={mobile} />
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: sp.gap, marginTop: 56 }}>
          {rest.map((p) => <Project key={p.id} id={p.id} sp={sp} ratio={sp.imageRatio} mobile={mobile} />)}
        </div>
      </>
    );
  } else {
    body = <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: `${sp.gap * 1.6}px ${sp.gap}px` }}>{items.map((p) => <Project key={p.id} id={p.id} sp={sp} ratio={sp.imageRatio} mobile={mobile} />)}</div>;
  }

  return (
    <SectionShell>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 24, marginBottom: mobile ? 32 : 48 }}>
        <SectionHeader marginBottom={0} />
        {sp.filter && cats.length > 2 && (
          <div role="tablist" aria-label="Filter projects" style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {cats.map((c) => (
              <button key={c} type="button" role="tab" aria-selected={cat === c} onClick={() => setCat(c)}
                style={{ padding: "8px 16px", borderRadius: 999, border: `1px solid ${cat === c ? "var(--syn-text)" : "var(--syn-border)"}`, background: cat === c ? "var(--syn-text)" : "transparent", color: cat === c ? "var(--syn-background)" : "var(--syn-text)", font: "inherit", fontSize: 14, cursor: "pointer", transition: "all .25s" }}>
                {c}
              </button>
            ))}
          </div>
        )}
      </div>
      {body}
      <Buttons ids={["cta"]} justify="center" style={{ marginTop: 56 }} />
    </SectionShell>
  );
}
