import { useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Grid, CardElement, Socials } from "../shared/Shell.jsx";
import { useItems, T, colsFor } from "../shared/style.js";

const radiusOf = (shape) => (shape === "circle" ? "50%" : shape === "square" ? 0 : 18);

function Photo({ p, sp, ratio, width = "100%" }) {
  const circle = sp.imageShape === "circle";
  return (
    <div className={sp.imageHover === "zoom" ? "syn-img-zoom" : sp.imageHover === "color" ? "syn-bw" : undefined}
      style={{ position: "relative", width, flexShrink: 0, overflow: "hidden", borderRadius: radiusOf(sp.imageShape), aspectRatio: circle ? "1/1" : ratio || sp.imageRatio, background: "var(--syn-surface)" }}>
      {p.imageUrl && <img src={p.imageUrl} alt={p.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />}
    </div>
  );
}

function Member({ id, sp, layout = "stack", big = false }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  const row = layout === "row";
  const center = sp.imageShape === "circle" && !row;
  return (
    <CardElement id={id} sp={sp} style={{ display: "flex", flexDirection: row ? "row" : "column", alignItems: row ? "center" : center ? "center" : "stretch", textAlign: center ? "center" : "left", gap: row ? 22 : 18 }}>
      <Photo p={p} sp={sp} width={row ? (big ? "46%" : 132) : center ? "72%" : "100%"} ratio={row && !big ? "1/1" : undefined} />
      <div style={{ display: "grid", gap: 6, minWidth: 0, alignContent: "center" }}>
        <EditableText id={id} k="name" value={p.name} as="h3" style={{ ...T.title(sp), fontSize: big ? "var(--syn-h2)" : "var(--syn-h3)" }} />
        <EditableText id={id} k="role" value={p.role} style={{ ...T.small(sp), color: "var(--syn-primary)", fontWeight: 600 }} />
        {(sp.showBio || big) && p.bio && <EditableText id={id} k="bio" value={p.bio} as="p" multiline style={{ ...T.body(sp), marginTop: 6 }} />}
        <Socials items={p.socials} style={{ marginTop: 10, justifyContent: center ? "center" : "flex-start" }} />
      </div>
    </CardElement>
  );
}

export default function Team() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const items = useItems("member");
  const mobile = bp === "mobile";

  if (sp.variant === "featured" && items.length) {
    const [lead, ...rest] = items;
    return (
      <SectionShell>
        <SectionHeader />
        <Member id={lead.id} sp={sp} layout={mobile ? "stack" : "row"} big />
        {rest.length > 0 && <Grid cols={colsFor(sp, rest.length)} gap={sp.gap} style={{ marginTop: 56 }}>{rest.map((m) => <Member key={m.id} id={m.id} sp={sp} />)}</Grid>}
      </SectionShell>
    );
  }
  const horizontal = sp.variant === "horizontal";
  return (
    <SectionShell>
      <SectionHeader />
      <Grid cols={colsFor(sp, items.length)} gap={sp.gap}>
        {items.map((m) => <Member key={m.id} id={m.id} sp={sp} layout={horizontal && !mobile ? "row" : "stack"} />)}
      </Grid>
    </SectionShell>
  );
}
