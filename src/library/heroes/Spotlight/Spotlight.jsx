import { useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import { SectionShell, SectionHeader, Buttons, Media } from "../../sections/shared/Shell.jsx";

function Glow() {
  return (
    <>
      <div aria-hidden style={{ position: "absolute", inset: "-8% -6% -12%", zIndex: -1, borderRadius: 48, background: "var(--syn-gradient)", opacity: 0.35, filter: "blur(60px)" }} />
      <div aria-hidden style={{ position: "absolute", left: "50%", top: "-30%", width: "70%", aspectRatio: "1", transform: "translateX(-50%)", zIndex: -1, borderRadius: "50%", background: "radial-gradient(circle, var(--syn-glow), transparent 65%)" }} />
    </>
  );
}

export default function Spotlight() {
  const { sectionProps: sp, bp, elementsById } = useHeroRuntime();
  const split = sp.variant === "split" && bp === "desktop";
  const text = (
    <div style={{ display: "flex", flexDirection: "column", alignItems: split ? "flex-start" : "center" }}>
      <SectionHeader align={split ? "left" : "center"} marginBottom={34} />
      <Buttons ids={["cta", "cta-2"]} justify={split ? "flex-start" : "center"} />
      {elementsById.note && <HeroText id="note" wrapper={{ marginTop: 18 }} />}
    </div>
  );
  return (
    <SectionShell>
      {split ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)", gap: 64, alignItems: "center" }}>
          {text}
          <div style={{ position: "relative", isolation: "isolate" }}>{sp.glow && <Glow />}<Media id="media" /></div>
        </div>
      ) : (
        <>
          {text}
          <div style={{ position: "relative", isolation: "isolate", marginTop: bp === "mobile" ? 44 : 72 }}>{sp.glow && <Glow />}<Media id="media" /></div>
        </>
      )}
    </SectionShell>
  );
}
