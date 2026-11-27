/**
 * Rendered INSIDE .page-container, so it shares the exact same box and the same
 * CSS variables as the real .layout-grid. Never rendered in preview/published mode.
 */
export default function GridOverlay({ columns, showGrid, showBounds }) {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0 }}>
      {showBounds && (
        <>
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "var(--page-margin)", background: "rgba(139,108,255,.07)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "var(--page-margin)", background: "rgba(139,108,255,.07)" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, left: "var(--page-margin)", right: "var(--page-margin)", outline: "1px dashed rgba(139,108,255,.6)" }} />
        </>
      )}
      {showGrid && (
        <div style={{
          position: "absolute", top: 0, bottom: 0, left: "var(--page-margin)", right: "var(--page-margin)",
          display: "grid", gridTemplateColumns: "repeat(var(--grid-columns), minmax(0, 1fr))", columnGap: "var(--grid-gap)",
        }}>
          {Array.from({ length: columns }).map((_, i) => (
            <div key={i} style={{ background: "rgba(139,108,255,.13)" }} />
          ))}
        </div>
      )}
    </div>
  );
}