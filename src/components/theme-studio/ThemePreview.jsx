import { useEffect, useMemo, useRef, useState } from "react";
import PageContainer from "../editor/Canvas/PageContainer.jsx";
import { VIEWPORTS } from "../../data/layoutPresets.js";
import { applyHeroTheme, createHeroNode } from "../../utils/heroNode.js";
import { loadFont } from "../../utils/fonts.js";

// Sample website used when the page is empty (or on request): navbar, hero, features, testimonial, pricing, footer.
const SAMPLE = [["nav-minimal"], ["spotlight-hero", "centered"], ["features", "cards"], ["testimonials", "featured"], ["pricing", "cards"], ["footer-columns"]];
let sampleCache = null;
const sample = () => (sampleCache ||= SAMPLE.map(([id, v]) => createHeroNode(id, v)));

/*
 * Live miniature of the website with a draft theme. Real Synapse sections render through the real renderer,
 * so what you see is exactly what applying the theme will produce.
 */
export default function ThemePreview({ theme, basePage, source = "page", viewport = "desktop", heroLevel = "accent", label }) {
  const box = useRef(null);
  const [w, setW] = useState(600);
  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width));
    ro.observe(box.current);
    return () => ro.disconnect();
  }, []);
  const sections = source === "page" && basePage.sections.length ? basePage.sections : sample();
  const nodes = useMemo(() => sections.map((s) => {
    const c = JSON.parse(JSON.stringify(s));
    if (!c.themeLock) applyHeroTheme(c, heroLevel, theme);
    return c;
  }), [sections, heroLevel, theme]);
  loadFont(theme.typography.heading);
  loadFont(theme.typography.body);
  const page = { ...basePage, id: "theme-preview", theme, sections: nodes };
  const deviceW = VIEWPORTS[viewport].width;
  const zoom = Math.min(1, (w - 2) / deviceW);

  return (
    <div className="flex h-full min-h-0 flex-col">
      {label && <div className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-ed-muted">{label}</div>}
      <div ref={box} className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden rounded-xl border border-ed-border bg-neutral-300">
        <div style={{ width: deviceW, zoom, margin: "0 auto" }} inert>
          <PageContainer page={page} viewport={viewport} editor={false} />
        </div>
      </div>
    </div>
  );
}
