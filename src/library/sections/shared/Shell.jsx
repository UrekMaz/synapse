import { SectionMotifs } from "../../motifs/MotifContext.jsx";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../../components/hero-studio/runtime/HeroText.jsx";
import HeroButton from "../../../components/hero-studio/runtime/HeroButton.jsx";
import { css, px } from "../../../utils/tokens.js";
import { backgroundCss, cardClass, cardStyle, mixc } from "./style.js";
import { Icon } from "./icons.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { fontStack, loadFont } from "../../../utils/fonts.js";
import { useLinkProps } from "../../../components/hero-studio/runtime/links.js";
import { toLink } from "../../../utils/links.js";

/* Header: eyebrow, heading, subtitle (whichever exist). Alignment comes from the section. */
export function SectionHeader({ align, marginBottom = 56, children }) {
  const { elementsById, sectionProps: sp, bp } = useHeroRuntime();
  const a = align || sp.headerAlign || "center";
  if (!["eyebrow", "heading", "subtitle"].some((id) => elementsById[id]) && !children) return null;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: a === "center" ? "center" : "flex-start", textAlign: a, gap: 16, marginBottom: bp === "mobile" ? Math.min(marginBottom, 36) : marginBottom }}>
      {elementsById.eyebrow && <HeroText id="eyebrow" />}
      {elementsById.heading && <HeroText id="heading" as="h2" />}
      {elementsById.subtitle && <HeroText id="subtitle" as="p" />}
      {children}
    </div>
  );
}

export function Buttons({ ids, justify = "flex-start", style }) {
  const { elementsById, bp } = useHeroRuntime();
  const list = (ids || []).filter((id) => elementsById[id]);
  if (!list.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: justify, ...style }}>
      {list.map((id) => <HeroButton key={id} id={id} fullWidth={bp === "mobile" && list.length > 1} />)}
    </div>
  );
}

/* Section wrapper: background (colour / gradient / image), vertical rhythm, centred container. */
export function SectionShell({ children, style, innerStyle, as: Tag = "section" }) {
  const { sectionProps: sp, bp } = useHeroRuntime();
  return (
    <Tag style={{
      position: "relative", overflow: "hidden", isolation: "isolate", boxSizing: "border-box",
      background: backgroundCss(sp), color: css(sp.textColor, "var(--syn-text)"),
      fontFamily: "var(--syn-font-body)", lineHeight: "var(--syn-lh-body)",
      paddingBlock: `calc(${px(sp.paddingY, "var(--syn-section)")} + var(--nav-clear, 0px)) ${px(sp.paddingY, "var(--syn-section)")}`,
      // A height set by dragging the section's resize bar: content stays vertically centred.
      ...(sp.minHeight ? { minHeight: sp.minHeight, display: "flex", flexDirection: "column", justifyContent: "center" } : null), borderTop: sp.borderTop ? `1px solid ${css(sp.borderColor, "var(--syn-border)")}` : undefined,
      ...style,
    }}>
      {sp.backgroundImage && (
        <>
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: -2, backgroundImage: `url("${sp.backgroundImage}")`, backgroundSize: "cover", backgroundPosition: "center" }} />
          <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: -1, background: css(sp.background, "#000"), opacity: sp.imageOverlay ?? 0.5 }} />
        </>
      )}
      <SectionMotifs bp={bp} />
      <div style={{ position: "relative", zIndex: 2, boxSizing: "border-box", width: "100%", maxWidth: px(sp.container, "var(--syn-container)"), marginInline: "auto", paddingInline: px(sp.paddingX, "var(--syn-pad)"), ...innerStyle }}>
        {children}
      </div>
    </Tag>
  );
}

export function Grid({ cols, gap, children, style }) {
  return <div style={{ display: "grid", gridTemplateColumns: `repeat(${Math.max(1, cols || 1)}, minmax(0, 1fr))`, gap: px(gap, "var(--syn-gap)"), ...style }}>{children}</div>;
}

// Convenience: HeroElement with card chrome.
export function CardElement({ id, sp, children, style, wrapperStyle, extraClass }) {
  return (
    <HeroElement id={id} wrapperClassName={cardClass(sp, extraClass)} wrapperStyle={{ height: "100%", ...wrapperStyle }} style={cardStyle(sp, style)}>
      {children}
    </HeroElement>
  );
}

