import { Fragment, useRef } from "react";
import { motion } from "framer-motion";

// Renders plain text, or split characters/words (for stagger animations and hover displacement).
export default function TextContent({ text, mode = "none", mask = false, pad = 8, displace = null, childVariants = null }) {
  const ref = useRef(null);
  if (mode === "none" && !displace) return text;

  const tokens = mode === "words" ? text.split(/(\s+)/).filter(Boolean) : Array.from(text);
  const Inner = childVariants ? motion.span : "span";

  const units = tokens.map((tk, i) => {
    if (/^\s+$/.test(tk)) return <span key={i} style={{ whiteSpace: "pre" }}>{tk}</span>;
    const core = (
      <Inner {...(childVariants ? { variants: childVariants } : {})} style={{ display: "inline-block", whiteSpace: "pre" }}>
        <span data-unit style={{ display: "inline-block", whiteSpace: "pre", transition: "transform .35s cubic-bezier(.2,.8,.2,1)" }}>{tk}</span>
      </Inner>
    );
    return mask ? (
      <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top", padding: `${pad}px 0`, margin: `-${pad}px 0` }}>{core}</span>
    ) : (
      <Fragment key={i}>{core}</Fragment>
    );
  });

  const onMove = (e) => {
    const { radius = 140, strength = 0.6 } = displace;
    ref.current?.querySelectorAll("[data-unit]").forEach((el) => {
      const r = el.getBoundingClientRect();
      const dx = r.left + r.width / 2 - e.clientX;
      const dy = r.top + r.height / 2 - e.clientY;
      const dist = Math.hypot(dx, dy) || 1;
      if (dist < radius) {
        const push = (1 - dist / radius) * strength * radius * 0.5;
        el.style.transform = `translate(${(dx / dist) * push}px, ${(dy / dist) * push}px)`;
      } else el.style.transform = "";
    });
  };
  const onLeave = () => ref.current?.querySelectorAll("[data-unit]").forEach((el) => (el.style.transform = ""));

  return (
    <span ref={ref} aria-label={text} onPointerMove={displace ? onMove : undefined} onPointerLeave={displace ? onLeave : undefined}>
      {units}
    </span>
  );
}