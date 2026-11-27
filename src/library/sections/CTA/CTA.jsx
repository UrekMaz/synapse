import { useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import { SectionShell, SectionHeader, Buttons, Media } from "../shared/Shell.jsx";
import { css } from "../../../utils/tokens.js";

function Message({ align }) {
  const { elementsById } = useHeroRuntime();
  const center = align === "center";
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: center ? "center" : "flex-start" }}>
      <SectionHeader align={align} marginBottom={34} />
      <Buttons ids={["cta", "cta-2"]} justify={center ? "center" : "flex-start"} />
      {elementsById.note && <HeroText id="note" wrapper={{ marginTop: 22 }} />}
    </div>
  );
}

export default function CTA() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const align = sp.align || "center";

  if (sp.variant === "split") {
    return (
      <SectionShell>
        <div style={{ display: "grid", gridTemplateColumns: bp === "desktop" ? "1fr 1fr" : "1fr", borderRadius: sp.cardRadius, overflow: "hidden", background: "var(--syn-surface)", border: "1px solid var(--syn-border)" }}>
          <Media id="media" style={{ height: "100%", minHeight: bp === "desktop" ? 460 : 260 }} />
          <div style={{ padding: sp.cardPadding, display: "flex", alignItems: "center" }}><Message align={align} /></div>
        </div>
      </SectionShell>
    );
  }
  if (sp.variant === "card") {
    return (
      <SectionShell>
        <div style={{ position: "relative", overflow: "hidden", borderRadius: sp.cardRadius, padding: sp.cardPadding, background: `linear-gradient(135deg, ${css(sp.cardFrom)}, ${css(sp.cardTo)})`, boxShadow: `0 50px 100px -50px ${css(sp.cardFrom)}` }}>
          <div aria-hidden style={{ position: "absolute", right: "-10%", top: "-40%", width: "60%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.28), transparent 65%)" }} />
          <div aria-hidden style={{ position: "absolute", left: "-12%", bottom: "-50%", width: "50%", aspectRatio: "1", borderRadius: "50%", background: "radial-gradient(circle, rgba(255,255,255,.16), transparent 65%)" }} />
          <div style={{ position: "relative" }}><Message align={align} /></div>
        </div>
      </SectionShell>
    );
  }
  return (
    <SectionShell innerStyle={{ maxWidth: align === "center" ? 920 : undefined }}>
      <Message align={align} />
    </SectionShell>
  );
}