/* Image element ("media" type): upload / URL, crop ratio, focal point, radius. */
export function Media({ id, style, wrapperStyle, children }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const el = elementsById[id];
  if (!el) return null;
  const p = resolveEl(el);
  return (
    <HeroElement id={id} as={toLink(p.link).type !== "none" ? "a" : "div"} htmlProps={toLink(p.link).type !== "none" ? { ...linkProps(p.link), "aria-label": p.alt || "Image link" } : undefined}
      wrapperClassName={p.hoverZoom ? "syn-img-zoom" : undefined} wrapperStyle={{ minWidth: 0, ...wrapperStyle }}
      style={{ display: "block", position: "relative", overflow: "hidden", borderRadius: p.radius, aspectRatio: p.ratio === "auto" ? undefined : p.ratio, height: p.ratio === "auto" ? "100%" : undefined, background: "var(--syn-surface)", boxShadow: p.shadow ? `0 40px 80px -40px rgba(15,23,42,${0.25 + 0.35 * p.shadow})` : undefined, ...style }}>
      {p.imageUrl && <img src={p.imageUrl} alt={p.alt || ""} loading="lazy" decoding="async" draggable={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: `${p.focalX ?? 50}% ${p.focalY ?? 50}%` }} />}
      {children}
    </HeroElement>
  );
}

// Icon (or small image) badge used by features, services, stats and contact info.
export function IconBadge({ p, sp, size = 22, box = 48 }) {
  if (p.imageUrl) return <img src={p.imageUrl} alt="" loading="lazy" style={{ width: box, height: box, objectFit: "cover", borderRadius: 14, flexShrink: 0 }} />;
  if (!p.icon || sp.iconStyle === "none") return null;
  const c = css(sp.iconColor, "var(--syn-primary)");
  const look = {
    soft: { background: mixc(sp.iconColor, 12), color: c },
    solid: { background: c, color: "var(--syn-buttonText)", boxShadow: `0 12px 24px -12px ${c}` },
    outline: { border: `1.5px solid ${mixc(sp.iconColor, 40)}`, color: c },
  }[sp.iconStyle] || {};
  return <span style={{ display: "grid", placeItems: "center", width: box, height: box, borderRadius: 14, flexShrink: 0, boxSizing: "border-box", ...look }}><Icon name={p.icon} size={size} /></span>;
}

// Social icon links (list prop: [{ network, url }]).
export function Socials({ items, size = 18, style, boxed = true }) {
  const linkProps = useLinkProps();
  if (!items?.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8, ...style }}>
      {items.map((s, i) => (
        <a key={i} {...linkProps(typeof s.url === "string" && /^https?:/.test(s.url) ? { type: "external", url: s.url, newTab: true } : s.url)} aria-label={s.network} className="syn-social"
          style={{ display: "grid", placeItems: "center", width: boxed ? size + 18 : size, height: boxed ? size + 18 : size, borderRadius: 999, color: "inherit", border: boxed ? "1px solid color-mix(in srgb, currentColor 18%, transparent)" : "none", textDecoration: "none" }}>
          <Icon name={s.network} size={size} />
        </a>
      ))}
    </div>
  );
}

// Logo element ("logo" type): text wordmark with optional mark, or an uploaded image. Shared by navbars and footers.
export function BrandLogo({ id = "logo", scale = 1 }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const el = elementsById[id];
  if (!el) return null;
  const p = resolveEl(el);
  loadFont(p.fontFamily);
  const mark = p.kind === "text" && p.mark !== "none" && (
    p.mark === "spark" ? <Icon name="sparkles" size={Math.round(p.fontSize * 0.95)} color={css(p.markColor)} strokeWidth={2.2} />
      : <i style={{ width: p.fontSize * 0.5, height: p.fontSize * 0.5, borderRadius: p.mark === "dot" ? "50%" : 3, background: css(p.markColor), display: "inline-block" }} />
  );
  return (
    <HeroElement id={id} as="a" htmlProps={{ ...linkProps(p.href), "aria-label": p.text || "Home" }}
      wrapperStyle={{ flexShrink: 0, transform: p.offsetX ? `translateX(${p.offsetX}px)` : undefined }}
      style={{ display: "inline-flex", alignItems: "center", gap: 9, textDecoration: "none", color: p.color ? css(p.color) : "inherit" }}>
      {p.kind === "image" && p.imageUrl
        ? <img src={p.imageUrl} alt={p.text || "Logo"} draggable={false} style={{ width: p.width, height: p.height, objectFit: "contain", display: "block" }} />
        : <>{mark}<EditableText id={id} k="text" value={p.text} style={{ fontFamily: fontStack(p.fontFamily), fontSize: p.fontSize * scale, fontWeight: p.fontWeight, letterSpacing: `${p.letterSpacing}em`, textTransform: p.textTransform, whiteSpace: "nowrap", lineHeight: 1 }} /></>}
    </HeroElement>
  );
}
