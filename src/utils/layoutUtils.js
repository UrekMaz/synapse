import { v4 as uuid } from "uuid";
import { LAYOUT_PRESETS, NARROW_MAX, VIEWPORTS } from "../data/layoutPresets.js";

export const matchPreset = (width, composition) =>
  LAYOUT_PRESETS.find((p) => p.width === width && p.composition === composition) || null;

/** Wizard draft -> saved page JSON (layout is separate from sections). */
export function createPageFromConfig(d) {
  return {
    id: `page-${uuid().slice(0, 8)}`,
    name: d.name?.trim() || "Untitled Page",
    layout: {
      type: d.composition,
      width: d.width,
      maxWidth: d.maxWidth,
      columns: d.columns,
      columnGap: d.columnGap,
      sideMargin: d.sideMargin,
    },
    responsive: {
      desktop: { columns: d.columns, sideMargin: d.sideMargin },
      tablet: { columns: d.tabletColumns, sideMargin: d.tabletMargin },
      mobile: { columns: d.mobileColumns, sideMargin: d.mobileMargin },
    },
    sections: [],
  };
}

export const getContentMaxWidth = ({ width, maxWidth }) =>
  width === "narrow" ? Math.min(maxWidth, NARROW_MAX) : maxWidth;

/**
 * Single source of truth for every grid number used by canvas, overlay and preview.
 * The surface is always the full device width. "boxed" / "narrow" constrain the content box inside it;
 * "full" lets content run the whole width (minus side margins) and lets full-span sections bleed edge to edge.
 */
export function getGridForViewport(page, viewport) {
  const { layout, responsive } = page;
  const { columns, sideMargin } = responsive[viewport];
  const vw = VIEWPORTS[viewport].width;
  const full = layout.width === "full";
  const contentMax = full ? Infinity : getContentMaxWidth(layout);
  const contentWidth = Math.min(contentMax, vw - 2 * sideMargin);
  // pageMax includes side margins because .page-container uses border-box padding
  const pageMax = contentWidth + 2 * sideMargin;
  return { columns, sideMargin, columnGap: layout.columnGap, contentMax, contentWidth, pageMax, surfaceWidth: vw, viewportWidth: vw, full };
}

export const describeGrid = (g) => `${g.full ? "Full width" : "Boxed"} · ${g.contentWidth}px content · ${g.columns} columns · ${g.columnGap}px gap`;

/**
 * viewport given  -> editor simulation: concrete values set inline.
 * viewport null   -> real browser: expose per-breakpoint vars, CSS media queries pick them.
 */
export function getPageCssVars(page, viewport) {
  const { layout, responsive } = page;
  if (viewport) {
    const g = getGridForViewport(page, viewport);
    return {
      "--page-max-width": `${g.pageMax}px`,
      "--page-margin": `${g.sideMargin}px`,
      "--grid-columns": g.columns,
      "--grid-gap": `${g.columnGap}px`,
    };
  }
  return {
    "--page-max-width": layout.width === "full" ? "100%" : `${getContentMaxWidth(layout) + 2 * responsive.desktop.sideMargin}px`,
    "--grid-gap": `${layout.columnGap}px`,
    "--cols-desktop": responsive.desktop.columns,
    "--cols-tablet": responsive.tablet.columns,
    "--cols-mobile": responsive.mobile.columns,
    "--margin-desktop": `${responsive.desktop.sideMargin}px`,
    "--margin-tablet": `${responsive.tablet.sideMargin}px`,
    "--margin-mobile": `${responsive.mobile.sideMargin}px`,
  };
}

// Regions are defined on a 12-column scale, then scaled to the active column count.
const COMPOSITIONS = {
  standard: [{ id: "main", label: "Main content", s: 0, e: 12, primary: true }],
  split: [
    { id: "left", label: "Content", s: 0, e: 6, primary: true },
    { id: "right", label: "Media", s: 6, e: 12 },
  ],
  sidebar: [
    { id: "side", label: "Sidebar", s: 0, e: 3 },
    { id: "main", label: "Main content", s: 3, e: 12, primary: true },
  ],
  editorial: [{ id: "main", label: "Article", s: 2, e: 10, primary: true }],
  bento: [
    { id: "a", label: "Feature", s: 0, e: 6, r: 0, rs: 2, primary: true },
    { id: "b", label: "Tile", s: 6, e: 9, r: 0, rs: 1 },
    { id: "c", label: "Tile", s: 9, e: 12, r: 0, rs: 1 },
    { id: "d", label: "Wide tile", s: 6, e: 12, r: 1, rs: 1 },
  ],
};

export function getCompositionRegions(composition, columns, stacked = false) {
  const defs = COMPOSITIONS[composition] || COMPOSITIONS.standard;
  return defs.map((d, i) => {
    if (stacked) return { id: d.id, label: d.label, primary: !!d.primary, colStart: 1, colSpan: columns, rowStart: i + 1, rowSpan: 1 };
    const start = Math.round((d.s * columns) / 12);
    const end = Math.round((d.e * columns) / 12);
    return {
      id: d.id,
      label: d.label,
      primary: !!d.primary,
      colStart: start + 1,
      colSpan: Math.max(1, end - start),
      rowStart: (d.r ?? 0) + 1,
      rowSpan: d.rs ?? 1,
    };
  });
}

// Sections remember which composition region they live in; unknown/missing regions fall back to the primary one.
export function regionOf(section, regions) {
  return regions.some((r) => r.id === section.region) ? section.region : (regions.find((r) => r.primary) || regions[0]).id;
}

// Pixel width of a region in the editor simulation (picks the hero breakpoint inside narrow regions).
export function regionWidth(g, region) {
  const col = (g.contentWidth - (g.columns - 1) * g.columnGap) / g.columns;
  return Math.round(col * region.colSpan + g.columnGap * (region.colSpan - 1));
}

// Height a transparent (overlay) navbar occupies above the section at `index`, or 0.
export function navClearFor(sections, index, bp = "desktop") {
  const prev = sections[index - 1];
  if (!prev || prev.kind !== "nav" || !prev.props?.overlay) return 0;
  return { ...prev.props, ...(bp !== "desktop" ? prev.responsive?.tablet : {}), ...(bp === "mobile" ? prev.responsive?.mobile : {}) }.height || 0;
}

// Every other body section gets the alternate background when the theme asks for it.
export const altFor = (sections, index) => sections[index]?.kind === "body" && sections.slice(0, index).filter((s) => s.kind === "body").length % 2 === 1;

// Full-width pages let sections that span every column run edge to edge.
export const regionBleeds = (page, region, columns) => page.layout.width === "full" && region.colSpan >= columns;
