import { useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "../components/editor/Canvas/PageContainer.jsx";
import { ScrollContainerContext } from "../animations/engine/ScrollContainerContext.js";
import { LinkContext, scrollToAnchor } from "../components/hero-studio/runtime/links.js";
import { pageUrl, siteSummary } from "../utils/links.js";
import { getHero } from "../registry/heroRegistry.js";

/*
 * Renders one page of a site exactly as visitors see it. Used by /preview (the live draft) and by
 * /s/:site (a published snapshot). basePath decides how page links are written. #anchors scroll to sections.
 */
export default function SiteRenderer({ pages: all, current, linkSettings, basePath, title }) {
  const go = useNavigate();
  const ref = useRef(null);
  const home = all.find((p) => p.home) || all[0];

  const ctx = useMemo(() => ({
    site: siteSummary(home, all.filter((p) => p !== home), (s) => getHero(s.type)?.name || s.type),
    currentPageId: current.id, editor: false, containerRef: ref, scroll: linkSettings, basePath,
    navigate: (pageId, anchor) => {
      const target = all.find((p) => p.id === pageId);
      go(`${pageUrl(target, basePath)}${anchor ? `#${anchor}` : ""}`);
    },
  }), [all, home, current, linkSettings, basePath, go]);

  useEffect(() => {
    if (!title) return;
    const prev = document.title;
    document.title = title;
    return () => { document.title = prev; };
  }, [title]);

  // Hash on load / page change, and browser back & forward.
  useEffect(() => {
    const toHash = (behavior) => {
      const a = decodeURIComponent(window.location.hash.slice(1));
      if (a) scrollToAnchor(a, { container: ref.current, behavior, offset: linkSettings?.offset });
      else ref.current?.scrollTo({ top: 0 });
    };
    const t = setTimeout(() => toHash("instant"), 350);
    // The browser jumps to the fragment itself on back/forward; re-scroll just after so the navbar offset applies.
    const onPop = () => setTimeout(() => toHash(linkSettings?.behavior || "smooth"), 50);
    window.addEventListener("popstate", onPop);
    return () => { clearTimeout(t); window.removeEventListener("popstate", onPop); };
  }, [current, linkSettings]);

  return (
    <div ref={ref} className="h-full overflow-y-auto bg-neutral-200">
      <ScrollContainerContext.Provider value={ref}>
        <LinkContext.Provider value={ctx}>
          <PageContainer key={current.id} page={current} viewport={null} editor={false} />
        </LinkContext.Provider>
      </ScrollContainerContext.Provider>
    </div>
  );
}
