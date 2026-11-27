import { HeroElement, useHeroRuntime } from "./HeroRuntime.jsx";
import EditableText from "./EditableText.jsx";
import { useLinkProps } from "./links.js";
import { fontStack, loadFont } from "../../../utils/fonts.js";
import { colorOf } from "../../../utils/heroResolve.js";
import { css, px } from "../../../utils/tokens.js";

const PAD = { sm: [8, 14], md: [12, 22], lg: [16, 30] };
const SIZE = { sm: 12, md: 14, lg: 16 };

export default function HeroButton({ id, fullWidth = false }) {
  const { elementsById, resolveEl, palette } = useHeroRuntime();
  const linkProps = useLinkProps();
  const el = elementsById[id];
  if (!el) return null;
  const p = resolveEl(el);
  loadFont(p.fontFamily);
  const color = colorOf(p, palette);
  const solid = p.variant === "solid";
  const text = p.variant === "text";
  const glass = p.variant === "glass";
  const [py, padX] = PAD[p.size] || PAD.md;
  const bg = p.bgColor ? css(p.bgColor) : solid ? color : glass ? "rgba(255,255,255,.08)" : "transparent";
  const fg = p.textColor ? css(p.textColor) : solid ? palette.background : color;
  // size "theme": padding / font size come from the global button settings
  const themed = p.size === "theme";

  const style = {
    display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 10,
    padding: text ? "4px 0" : themed && p.paddingY == null ? "var(--syn-btn-py) var(--syn-btn-px)" : `${p.paddingY ?? py}px ${p.paddingX ?? padX}px`,
    fontSize: px(p.fontSize, themed ? "var(--syn-btn-size)" : `${SIZE[p.size] || 14}px`),
    fontFamily: fontStack(p.fontFamily), fontWeight: p.fontWeight || (themed ? "var(--syn-btn-weight)" : 600), letterSpacing: p.uppercase ? ".08em" : ".01em",
    textTransform: p.uppercase ? "uppercase" : themed ? "var(--syn-btn-case)" : "none", textDecoration: text ? "underline" : "none", textUnderlineOffset: 6,
    borderRadius: px(p.radius), cursor: "pointer", boxSizing: "border-box", whiteSpace: "nowrap",
    background: bg, color: fg,
    border: text ? "none" : glass ? "1px solid rgba(255,255,255,.22)" : `${solid ? 0 : 1.5}px solid ${p.bgColor && solid ? css(p.bgColor) : p.borderColor ? css(p.borderColor) : color}`,
    backdropFilter: glass ? "blur(14px) saturate(140%)" : undefined,
    width: fullWidth ? "100%" : undefined,
    "--btn-glow": css(p.glowColor) || (p.bgColor ? css(p.bgColor) : color),
  };

  return (
    <HeroElement id={id} as="a" htmlProps={linkProps(p.href)} style={style} editKey="text"
      wrapperClassName={`syn-btn${p.hover && p.hover !== "none" ? ` syn-btn-${p.hover}` : ""}${p.variant === "solid" && p.bgColor === "$primary" ? " syn-btn-primary" : ""}`}
      wrapperStyle={{ display: fullWidth ? "block" : "inline-block" }}>
      <EditableText id={id} k="text" value={p.text} />{p.arrow && <span aria-hidden className="syn-btn-arrow">→</span>}
    </HeroElement>
  );
}
