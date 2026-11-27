import { useEffect, useRef, useState } from "react";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Grid, CardElement, IconBadge } from "../shared/Shell.jsx";
import { useItems, T, colsFor } from "../shared/style.js";
import { css } from "../../../utils/tokens.js";

// Counts from 0 to the target once the number scrolls into view (restarts on replay).
function CountUp({ p, sp, style }) {
  const { motion, playKey } = useHeroRuntime();
  const ref = useRef(null);
  const target = Number(p.value) || 0;
  const animate = motion && sp.countUp;
  const [v, setV] = useState(animate ? 0 : target);
  useEffect(() => {
    if (!animate || !ref.current) return;
    let raf = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const t0 = performance.now();
      const tick = (now) => {
        const k = Math.min(1, (now - t0) / ((sp.countDuration || 2) * 1000));
        setV(target * (1 - Math.pow(1 - k, 3)));
        if (k < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.35 });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [animate, target, sp.countDuration, playKey]);
  const shown = animate ? v : target;
  const fmt = new Intl.NumberFormat("en-US", { minimumFractionDigits: p.decimals || 0, maximumFractionDigits: p.decimals || 0, useGrouping: p.separator !== false });
  return (
    <span ref={ref} aria-label={`${p.prefix || ""}${fmt.format(target)}${p.suffix || ""}`} style={{ display: "block", fontVariantNumeric: "tabular-nums", ...style }}>
      {p.prefix}{fmt.format(shown)}{p.suffix}
    </span>
  );
}

const numberStyle = (sp) => ({ fontFamily: "var(--syn-font-heading)", fontWeight: "var(--syn-weight-heading)", fontSize: `clamp(${Math.round(sp.numberSize * 0.6)}px, ${(sp.numberSize / 14.4).toFixed(2)}cqw, ${sp.numberSize}px)`, lineHeight: 1, letterSpacing: "-0.04em", color: css(sp.numberColor, "var(--syn-text)") });

function Stat({ id, sp, i, cols }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  if (sp.variant === "icons") {
    return (
      <CardElement id={id} sp={sp} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <IconBadge p={p} sp={sp} />
        <CountUp p={p} sp={sp} style={{ ...numberStyle(sp), marginTop: 14 }} />
        <EditableText id={id} k="label" value={p.label} style={{ ...T.title(sp), fontSize: 17 }} />
        {p.text && <EditableText id={id} k="text" value={p.text} as="p" multiline style={T.small(sp)} />}
      </CardElement>
    );
  }
  const large = sp.variant === "large";
  const divide = sp.variant === "counters" && sp.dividers && i % cols !== 0;
  return (
    <HeroElement id={id} style={{ height: "100%", boxSizing: "border-box", textAlign: large ? "left" : "center", padding: large ? "28px 0 0" : "8px 16px", borderLeft: divide ? "1px solid var(--syn-border)" : "none", borderTop: large ? "1px solid var(--syn-border)" : "none" }}>
      <CountUp p={p} sp={sp} style={numberStyle(sp)} />
      <EditableText id={id} k="label" value={p.label} style={{ ...T.title(sp), fontSize: large ? 18 : 16, marginTop: large ? 16 : 12 }} />
      {large && p.text && <EditableText id={id} k="text" value={p.text} as="p" multiline style={{ ...T.small(sp), marginTop: 6, maxWidth: 320 }} />}
    </HeroElement>
  );
}

export default function Stats() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const items = useItems("stat");
  const cols = colsFor(sp, items.length);
  const grid = <Grid cols={cols} gap={sp.variant === "counters" ? 0 : sp.gap} style={{ rowGap: 40 }}>{items.map((s, i) => <Stat key={s.id} id={s.id} sp={sp} i={i} cols={cols} />)}</Grid>;
  if (sp.variant === "large") {
    return (
      <SectionShell>
        <div style={{ display: "grid", gridTemplateColumns: bp === "desktop" ? "minmax(0, 0.8fr) minmax(0, 1.2fr)" : "1fr", gap: bp === "desktop" ? 80 : 40, alignItems: "start" }}>
          <SectionHeader align="left" marginBottom={0} />
          {grid}
        </div>
      </SectionShell>
    );
  }
  return (
    <SectionShell>
      <SectionHeader marginBottom={48} />
      {grid}
    </SectionShell>
  );
}
