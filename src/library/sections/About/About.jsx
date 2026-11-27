import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Buttons, Media } from "../shared/Shell.jsx";
import { useItems, T } from "../shared/style.js";
import { css } from "../../../utils/tokens.js";

function Facts({ sp, center }) {
  const { elementsById, resolveEl, bp } = useHeroRuntime();
  const facts = useItems("fact");
  if (!facts.length) return null;
  return (
    <div style={{ display: "grid", gridTemplateColumns: `repeat(${bp === "mobile" ? Math.min(2, facts.length) : facts.length}, minmax(0, 1fr))`, gap: 24, marginTop: 40, textAlign: center ? "center" : "left" }}>
      {facts.map((f, i) => {
        const p = resolveEl(elementsById[f.id]);
        return (
          <HeroElement key={f.id} id={f.id} style={{ paddingLeft: sp.factDivider && i && !center ? 24 : 0, borderLeft: sp.factDivider && i && !center ? "1px solid var(--syn-border)" : "none" }}>
            <EditableText id={f.id} k="value" value={p.value} style={{ display: "block", fontFamily: "var(--syn-font-heading)", fontWeight: "var(--syn-weight-heading)", fontSize: "calc(var(--syn-h3) * 1.6)", letterSpacing: "-0.03em", lineHeight: 1.1, color: css(sp.factColor, "var(--syn-text)") }} />
            <EditableText id={f.id} k="label" value={p.label} style={{ ...T.small(), marginTop: 6 }} />
          </HeroElement>
        );
      })}
    </div>
  );
}

export default function About() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const stacked = bp !== "desktop";

  if (sp.variant === "editorial") {
    return (
      <SectionShell>
        <SectionHeader align="center" marginBottom={36} />
        <Buttons ids={["cta", "cta-2"]} justify="center" />
        <Media id="media" wrapperStyle={{ marginTop: 56 }} style={{ aspectRatio: bp === "mobile" ? "4/3" : "21/9" }} />
        <Facts sp={sp} center />
      </SectionShell>
    );
  }

  const right = sp.variant === "image-right";
  return (
    <SectionShell>
      <div style={{ display: "grid", gridTemplateColumns: stacked ? "1fr" : right ? `minmax(0, 1fr) ${sp.split}%` : `${sp.split}% minmax(0, 1fr)`, gap: stacked ? 44 : 80, alignItems: sp.verticalAlign }}>
        <Media id="media" wrapperStyle={{ order: right && !stacked ? 2 : 0 }} />
        <div>
          <SectionHeader align="left" marginBottom={32} />
          <Buttons ids={["cta", "cta-2"]} />
          <Facts sp={sp} />
        </div>
      </div>
    </SectionShell>
  );
}
