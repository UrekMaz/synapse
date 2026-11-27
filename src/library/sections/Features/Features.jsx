import { useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Buttons, Grid, CardElement, Media, IconBadge } from "../shared/Shell.jsx";
import { useItems, T, colsFor } from "../shared/style.js";
import { useLinkProps } from "../../../components/hero-studio/runtime/links.js";

function FeatureText({ id, p, sp }) {
  const linkProps = useLinkProps();
  return (
    <>
      <EditableText id={id} k="title" value={p.title} as="h3" style={T.title(sp)} />
      <EditableText id={id} k="text" value={p.text} as="p" multiline style={T.body(sp)} />
      {p.linkLabel && <a {...linkProps(p.href)} className="syn-link-arrow" style={{ color: "var(--syn-primary)", fontWeight: 600, fontSize: 15, textDecoration: "none" }}><EditableText id={id} k="linkLabel" value={p.linkLabel} /> →</a>}
    </>
  );
}

function FeatureCard({ id, sp }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  const center = sp.itemAlign === "center";
  return (
    <CardElement id={id} sp={sp} style={{ display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start", textAlign: center ? "center" : "left", gap: 14 }}>
      <IconBadge p={p} sp={sp} box={sp.variant === "icons" ? 56 : 48} size={sp.variant === "icons" ? 24 : 22} />
      <div style={{ display: "grid", gap: 8, marginTop: 6 }}><FeatureText id={id} p={p} sp={sp} /></div>
    </CardElement>
  );
}

function FeatureRow({ id, sp }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  return (
    <CardElement id={id} sp={sp} style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
      <IconBadge p={p} sp={sp} box={44} size={20} />
      <div style={{ display: "grid", gap: 6 }}><FeatureText id={id} p={p} sp={sp} /></div>
    </CardElement>
  );
}

export default function Features() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const items = useItems("feature");
  const mobile = bp === "mobile";

  if (sp.variant === "media") {
    const image = <Media id="media" wrapperStyle={{ order: sp.mediaSide === "right" && !mobile ? 2 : 0 }} />;
    return (
      <SectionShell>
        <div style={{ display: "grid", gridTemplateColumns: bp === "desktop" ? "minmax(0, 1fr) minmax(0, 1fr)" : "1fr", gap: bp === "desktop" ? 80 : 44, alignItems: "center" }}>
          {image}
          <div>
            <SectionHeader align="left" marginBottom={40} />
            <div style={{ display: "grid", gap: 26 }}>{items.map((i) => <FeatureRow key={i.id} id={i.id} sp={sp} />)}</div>
            <Buttons ids={["cta"]} style={{ marginTop: 36 }} />
          </div>
        </div>
      </SectionShell>
    );
  }

  return (
    <SectionShell>
      <SectionHeader />
      <Grid cols={colsFor(sp, items.length)} gap={sp.gap}>
        {items.map((i) => <FeatureCard key={i.id} id={i.id} sp={sp} />)}
      </Grid>
      <Buttons ids={["cta"]} justify={sp.headerAlign === "left" ? "flex-start" : "center"} style={{ marginTop: 48 }} />
    </SectionShell>
  );
}
