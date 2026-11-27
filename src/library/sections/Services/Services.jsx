import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Buttons, Grid, CardElement, IconBadge } from "../shared/Shell.jsx";
import { useItems, T, colsFor } from "../shared/style.js";
import { Icon } from "../shared/icons.jsx";
import { useLinkProps } from "../../../components/hero-studio/runtime/links.js";

const num = (i) => String(i + 1).padStart(2, "0");
function More({ id, p }) {
  const linkProps = useLinkProps();
  return p.linkLabel ? (
  <a {...linkProps(p.href)} className="syn-link-arrow" style={{ color: "var(--syn-primary)", fontWeight: 600, fontSize: 15, textDecoration: "none", marginTop: "auto" }}>
    <EditableText id={id} k="linkLabel" value={p.linkLabel} /> <Icon name="arrow" size={16} />
  </a>
  ) : null;
}

function GridCard({ id, i, sp }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  return (
    <CardElement id={id} sp={sp} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <IconBadge p={{ ...p, imageUrl: "" }} sp={sp} />
        {sp.numbered && <span style={{ ...T.label, color: "var(--syn-muted)" }}>{num(i)}</span>}
      </div>
      <EditableText id={id} k="title" value={p.title} as="h3" style={{ ...T.title(sp), marginTop: 10 }} />
      <EditableText id={id} k="text" value={p.text} as="p" multiline style={T.body(sp)} />
      {p.tag && <EditableText id={id} k="tag" value={p.tag} style={{ ...T.small(sp), fontWeight: 600, color: "var(--syn-text)" }} />}
      <More id={id} p={p} />
    </CardElement>
  );
}

function ListRow({ id, i, sp, mobile }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  return (
    <HeroElement id={id} as="a" htmlProps={{ ...linkProps(p.href), className: "syn-service-row" }}
      style={{ display: "grid", gridTemplateColumns: mobile ? "1fr auto" : `${sp.numbered ? "72px " : ""}minmax(0, 1.1fr) minmax(0, 1fr) auto`, alignItems: "center", gap: mobile ? 12 : 32, padding: mobile ? "24px 0" : "34px 8px", borderTop: "1px solid var(--syn-border)", color: "inherit", textDecoration: "none" }}>
      {sp.numbered && !mobile && <span style={{ ...T.label, color: "var(--syn-muted)" }}>{num(i)}</span>}
      <EditableText id={id} k="title" value={p.title} as="h3" style={{ ...T.title(sp), fontSize: "calc(var(--syn-h3) * 1.35)", letterSpacing: "-0.02em" }} />
      {!mobile && <EditableText id={id} k="text" value={p.text} as="p" multiline style={T.body(sp)} />}
      <span className="syn-service-arrow" style={{ display: "grid", placeItems: "center", width: 48, height: 48, borderRadius: 999, border: "1px solid var(--syn-border)" }}><Icon name="arrow-up-right" size={20} /></span>
    </HeroElement>
  );
}

function ImageCard({ id, i, sp }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  return (
    <CardElement id={id} sp={sp} extraClass="syn-img-zoom" style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <a {...linkProps(p.href)} style={{ display: "block", position: "relative", overflow: "hidden", borderRadius: typeof sp.cardRadius === "number" ? Math.max(sp.cardRadius, 12) : "var(--syn-card-radius)", aspectRatio: sp.imageRatio, background: "var(--syn-surface)" }}>
        {p.imageUrl && <img src={p.imageUrl} alt="" loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
        {sp.numbered && <span style={{ position: "absolute", left: 14, top: 12, ...T.label, color: "#fff", textShadow: "0 1px 8px rgba(0,0,0,.4)" }}>{num(i)}</span>}
      </a>
      <EditableText id={id} k="title" value={p.title} as="h3" style={{ ...T.title(sp), marginTop: 6 }} />
      <EditableText id={id} k="text" value={p.text} as="p" multiline style={T.small(sp)} />
      <More id={id} p={p} />
    </CardElement>
  );
}

export default function Services() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const items = useItems("service");
  const mobile = bp === "mobile";
  const body = sp.variant === "list"
    ? <div style={{ borderBottom: "1px solid var(--syn-border)" }}>{items.map((s, i) => <ListRow key={s.id} id={s.id} i={i} sp={sp} mobile={mobile} />)}</div>
    : (
      <Grid cols={colsFor(sp, items.length)} gap={sp.gap}>
        {items.map((s, i) => (sp.variant === "images" ? <ImageCard key={s.id} id={s.id} i={i} sp={sp} /> : <GridCard key={s.id} id={s.id} i={i} sp={sp} />))}
      </Grid>
    );
  return (
    <SectionShell>
      <SectionHeader />
      {body}
      <Buttons ids={["cta"]} justify={sp.headerAlign === "left" ? "flex-start" : "center"} style={{ marginTop: 44 }} />
    </SectionShell>
  );
}
