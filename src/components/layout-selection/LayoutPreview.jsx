import { getCompositionRegions, getContentMaxWidth } from "../../utils/layoutUtils.js";

const REF = 1440; // reference desktop width

// Mirrors the editor: the page always spans the device; boxed/narrow show a centered content box on a tinted page.
export default function LayoutPreview({ settings, variant = "card", showGrid = false }) {
  const { width, composition, maxWidth, columns, columnGap, sideMargin } = settings;
  const big = variant === "config";
  const full = width === "full";

  const contentPx = full ? REF - 2 * sideMargin : Math.min(getContentMaxWidth({ width, maxWidth }), REF - 2 * sideMargin);
  const padPct = ((REF - contentPx) / 2 / REF) * 100;
  const boxPct = Math.max(0, padPct - (sideMargin / REF) * 100);
  const gapPct = (columnGap / contentPx) * 100;
  const regions = getCompositionRegions(composition, columns);
  const template = `repeat(${columns}, minmax(0, 1fr))`;
  const skeleton = composition === "standard" || composition === "editorial";

  return (
    <div className={`relative w-full overflow-hidden rounded-xl border border-ed-border ${full ? "bg-white" : "bg-neutral-200"} ${big ? "aspect-[3/4]" : "aspect-[16/10]"}`}>
      {!full && <div className="absolute inset-y-0 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.06)] transition-all duration-300" style={{ left: `${boxPct}%`, right: `${boxPct}%` }} />}
      <div className="relative flex h-full flex-col">
        <div className="flex shrink-0 items-center gap-1" style={{ height: big ? "7%" : "12%", padding: `0 ${padPct}%` }}>
          <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
          <span className="ml-auto h-1 w-4 rounded bg-neutral-200" />
          <span className="h-1 w-4 rounded bg-neutral-200" />
          <span className="h-1.5 w-5 rounded bg-violet-300" />
        </div>

        <div className="relative min-h-0 flex-1 pb-2 transition-all duration-300" style={{ paddingInline: `${padPct}%` }}>
          <div className="grid h-full"
               style={{
                 gridTemplateColumns: template,
                 columnGap: `${gapPct}%`,
                 rowGap: big ? 8 : 4,
                 gridTemplateRows: composition === "bento" ? "repeat(2, minmax(0, 1fr))" : "minmax(0, 1fr)",
               }}>
            {regions.map((r) => (
              <div key={r.id}
                   className={`rounded-[3px] ${r.primary ? "bg-violet-100" : "bg-violet-200/80"}`}
                   style={{ gridColumn: `${r.colStart} / span ${r.colSpan}`, gridRow: `${r.rowStart} / span ${r.rowSpan}` }}>
                {skeleton && r.primary && (
                  <div className="flex h-full flex-col gap-1 p-1">
                    <div className="flex-[3] rounded-[2px] bg-violet-200" />
                    <div className="flex flex-1 gap-1"><i className="flex-1 rounded-[2px] bg-violet-200" /><i className="flex-1 rounded-[2px] bg-violet-200" /><i className="flex-1 rounded-[2px] bg-violet-200" /></div>
                  </div>
                )}
                {big && !(skeleton && r.primary) && <div className="p-1.5 text-[9px] font-semibold uppercase tracking-wider text-violet-500">{r.label}</div>}
              </div>
            ))}
          </div>

          {showGrid && (
            <div className="pointer-events-none absolute inset-y-0 grid"
                 style={{ left: `${padPct}%`, right: `${padPct}%`, gridTemplateColumns: template, columnGap: `${gapPct}%` }}>
              {Array.from({ length: columns }).map((_, i) => <div key={i} className="bg-violet-500/15" />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
