import { HeroElement, useHeroRuntime } from "./HeroRuntime.jsx";
import { FONTS, fontStack, loadFont } from "../../../utils/fonts.js";
import { colorOf } from "../../../utils/heroResolve.js";
import { css, isToken, px } from "../../../utils/tokens.js";

// Generic text element: headings, subtitles, metadata. Reusable by every hero. Double-click to edit on the canvas.
export default function HeroText({ id, as = "div", wrapper }) {
  const { elementsById, resolveEl, palette } = useHeroRuntime();
  const el = elementsById[id];
  if (!el) return null;
  const p = resolveEl(el);
  loadFont(p.fontFamily);

  const font = FONTS.find((f) => f.name === p.fontFamily);
  const color = colorOf(p, palette);
  const outline = p.style === "outline";
  const isLine = el.type === "heading-line";

  const style = {
    margin: 0, display: "block",
    fontFamily: fontStack(p.fontFamily), fontSize: px(p.fontSize),
    fontWeight: isToken(p.fontWeight) ? css(p.fontWeight) : font?.axis || isToken(p.fontFamily) || String(p.fontFamily).startsWith("var(") ? p.fontWeight : 400, fontStyle: p.italic ? "italic" : undefined, fontSynthesis: "none",
    lineHeight: css(p.lineHeight), letterSpacing: isToken(p.letterSpacing) ? css(p.letterSpacing) : `${p.letterSpacing}em`,
    textTransform: css(p.textTransform), textAlign: p.align,
    color: outline ? "transparent" : color,
    WebkitTextStroke: outline ? `${p.outlineWidth}px ${color}` : undefined,
    textShadow: p.glow ? `0 0 ${Math.round(p.glow * 48)}px color-mix(in srgb, ${p.glowColor || palette.accent} ${Math.round(p.glow * 90)}%, transparent)` : undefined,
    opacity: p.opacity ?? undefined,
    whiteSpace: isLine ? "nowrap" : "normal",
    textWrap: isLine ? undefined : "balance",
    // Optional badge look for eyebrows / labels
    ...(p.pill ? {
      display: "inline-block", padding: "7px 14px", borderRadius: 999,
      background: `color-mix(in srgb, ${color} 12%, transparent)`, border: `1px solid color-mix(in srgb, ${color} 30%, transparent)`,
      backdropFilter: "blur(8px)",
    } : {}),
  };
  const wrapperStyle = {
    display: "block",
    width: p.maxWidth ? undefined : "fit-content",
    maxWidth: p.maxWidth ? `min(${p.maxWidth}px, 100%)` : isLine ? undefined : "100%",
    alignSelf: isLine ? (p.align === "right" ? "flex-end" : p.align === "center" ? "center" : "flex-start") : undefined,
    marginTop: p.overlap || undefined,
    transform: `translate(${p.offsetX || 0}px, ${p.offsetY || 0}px) rotate(${p.rotation || 0}deg)`,
    transformOrigin: "0 50%",
    ...wrapper,
  };

  return (
    <HeroElement
      id={id} as={as} wrapperStyle={wrapperStyle} style={style} text={p.text} multiline={el.type === "text"}
      maskPad={Math.round((typeof p.fontSize === "number" ? p.fontSize : 32) * 0.15)}
      displace={p.hoverDisplace ? { radius: p.displaceRadius, strength: p.displaceStrength } : null}
    />
  );
}
