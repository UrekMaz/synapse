import { useEffect, useState } from "react";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Grid, CardElement } from "../shared/Shell.jsx";
import { useItems, colsFor, cardStyle } from "../shared/style.js";
import { Icon } from "../shared/icons.jsx";
import { css } from "../../../utils/tokens.js";

function Stars({ value, color }) {
  return (
    <span aria-label={`${value} out of 5`} style={{ display: "inline-flex", gap: 2 }}>
      {[0, 1, 2, 3, 4].map((i) => {
        const fill = Math.max(0, Math.min(1, value - i));
        return (
          <svg key={i} width="17" height="17" viewBox="0 0 24 24" aria-hidden>
            <defs><linearGradient id={`s${i}-${value}`}><stop offset={fill} stopColor={color} /><stop offset={fill} stopColor="currentColor" stopOpacity=".18" /></linearGradient></defs>
            <path d="M12 2.5l2.9 6 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.2 1.3-6.6-4.9-4.6 6.6-.8z" fill={`url(#s${i}-${value})`} />
          </svg>
        );
      })}
    </span>
  );
}

function Person({ id, p, size = 44 }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      {p.avatarUrl ? <img src={p.avatarUrl} alt="" loading="lazy" style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
        : <span style={{ width: size, height: size, borderRadius: "50%", background: "var(--syn-surface)", flexShrink: 0 }} />}
      <div style={{ minWidth: 0 }}>
        <EditableText id={id} k="name" value={p.name} style={{ display: "block", fontWeight: 650, color: "var(--syn-text)", fontSize: 15 }} />
        <span style={{ display: "block", fontSize: 13.5, color: "var(--syn-muted)" }}><EditableText id={id} k="role" value={p.role} />{p.company && <>, <EditableText id={id} k="company" value={p.company} /></>}</span>
      </div>
    </div>
  );
}

function Quote({ id, sp, slide = false }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  const inner = (
    <>
      {sp.showRating && <span style={{ color: "var(--syn-text)" }}><Stars value={p.rating} color={css(sp.starColor)} /></span>}
      <p style={{ margin: 0, fontSize: sp.quoteSize, lineHeight: 1.55, color: css(sp.cardTitle, "var(--syn-text)"), flex: 1 }}>
        “<EditableText id={id} k="quote" value={p.quote} multiline />”
      </p>
      <Person id={id} p={p} />
    </>
  );
  const s = { display: "flex", flexDirection: "column", gap: 20 };
  if (slide) return <HeroElement id={id} wrapperStyle={{ height: "100%" }} style={cardStyle(sp, s)}>{inner}</HeroElement>;
  return <CardElement id={id} sp={sp} style={s}>{inner}</CardElement>;
}

// Auto-advance helper (pauses while hovered, off when motion is off).
function useAutoplay(count, on, seconds) {
  const [i, setI] = useState(0);
  const [hold, setHold] = useState(false);
  useEffect(() => {
    if (!on || hold || count < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % count), seconds * 1000);
    return () => clearInterval(t);
  }, [on, hold, count, seconds]);
  return [Math.min(i, Math.max(0, count - 1)), setI, setHold];
}

const navBtn = { display: "grid", placeItems: "center", width: 46, height: 46, borderRadius: 999, border: "1px solid var(--syn-border)", background: "var(--syn-background)", color: "var(--syn-text)", cursor: "pointer" };

