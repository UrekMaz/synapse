import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader } from "../shared/Shell.jsx";
import { useItems } from "../shared/style.js";
import { Icon } from "../shared/icons.jsx";
import { fontStack, loadFont } from "../../../utils/fonts.js";
import { useLinkProps } from "../../../components/hero-studio/runtime/links.js";
import { toLink } from "../../../utils/links.js";

function LogoMark({ id, sp, clone = false }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  loadFont(p.font);
  const h = sp.logoHeight;
  const look = {
    filter: sp.grayscale ? "grayscale(1)" : undefined, opacity: sp.opacity, color: "var(--syn-text)",
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: Math.round(h * 0.3), height: h * 1.4, flexShrink: 0, textDecoration: "none",
  };
  const content = p.imageUrl
    ? <img src={p.imageUrl} alt={p.name} loading="lazy" draggable={false} style={{ height: h, width: p.width || "auto", objectFit: "contain", display: "block" }} />
    : (
      <>
        {p.glyph && <Icon name={p.glyph} size={Math.round(h * 0.95)} strokeWidth={2.2} />}
        {clone ? <span>{p.name}</span> : <EditableText id={id} k="name" value={p.name} />}
      </>
    );
  const text = { fontFamily: fontStack(p.font), fontWeight: p.weight, fontSize: Math.round(h * 0.82), letterSpacing: "-0.02em", whiteSpace: "nowrap" };
  // Marquee duplicates are plain (not selectable) so each logo stays one element.
  if (clone) return <span aria-hidden className={sp.colorOnHover ? "syn-logo" : undefined} style={{ ...look, ...text }}>{content}</span>;
  return (
    // Opacity / grayscale live on the wrapper so the entrance animation (which animates opacity) can't override them.
    <HeroElement id={id} as={toLink(p.href).type !== "none" ? "a" : "div"} htmlProps={toLink(p.href).type !== "none" ? linkProps(p.href) : undefined} wrapperClassName={sp.colorOnHover ? "syn-logo" : undefined}
      wrapperStyle={{ filter: look.filter, opacity: look.opacity, flexShrink: 0 }} style={{ ...look, filter: undefined, opacity: undefined, ...text }}>
      {content}
    </HeroElement>
  );
}

export default function Logos() {
  const { sectionProps: sp } = useHeroRuntime();
  const items = useItems("logo");

  let body;
  if (sp.variant === "marquee") {
    const fade = sp.fadeEdges ? "linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent)" : undefined;
    body = (
      // Vertical padding keeps entrance animations (which start offset) inside the clipped strip so they can trigger.
      <div className="syn-marquee" style={{ overflow: "hidden", padding: "48px 0", margin: "-48px 0", WebkitMaskImage: fade, maskImage: fade }}>
        <div className="syn-loop-marquee" data-pause={sp.pauseOnHover || undefined}
          style={{ display: "flex", width: "max-content", animation: `syn-marquee ${sp.marqueeSpeed}s linear ${sp.loop ? "infinite" : "1 forwards"}` }}>
          {[0, 1].map((copy) => (
            <div key={copy} style={{ display: "flex", alignItems: "center", gap: sp.gap, paddingRight: sp.gap }}>
              {items.map((l) => <LogoMark key={l.id} id={l.id} sp={sp} clone={copy === 1} />)}
            </div>
          ))}
        </div>
      </div>
    );
  } else if (sp.variant === "grid") {
    body = (
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${sp.columns}, minmax(0, 1fr))`, borderTop: "1px solid var(--syn-border)", borderLeft: "1px solid var(--syn-border)" }}>
        {items.map((l) => (
          <div key={l.id} style={{ display: "grid", placeItems: "center", padding: "36px 16px", borderRight: "1px solid var(--syn-border)", borderBottom: "1px solid var(--syn-border)" }}>
            <LogoMark id={l.id} sp={sp} />
          </div>
        ))}
      </div>
    );
  } else {
    body = <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: `${Math.round(sp.gap * 0.6)}px ${sp.gap}px` }}>{items.map((l) => <LogoMark key={l.id} id={l.id} sp={sp} />)}</div>;
  }

  return (
    <SectionShell>
      <SectionHeader marginBottom={40} />
      {body}
    </SectionShell>
  );
}
