import { useEffect, useMemo, useRef, useState } from "react";
import HeroRenderer from "../../renderer/HeroRenderer.jsx";
import { createHeroNode } from "../../utils/heroNode.js";
import { getHero } from "../../registry/heroRegistry.js";
import { useEditorStore } from "../../store/editorStore.js";

/*
 * Live render of any section, scaled into a card. Height is measured, so auto-height sections (body, footer)
 * and short ones (navbars) both fit. Shows the finished design at rest; hovering plays its animation.
 * Pass `node` to preview a specific section (e.g. your own section in another design), otherwise the
 * library default is used — with portfolio copy on portfolio projects.
 */
export default function HeroThumbnail({ heroId, variationId = null, node: given = null, maxHeight, playOnHover = true }) {
  const ref = useRef(null);
  const inner = useRef(null);
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const [visible, setVisible] = useState(false);
  const [play, setPlay] = useState(0);
  const withSiteCopy = useEditorStore((s) => s.withSiteCopy);
  const siteKey = useEditorStore((s) => `${s.page?.siteType}|${s.page?.owner?.name}|${s.page?.owner?.role}`);
  const id = given?.type || heroId;
  const def = getHero(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps -- siteKey: re-copy when the project type / owner changes
  const node = useMemo(() => given || withSiteCopy(createHeroNode(heroId, variationId)), [given, heroId, variationId, withSiteCopy, siteKey]);
  const nav = def.kind === "nav";
  const W = nav ? 1100 : 1440;

  useEffect(() => {
    const el = ref.current;
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setVisible(true), { rootMargin: "160px" });
    ro.observe(el); io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);
  useEffect(() => {
    if (!visible || !inner.current) return;
    const ro = new ResizeObserver(([e]) => setH(e.contentRect.height));
    ro.observe(inner.current);
    return () => ro.disconnect();
  }, [visible]);

  const scale = w / W;
  const natural = h || def.defaults.props.minHeight || 600;
  const shown = Math.min(natural, maxHeight || (nav ? 260 : 1100));
  // Navbars are shown on a backdrop (transparent ones need something behind them).
  const backdrop = nav ? (node.props.overlay ? "linear-gradient(135deg,#1f1b3a,#0b0b14 60%,#2b1d1d)" : "linear-gradient(#f4f5f8,#e9ebf1)") : "var(--syn-background, #e5e7eb)";
  return (
    <div ref={ref} aria-hidden className="relative w-full overflow-hidden rounded-lg border border-ed-border"
      onMouseEnter={playOnHover ? () => setPlay((k) => k + 1) : undefined}
      style={{ height: Math.max(nav ? 54 : 70, shown * scale) || 120, background: backdrop }}>
      {visible && w > 0 && (
        <div style={{ width: W, transform: `scale(${scale})`, transformOrigin: "0 0", pointerEvents: "none" }}>
          <div ref={inner} style={{ position: "relative", minHeight: nav ? 260 : undefined }}>
            <HeroRenderer node={node} viewport="desktop" animated={play > 0} playKey={play} />
          </div>
        </div>
      )}
      {playOnHover && play === 0 && visible && <span className="pointer-events-none absolute bottom-1.5 right-1.5 rounded-full bg-black/55 px-1.5 py-0.5 text-[9px] font-semibold text-white">hover to play</span>}
    </div>
  );
}