function Carousel({ items, sp, motion }) {
  const per = Math.max(1, Math.min(sp.perView || 1, items.length));
  const steps = Math.max(1, items.length - per + 1);
  const [i, setI, setHold] = useAutoplay(steps, motion && sp.autoplay, sp.interval || 5);
  const gap = 24;
  return (
    <div onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)}>
      <div style={{ overflow: "hidden", margin: -12, padding: 12 }}>
        <div style={{ display: "flex", gap, transition: "transform .7s cubic-bezier(.2,.8,.2,1)", transform: `translateX(calc(${-i} * (100% + ${gap}px) / ${per}))` }}>
          {items.map((t) => <div key={t.id} style={{ flex: `0 0 calc((100% - ${gap * (per - 1)}px) / ${per})`, minWidth: 0 }}><Quote id={t.id} sp={sp} slide /></div>)}
        </div>
      </div>
      {(sp.arrows || sp.dots) && steps > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: sp.headerAlign === "left" ? "space-between" : "center", gap: 18, marginTop: 32 }}>
          {sp.dots && (
            <div role="tablist" style={{ display: "flex", gap: 8 }}>
              {Array.from({ length: steps }, (_, k) => (
                <button key={k} type="button" role="tab" aria-selected={k === i} aria-label={`Go to slide ${k + 1}`} onClick={() => setI(k)}
                  style={{ width: k === i ? 26 : 8, height: 8, borderRadius: 99, border: 0, padding: 0, cursor: "pointer", background: k === i ? "var(--syn-primary)" : "var(--syn-border)", transition: "width .3s, background-color .3s" }} />
              ))}
            </div>
          )}
          {sp.arrows && (
            <div style={{ display: "flex", gap: 10 }}>
              <button type="button" aria-label="Previous" onClick={() => setI((i - 1 + steps) % steps)} style={navBtn}><span style={{ transform: "rotate(180deg)", lineHeight: 0 }}><Icon name="arrow" size={18} /></span></button>
              <button type="button" aria-label="Next" onClick={() => setI((i + 1) % steps)} style={navBtn}><Icon name="arrow" size={18} /></button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Featured({ items, sp, motion }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const [i, setI, setHold] = useAutoplay(items.length, motion && sp.autoplay, sp.interval || 6);
  const active = items[i];
  if (!active) return null;
  const p = resolveEl(elementsById[active.id]);
  return (
    <div onMouseEnter={() => setHold(true)} onMouseLeave={() => setHold(false)} style={{ textAlign: "center", maxWidth: 940, margin: "0 auto" }}>
      <span style={{ color: "var(--syn-primary)", opacity: 0.9 }}><Icon name="quote" size={44} strokeWidth={1.4} /></span>
      <HeroElement key={active.id} id={active.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 28, marginTop: 18, animation: "syn-fade .6s ease both" }}>
        <EditableText id={active.id} k="quote" value={p.quote} as="p" multiline
          style={{ margin: 0, fontFamily: "var(--syn-font-heading)", fontWeight: "var(--syn-weight-heading)", fontSize: `clamp(${Math.round(sp.quoteSize * 0.62)}px, ${(sp.quoteSize / 14.4).toFixed(2)}cqw, ${sp.quoteSize}px)`, lineHeight: 1.3, letterSpacing: "-0.02em", color: "var(--syn-text)" }} />
        {sp.showRating && <span style={{ color: "var(--syn-text)" }}><Stars value={p.rating} color={css(sp.starColor)} /></span>}
        <Person id={active.id} p={p} size={52} />
      </HeroElement>
      {items.length > 1 && (
        <div role="tablist" style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 36 }}>
          {items.map((t, k) => {
            const tp = resolveEl(elementsById[t.id]);
            return (
              <button key={t.id} type="button" role="tab" aria-selected={k === i} aria-label={`Show ${tp.name}`} onClick={() => setI(k)}
                style={{ padding: 0, border: 0, background: "none", cursor: "pointer", borderRadius: "50%", outline: k === i ? "2px solid var(--syn-primary)" : "2px solid transparent", outlineOffset: 3, opacity: k === i ? 1 : 0.55, transition: "opacity .3s, outline-color .3s" }}>
                <img src={tp.avatarUrl} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", display: "block" }} />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Testimonials() {
  const { sectionProps: sp, motion } = useHeroRuntime();
  const items = useItems("testimonial");
  let body;
  if (sp.variant === "carousel") body = <Carousel items={items} sp={sp} motion={motion} />;
  else if (sp.variant === "featured") body = <Featured items={items} sp={sp} motion={motion} />;
  else body = <Grid cols={colsFor(sp, items.length)} gap={sp.gap} style={{ alignItems: "stretch" }}>{items.map((x) => <Quote key={x.id} id={x.id} sp={sp} />)}</Grid>;
  return (
    <SectionShell>
      <SectionHeader />
      {body}
    </SectionShell>
  );
}
