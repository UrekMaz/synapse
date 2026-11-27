import { useState } from "react";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader } from "../shared/Shell.jsx";
import { useItems, T, colsFor, cardClass, cardStyle, mixc } from "../shared/style.js";
import { Icon } from "../shared/icons.jsx";
import { css } from "../../../utils/tokens.js";
import { useLinkProps } from "../../../components/hero-studio/runtime/links.js";

const isNum = (v) => v !== "" && !Number.isNaN(Number(v));

function Plan({ id, sp, billing, inverted }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  const hl = css(sp.highlightColor, "var(--syn-primary)");
  const price = billing === "yearly" ? p.yearly : p.monthly;
  const fg = inverted ? "var(--syn-background)" : "var(--syn-text)";
  const muted = inverted ? "color-mix(in srgb, var(--syn-background) 70%, transparent)" : "var(--syn-muted)";
  const style = cardStyle(sp, {
    position: "relative", display: "flex", flexDirection: "column", gap: 20,
    background: inverted ? "var(--syn-text)" : css(sp.cardBg),
    border: p.highlighted && !inverted ? `2px solid ${hl}` : sp.cardBorderWidth ? `${typeof sp.cardBorderWidth === "number" ? `${sp.cardBorderWidth}px` : css(sp.cardBorderWidth)} solid ${css(sp.cardBorder)}` : "none",
    "--card-shadow": inverted || p.highlighted ? `0 40px 80px -36px ${mixc(sp.highlightColor, 55)}` : undefined,
  });
  return (
    <HeroElement id={id} wrapperClassName={cardClass(sp)} wrapperStyle={{ height: "100%", transform: inverted ? "scale(1.04)" : undefined, zIndex: inverted ? 1 : undefined, position: "relative" }} style={style}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <EditableText id={id} k="name" value={p.name} as="h3" style={{ ...T.title(sp), color: fg }} />
        {p.badge && <EditableText id={id} k="badge" value={p.badge} style={{ fontSize: 12, fontWeight: 700, padding: "5px 11px", borderRadius: 99, background: inverted ? hl : mixc(sp.highlightColor, 12), color: inverted ? "var(--syn-buttonText)" : hl, whiteSpace: "nowrap" }} />}
      </div>
      <EditableText id={id} k="description" value={p.description} as="p" multiline style={{ ...T.small(sp), color: muted, minHeight: 42 }} />
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, flexWrap: "wrap" }}>
        <span key={`${billing}-${price}`} style={{ fontFamily: "var(--syn-font-heading)", fontWeight: "var(--syn-weight-heading)", fontSize: 48, letterSpacing: "-0.04em", lineHeight: 1, color: fg, animation: "syn-fade .4s ease both" }}>
          {isNum(price) ? `${sp.currency}${price}` : price}
        </span>
        {isNum(price) && <span style={{ fontSize: 14, color: muted }}>{billing === "yearly" ? sp.periodYearly : sp.periodMonthly}</span>}
      </div>
      <a {...linkProps(p.ctaHref)} className="syn-plan-cta"
        style={{ display: "flex", justifyContent: "center", padding: "var(--syn-btn-py) var(--syn-btn-px)", borderRadius: "var(--syn-btn-radius)", fontWeight: "var(--syn-btn-weight)", fontSize: "var(--syn-btn-size)", textDecoration: "none",
          ...(p.highlighted || inverted ? { background: hl, color: "var(--syn-buttonText)" } : { border: `1px solid ${inverted ? "transparent" : "var(--syn-border)"}`, color: fg }) }}>
        <EditableText id={id} k="ctaText" value={p.ctaText} />
      </a>
      <ul style={{ listStyle: "none", margin: 0, padding: "20px 0 0", borderTop: `1px solid ${inverted ? "color-mix(in srgb, var(--syn-background) 15%, transparent)" : "var(--syn-border)"}`, display: "grid", gap: 12 }}>
        {(p.features || []).map((ft, i) => (
          <li key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 15, color: ft.included ? fg : muted, textDecoration: ft.included ? "none" : "line-through", opacity: ft.included ? 1 : 0.7 }}>
            <span style={{ lineHeight: 0, marginTop: 3, color: ft.included ? hl : muted }}><Icon name={ft.included ? "check" : "minus"} size={16} strokeWidth={2.4} /></span>
            {ft.text}
          </li>
        ))}
      </ul>
    </HeroElement>
  );
}

export default function Pricing() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const items = useItems("plan");
  const [billing, setBilling] = useState(null);
  const active = sp.showToggle ? billing || sp.defaultBilling : sp.defaultBilling;
  const cols = bp === "desktop" ? colsFor(sp, items.length) : bp === "tablet" ? Math.min(2, items.length) : 1;
  const featured = sp.variant === "featured" && bp === "desktop";

  return (
    <SectionShell>
      <SectionHeader marginBottom={sp.showToggle ? 32 : 56} />
      {sp.showToggle && (
        <div style={{ display: "flex", justifyContent: sp.headerAlign === "left" ? "flex-start" : "center", marginBottom: 48 }}>
          <div role="group" aria-label="Billing period" style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: 5, borderRadius: 999, background: "var(--syn-background)", border: "1px solid var(--syn-border)" }}>
            {[["monthly", sp.monthlyLabel], ["yearly", sp.yearlyLabel]].map(([k, label]) => (
              <button key={k} type="button" aria-pressed={active === k} onClick={() => setBilling(k)}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "9px 18px", borderRadius: 999, border: 0, cursor: "pointer", font: "inherit", fontSize: 14, fontWeight: 600, transition: "all .3s",
                  background: active === k ? "var(--syn-text)" : "transparent", color: active === k ? "var(--syn-background)" : "var(--syn-text)" }}>
                {label}
                {k === "yearly" && sp.saveLabel && <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, background: mixc(sp.highlightColor, 18), color: css(sp.highlightColor) }}>{sp.saveLabel}</span>}
              </button>
            ))}
          </div>
        </div>
      )}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`, gap: featured ? 0 : sp.gap, alignItems: featured ? "center" : "stretch", maxWidth: cols === 1 ? 460 : undefined, margin: "0 auto" }}>
        {items.map((pl) => {
          const inv = featured && pl.props.highlighted;
          return <div key={pl.id} style={{ height: "100%", padding: featured ? "0 6px" : 0 }}><Plan id={pl.id} sp={sp} billing={active} inverted={inv} /></div>;
        })}
      </div>
    </SectionShell>
  );
}
