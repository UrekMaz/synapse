import { Check } from "lucide-react";
import { fontStack, loadFont } from "../../utils/fonts.js";

// Gallery card: a tiny styled website mock drawn straight from the theme's tokens.
export default function ThemeCard({ theme: t, active, onPreview, onApply }) {
  loadFont(t.typography.heading);
  loadFont(t.typography.body);
  const c = t.colors;
  const head = { fontFamily: fontStack(t.typography.heading), fontWeight: t.typography.headingWeight, textTransform: t.typography.headingCase, color: c.headingText, letterSpacing: `${t.typography.headingTracking}em` };
  const body = { fontFamily: fontStack(t.typography.body), color: c.muted };
  const card = { flex: 1, height: 26, borderRadius: Math.min(t.cards.radius, 10), background: c.surface, border: t.cards.borderWidth ? `1px solid ${c.border}` : "none" };
  return (
    <div className={`overflow-hidden rounded-xl border transition ${active ? "border-ed-accent shadow-[0_0_0_1px_rgba(139,108,255,.8)]" : "border-ed-border hover:border-white/25"}`}>
      <button type="button" onClick={onPreview} className="block w-full text-left" title="Preview this theme">
        <div style={{ background: c.background, padding: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
            <i style={{ width: 8, height: 8, borderRadius: 99, background: c.primary }} />
            <span style={{ ...head, fontSize: 10 }}>Brand</span>
            <span style={{ marginLeft: "auto", display: "flex", gap: 5 }}>{[0, 1, 2].map((i) => <i key={i} style={{ width: 14, height: 3, borderRadius: 2, background: c.text, opacity: 0.35 }} />)}</span>
          </div>
          <div style={{ ...head, fontSize: 19, lineHeight: 1.05, marginBottom: 4 }}>Make it yours.</div>
          <div style={{ ...body, fontSize: 9.5, marginBottom: 9 }}>A complete visual identity, in one click.</div>
          <div style={{ display: "flex", gap: 5, marginBottom: 10 }}>
            <span style={{ fontFamily: fontStack(t.typography.button), fontSize: 8.5, fontWeight: 700, padding: "4px 9px", borderRadius: Math.min(t.buttons.radius, 99), background: c.primary, color: c.buttonText, textTransform: t.buttons.uppercase ? "uppercase" : "none" }}>Get started</span>
            <span style={{ fontFamily: fontStack(t.typography.button), fontSize: 8.5, fontWeight: 600, padding: "3px 9px", borderRadius: Math.min(t.buttons.radius, 99), border: `1px solid ${c.border}`, color: c.text }}>Learn more</span>
          </div>
          <div style={{ display: "flex", gap: 5 }}><i style={card} /><i style={card} /><i style={card} /></div>
        </div>
        <div style={{ height: 10, background: t.footer.background }} />
      </button>
      <div className="space-y-1.5 bg-ed-raised p-2.5">
        <div className="flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold">{t.name}</div>
            {t.artist && <div className="truncate text-[10px] text-ed-muted">{t.artist}</div>}
          </div>
          <div className="flex shrink-0 overflow-hidden rounded-md">{["primary", "secondary", "accent", "background", "text"].map((k) => <i key={k} className="h-4 w-3" style={{ background: c[k] }} />)}</div>
        </div>
        <p className="line-clamp-2 text-[11px] leading-snug text-ed-muted">{t.description}</p>
        <div className="flex flex-wrap gap-1">{(t.tags || []).slice(0, 4).map((g) => <span key={g} className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9.5px] text-ed-muted">{g}</span>)}</div>
        <div className="flex gap-1.5 pt-1">
          <button type="button" onClick={onPreview} className={`h-7 flex-1 rounded-lg border text-[11px] ${active ? "border-ed-accent text-white" : "border-ed-border text-ed-muted hover:text-white"}`}>{active ? <span className="inline-flex items-center gap-1"><Check size={11} /> Previewing</span> : "Preview"}</button>
          <button type="button" onClick={onApply} className="h-7 flex-1 rounded-lg bg-ed-accent text-[11px] font-semibold hover:brightness-110">Apply theme</button>
        </div>
      </div>
    </div>
  );
}
