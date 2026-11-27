import { createContext, useContext } from "react";
import { resolveHref, toLink } from "../../../utils/links.js";

/*
 * Provided by PageContainer (canvas + published pages):
 *   { site, currentPageId, basePath, editor, containerRef, scroll: { behavior, offset }, navigate(pageId, anchor) }
 * Thumbnails / the studio have no provider: links then resolve to plain hrefs.
 */
export const LinkContext = createContext(null);

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Height of sticky / fixed navbars so the destination heading never hides behind them.
function stickyNavHeight() {
  let h = 0;
  document.querySelectorAll('.section-wrap[data-kind="nav"]').forEach((w) => {
    const pos = getComputedStyle(w).position;
    if (pos !== "sticky" && pos !== "fixed") return;
    const nav = w.querySelector(".syn-nav");
    if (nav && nav.getAttribute("data-hidden") == null) h = Math.max(h, nav.getBoundingClientRect().height / zoomOf(w));
  });
  return h;
}
const zoomOf = (el) => {
  const root = el.closest(".page-root");
  return root ? root.getBoundingClientRect().width / (root.offsetWidth || 1) || 1 : 1;
};

export function scrollToAnchor(anchor, { container, behavior = "smooth", offset = 0 } = {}) {
  const target = anchor && document.getElementById(anchor);
  if (!target) return false;
  const k = zoomOf(target);
  const by = reducedMotion() ? "auto" : behavior === "instant" ? "auto" : "smooth";
  const extra = stickyNavHeight() + (offset || 0);
  if (container) {
    const top = container.scrollTop + (target.getBoundingClientRect().top - container.getBoundingClientRect().top) - extra * k;
    container.scrollTo({ top: Math.max(0, top), behavior: by });
  } else {
    window.scrollTo({ top: Math.max(0, window.scrollY + target.getBoundingClientRect().top - extra), behavior: by });
  }
  return true;
}

// Returns linkProps(value) → { href, target, rel, download, onClick } for any anchor.
export function useLinkProps() {
  const ctx = useContext(LinkContext);
  return (value, extra = {}) => {
    const l = toLink(value);
    const href = resolveHref(l, ctx || {});
    const out = { href };
    if ((l.type === "external" || l.type === "custom") && l.newTab) Object.assign(out, { target: "_blank", rel: "noopener noreferrer" });
    if (l.type === "file") Object.assign(out, l.newTab ? { target: "_blank", rel: "noopener noreferrer" } : { download: "" });
    if (!ctx || ctx.editor) return { ...out, ...extra };

    const sameAnchor = href.startsWith("#") && href.length > 1 ? href.slice(1) : null;
    const pageTarget = l.type === "page" ? l.pageId : l.type === "section" && !sameAnchor && href !== "#" ? (ctx.site.find((p) => p.sections.some((s) => s.id === l.sectionId))?.id) : null;
    out.onClick = (e) => {
      extra.onClick?.(e);
      if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey) return;
      if (sameAnchor) {
        e.preventDefault();
        const behavior = l.scroll && l.scroll !== "inherit" ? l.scroll : ctx.scroll?.behavior || "smooth";
        if (scrollToAnchor(sameAnchor, { container: ctx.containerRef?.current, behavior, offset: ctx.scroll?.offset })) {
          if (!ctx.inCanvas) window.history.pushState(null, "", `#${sameAnchor}`);
        }
      } else if (pageTarget && ctx.navigate) {
        e.preventDefault();
        ctx.navigate(pageTarget, href.includes("#") ? href.split("#")[1] : null);
      }
    };
    return { ...out, ...extra, onClick: out.onClick };
  };
}
