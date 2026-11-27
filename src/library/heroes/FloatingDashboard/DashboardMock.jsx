import { useEffect, useRef, useState } from "react";

// A believable product UI drawn at a fixed design width (1200) and scaled to the element.
const W = 1200;

const DATA = {
  analytics: {
    brand: "Lumen", title: "Overview", nav: ["Overview", "Analytics", "Customers", "Reports", "Integrations", "Settings"],
    kpis: [["Revenue", "$128.4k", "+12.4%"], ["Active users", "24.8k", "+8.1%"], ["Conversion", "4.62%", "+0.6%"], ["Churn", "1.8%", "-0.3%"]],
    chart: { title: "Revenue", sub: "Last 30 days", type: "area", data: [32, 38, 35, 44, 41, 52, 49, 58, 54, 63, 60, 71, 68, 79] },
    side: { title: "Traffic sources", type: "donut", data: [["Organic", 46], ["Direct", 24], ["Referral", 18], ["Social", 12]] },
    table: { title: "Recent transactions", cols: ["Customer", "Status", "Amount"], rows: [["Northwind Co.", "Paid", "$2,480"], ["Globex", "Pending", "$1,120"], ["Initech", "Paid", "$860"], ["Umbrella", "Refunded", "$340"]] },
    activity: [["New signup", "Acme Inc. · Team plan", "2m"], ["Invoice paid", "#INV-2041", "18m"], ["Report shared", "Q3 growth", "1h"]],
  },
  project: {
    brand: "Orbit", title: "Sprint 24", nav: ["Home", "My tasks", "Board", "Timeline", "Goals", "Settings"],
    kpis: [["Open tasks", "128", "-12"], ["Completed", "342", "+41"], ["In review", "24", "+6"], ["On track", "92%", "+4%"]],
    chart: { title: "Sprint velocity", sub: "Story points per week", type: "bars", data: [28, 34, 31, 39, 36, 42, 45, 41, 48, 52] },
    side: { title: "Team workload", type: "hbars", data: [["Design", 72], ["Engineering", 88], ["QA", 54], ["Marketing", 38]] },
    table: { title: "Tasks", cols: ["Task", "Status", "Due"], rows: [["Launch checklist", "Done", "Today"], ["Billing revamp", "In progress", "Fri"], ["Onboarding v2", "Review", "Mon"], ["API docs", "In progress", "Wed"]] },
    activity: [["Leo completed", "Launch checklist", "2m"], ["Ana commented", "Billing revamp", "9m"], ["New milestone", "Beta release", "1h"]],
  },
  finance: {
    brand: "Ledger", title: "Finances", nav: ["Dashboard", "Accounts", "Payments", "Cards", "Invoices", "Settings"],
    kpis: [["Balance", "$482,920", "+4.3%"], ["Income", "$64,210", "+11.8%"], ["Expenses", "$28,940", "-3.2%"], ["Savings rate", "38.4%", "+2.1%"]],
    chart: { title: "Cash flow", sub: "Income vs expenses", type: "area2", data: [40, 44, 42, 50, 47, 55, 53, 60, 58, 66, 63, 70], data2: [28, 30, 33, 31, 35, 34, 36, 38, 35, 37, 39, 36] },
    side: { title: "Spending", type: "donut", data: [["Payroll", 42], ["Software", 21], ["Office", 16], ["Travel", 11]] },
    table: { title: "Transactions", cols: ["Merchant", "Status", "Amount"], rows: [["Acme Corp", "Received", "+$12,000"], ["AWS", "Paid", "-$3,210"], ["Figma", "Paid", "-$540"], ["Stripe payout", "Received", "+$8,420"]] },
    activity: [["Transfer received", "Acme Corp", "now"], ["Card payment", "AWS · $3,210", "1h"], ["Invoice sent", "#INV-0932", "3h"]],
  },
  crm: {
    brand: "Pulse", title: "Pipeline", nav: ["Dashboard", "Leads", "Deals", "Contacts", "Campaigns", "Settings"],
    kpis: [["Leads", "1,284", "+14%"], ["Deals won", "86", "+18%"], ["Pipeline", "$1.24M", "+9.4%"], ["Win rate", "31.2%", "+3.6%"]],
    chart: { title: "Pipeline value", sub: "This quarter", type: "bars", data: [42, 48, 45, 56, 61, 58, 66, 72, 69, 78] },
    side: { title: "Deal stages", type: "hbars", data: [["Qualified", 92], ["Proposal", 64], ["Negotiation", 41], ["Closed won", 28]] },
    table: { title: "Contacts", cols: ["Name", "Stage", "Value"], rows: [["Brightline Labs", "Proposal", "$48,000"], ["Kite & Co.", "Qualified", "$12,500"], ["Norse Health", "Won", "$96,000"], ["Vela Studio", "Negotiation", "$31,200"]] },
    activity: [["New lead", "Brightline Labs", "1m"], ["Call logged", "Jordan · Norse Health", "25m"], ["Deal won", "$96,000", "2h"]],
  },
  minimal: {
    brand: "Mono", title: "Today", nav: ["Overview", "Analytics", "Settings"],
    kpis: [["Visitors", "12.4k", "+5.2%"], ["Signups", "1,284", "+9.0%"]],
    chart: { title: "Visitors", sub: "Last 14 days", type: "area", data: [30, 34, 31, 40, 38, 46, 44, 50, 49, 57, 55, 62, 60, 68] },
    side: null, table: null, activity: null,
  },
};

const STATUS = { Paid: "ok", Done: "ok", Received: "ok", Won: "ok", Pending: "warn", Review: "warn", "In progress": "info", Proposal: "info", Qualified: "info", Negotiation: "warn", Refunded: "bad" };

// Smooth path through points (Catmull-Rom → cubic Bézier).
function smooth(pts) {
  return pts.reduce((d, p, i, a) => {
    if (i === 0) return `M${p[0]},${p[1]}`;
    const p0 = a[i - 2] || a[i - 1], p1 = a[i - 1], p2 = p, p3 = a[i + 1] || p;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    return `${d} C${c1[0]},${c1[1]} ${c2[0]},${c2[1]} ${p2[0]},${p2[1]}`;
  }, "");
}
const toPts = (data, w, h, pad = 8) => {
  const max = Math.max(...data) * 1.1, min = Math.min(...data) * 0.7;
  return data.map((v, i) => [+(pad + (i * (w - pad * 2)) / (data.length - 1)).toFixed(1), +(h - pad - ((v - min) / (max - min)) * (h - pad * 2)).toFixed(1)]);
};

function Area({ data, data2, w, h, c, c2, animate, id }) {
  const pts = toPts(data, w, h);
  const line = smooth(pts);
  const fill = `${line} L${pts[pts.length - 1][0]},${h} L${pts[0][0]},${h} Z`;
  const pts2 = data2 ? toPts(data2, w, h) : null;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: "block", overflow: "visible" }}>
      <defs>
        <linearGradient id={`g-${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity=".35" /><stop offset="1" stopColor={c} stopOpacity="0" /></linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((k) => <line key={k} x1="0" x2={w} y1={h * k} y2={h * k} stroke="currentColor" strokeOpacity=".07" strokeDasharray="3 5" />)}
      <path d={fill} fill={`url(#g-${id})`} className={animate ? "syn-fade-in" : undefined} style={{ "--d": "1.4s" }} />
      {pts2 && <path d={smooth(pts2)} fill="none" stroke={c2} strokeWidth="2" strokeDasharray={animate ? undefined : "4 5"} className={animate ? "syn-draw" : undefined} style={{ "--len": 1600, "--d": "1s" }} />}
      <path d={line} fill="none" stroke={c} strokeWidth="2.6" strokeLinecap="round" className={animate ? "syn-draw" : undefined} style={{ "--len": 1600, "--d": ".8s" }} />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="5" fill={c} stroke="#fff" strokeWidth="2" className={animate ? "syn-fade-in" : undefined} style={{ "--d": "2.4s" }} />
    </svg>
  );
}

function Bars({ data, w, h, c, animate }) {
  const max = Math.max(...data);
  const bw = (w / data.length) * 0.56;
  return (
    <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", width: w, height: h, gap: 4 }}>
      {data.map((v, i) => (
        <div key={i} className={animate ? "syn-grow-y" : undefined}
          style={{ width: bw, height: `${(v / max) * 100}%`, borderRadius: "6px 6px 2px 2px", background: i === data.length - 1 ? c : `color-mix(in srgb, ${c} ${40 + (i / data.length) * 40}%, transparent)`, "--d": `${0.7 + i * 0.06}s` }} />
      ))}
    </div>
  );
}

function Donut({ data, c, t, animate }) {
  const total = data.reduce((a, [, v]) => a + v, 0);
  const shades = [c, `color-mix(in srgb, ${c} 65%, ${t.panel})`, `color-mix(in srgb, ${c} 40%, ${t.panel})`, `color-mix(in srgb, ${c} 20%, ${t.panel})`];
  const R = 54, C = 2 * Math.PI * R;
  const lens = data.map(([, v]) => (v / total) * C);
  const starts = lens.map((_, i) => lens.slice(0, i).reduce((a, b) => a + b, 0));
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
      <svg width="140" height="140" viewBox="0 0 140 140" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
        <circle cx="70" cy="70" r={R} fill="none" stroke={t.line} strokeWidth="16" />
        {lens.map((len, i) => (
          <circle key={i} cx="70" cy="70" r={R} fill="none" stroke={shades[i]} strokeWidth="16" strokeDasharray={`${len - 3} ${C}`} strokeDashoffset={-starts[i]}
            className={animate ? "syn-fade-in" : undefined} style={{ "--d": `${0.9 + i * 0.15}s` }} />
        ))}
      </svg>
      <div style={{ display: "grid", gap: 10, fontSize: 13 }}>
        {data.map(([k, v], i) => (
          <div key={k} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <i style={{ width: 9, height: 9, borderRadius: 3, background: shades[i] }} />
            <span style={{ color: t.muted, minWidth: 74 }}>{k}</span><b style={{ fontWeight: 600 }}>{v}%</b>
          </div>
        ))}
      </div>
    </div>
  );
}

function HBars({ data, c, t, animate }) {
  return (
    <div style={{ display: "grid", gap: 14 }}>
      {data.map(([k, v], i) => (
        <div key={k}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13, marginBottom: 6 }}><span style={{ color: t.muted }}>{k}</span><b style={{ fontWeight: 600 }}>{v}%</b></div>
          <div style={{ height: 8, borderRadius: 9, background: t.line }}>
            <div className={animate ? "syn-grow-x" : undefined} style={{ width: `${v}%`, height: "100%", borderRadius: 9, background: `linear-gradient(90deg, color-mix(in srgb, ${c} 55%, transparent), ${c})`, "--d": `${0.8 + i * 0.12}s` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

const Spark = ({ c, up = true }) => {
  const d = up ? [4, 6, 5, 8, 7, 10, 9, 12] : [12, 10, 11, 8, 9, 7, 8, 6];
  return <svg width="64" height="24" viewBox="0 0 64 24"><path d={smooth(toPts(d, 64, 24, 2))} fill="none" stroke={c} strokeWidth="2" strokeLinecap="round" /></svg>;
};

const theme = (dark, accent) => (dark ? {
  bg: "#0c0e19", panel: "#121526", panel2: "#161a2e", line: "rgba(255,255,255,.07)", text: "#e7e9f5", muted: "#7c83a4", side: "#0a0c16", accent,
} : {
  bg: "#f7f8fb", panel: "#ffffff", panel2: "#f2f4f8", line: "rgba(15,23,42,.08)", text: "#0f172a", muted: "#64748b", side: "#ffffff", accent,
});
const tone = { ok: "#10b981", warn: "#f59e0b", info: "#3b82f6", bad: "#ef4444" };

export default function DashboardMock({ kind = "analytics", dark = true, accent = "#7c5cff", width, height, animated = true }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(!animated);
  useEffect(() => {
    if (!animated || !ref.current) return;
    // Charts draw when the dashboard enters the viewport.
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [animated]);

  const d = DATA[kind] || DATA.analytics;
  const t = theme(dark, accent);
  const minimal = kind === "minimal";
  const k = width / W;
  const innerH = height / k;
  const panel = { background: t.panel, border: `1px solid ${t.line}`, borderRadius: 14, padding: 18 };
  const label = { fontSize: 13, color: t.muted };
  const chartW = minimal ? 1000 : 560;

  return (
    <div ref={ref} aria-hidden style={{ width, height, overflow: "hidden" }}>
      <div style={{ width: W, height: Math.max(innerH, 300), transform: `scale(${k})`, transformOrigin: "0 0", display: "flex", background: t.bg, color: t.text, fontFamily: "Inter, system-ui, sans-serif", fontSize: 14, letterSpacing: "-0.005em" }}>
        {/* Sidebar */}
        <aside style={{ width: minimal ? 76 : 210, flexShrink: 0, background: t.side, borderRight: `1px solid ${t.line}`, padding: "22px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 22, paddingLeft: 6 }}>
            <span style={{ width: 28, height: 28, borderRadius: 9, background: `linear-gradient(135deg, ${accent}, color-mix(in srgb, ${accent} 40%, #fff))`, flexShrink: 0 }} />
            {!minimal && <b style={{ fontSize: 16, fontWeight: 650 }}>{d.brand}</b>}
          </div>
          {d.nav.map((n, i) => (
            <div key={n} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: 9, background: i === 0 ? `color-mix(in srgb, ${accent} 16%, transparent)` : undefined, color: i === 0 ? t.text : t.muted, fontWeight: i === 0 ? 600 : 500 }}>
              <i style={{ width: 16, height: 16, borderRadius: 5, border: `1.6px solid ${i === 0 ? accent : t.muted}`, opacity: i === 0 ? 1 : 0.7, flexShrink: 0 }} />
              {!minimal && n}
            </div>
          ))}
          {!minimal && (
            <div style={{ marginTop: "auto", ...panel, padding: 14, background: `linear-gradient(160deg, color-mix(in srgb, ${accent} 22%, ${t.panel}), ${t.panel})` }}>
              <b style={{ fontSize: 13 }}>Upgrade to Pro</b>
              <p style={{ ...label, fontSize: 12, margin: "6px 0 10px" }}>Unlock forecasts and unlimited seats.</p>
              <div style={{ height: 30, borderRadius: 8, background: accent, color: "#fff", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>Upgrade</div>
            </div>
          )}
        </aside>

        <main style={{ flex: 1, minWidth: 0, padding: "18px 24px", display: "flex", flexDirection: "column", gap: 16 }}>
          {/* Top bar */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div>
              <div style={{ fontSize: 22, fontWeight: 650, letterSpacing: "-0.02em" }}>{d.title}</div>
              <div style={label}>Welcome back — here’s what’s happening.</div>
            </div>
            <div style={{ marginLeft: "auto", height: 38, width: 230, borderRadius: 10, border: `1px solid ${t.line}`, background: t.panel, display: "flex", alignItems: "center", padding: "0 12px", ...label }}>⌕&nbsp; Search…<span style={{ marginLeft: "auto", fontSize: 11, border: `1px solid ${t.line}`, borderRadius: 5, padding: "1px 5px" }}>⌘K</span></div>
            <div style={{ height: 38, padding: "0 14px", borderRadius: 10, border: `1px solid ${t.line}`, background: t.panel, display: "flex", alignItems: "center", fontSize: 13 }}>Last 30 days ▾</div>
            <span style={{ width: 38, height: 38, borderRadius: "50%", background: `linear-gradient(135deg, #f9a8d4, ${accent})` }} />
          </div>

          {/* KPIs */}
          <div style={{ display: "grid", gridTemplateColumns: `repeat(${d.kpis.length}, 1fr)`, gap: 14 }}>
            {d.kpis.map(([name, v, delta], i) => {
              const down = delta.startsWith("-");
              return (
                <div key={name} style={panel}>
                  <div style={label}>{name}</div>
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginTop: 8 }}>
                    <div>
                      <div style={{ fontSize: 26, fontWeight: 650, letterSpacing: "-0.03em" }}>{v}</div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: down ? tone.bad : tone.ok }}>{delta}</span>
                    </div>
                    <Spark c={i === 0 ? accent : down ? tone.bad : tone.ok} up={!down} />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Charts */}
          <div style={{ display: "flex", gap: 14 }}>
            <div style={{ ...panel, flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 14 }}>
                <div><b style={{ fontSize: 15 }}>{d.chart.title}</b><div style={label}>{d.chart.sub}</div></div>
                <div style={{ display: "flex", gap: 6 }}>{["1W", "1M", "1Y"].map((p, i) => <span key={p} style={{ fontSize: 12, padding: "4px 9px", borderRadius: 7, background: i === 1 ? t.panel2 : undefined, color: i === 1 ? t.text : t.muted }}>{p}</span>)}</div>
              </div>
              {d.chart.type === "bars"
                ? <Bars data={d.chart.data} w={chartW} h={minimal ? 280 : 170} c={accent} animate={seen && animated} />
                : <Area id={kind} data={d.chart.data} data2={d.chart.data2} w={chartW} h={minimal ? 280 : 170} c={accent} c2={dark ? "#f472b6" : "#f97316"} animate={seen && animated} />}
            </div>
            {d.side && (
              <div style={{ ...panel, width: 320, flexShrink: 0 }}>
                <b style={{ fontSize: 15 }}>{d.side.title}</b>
                <div style={{ ...label, marginBottom: 16 }}>This month</div>
                {d.side.type === "donut" ? <Donut data={d.side.data} c={accent} t={t} animate={seen && animated} /> : <HBars data={d.side.data} c={accent} t={t} animate={seen && animated} />}
              </div>
            )}
          </div>

          {/* Table + activity */}
          {d.table && (
            <div style={{ display: "flex", gap: 14 }}>
              <div style={{ ...panel, flex: 1 }}>
                <b style={{ fontSize: 15 }}>{d.table.title}</b>
                <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr 0.8fr", marginTop: 12, fontSize: 13 }}>
                  {d.table.cols.map((c, i) => <span key={c} style={{ ...label, fontSize: 12, padding: "6px 0", borderBottom: `1px solid ${t.line}`, textAlign: i === 2 ? "right" : "left" }}>{c}</span>)}
                  {d.table.rows.map(([a, s, v]) => [
                    <span key={`${a}-a`} style={{ padding: "10px 0", borderBottom: `1px solid ${t.line}`, display: "flex", alignItems: "center", gap: 10, fontWeight: 500 }}>
                      <i style={{ width: 24, height: 24, borderRadius: 7, background: t.panel2, border: `1px solid ${t.line}` }} />{a}
                    </span>,
                    <span key={`${a}-s`} style={{ padding: "10px 0", borderBottom: `1px solid ${t.line}` }}>
                      <span style={{ fontSize: 12, fontWeight: 600, padding: "3px 9px", borderRadius: 99, color: tone[STATUS[s] || "info"], background: `color-mix(in srgb, ${tone[STATUS[s] || "info"]} 14%, transparent)` }}>{s}</span>
                    </span>,
                    <span key={`${a}-v`} style={{ padding: "10px 0", borderBottom: `1px solid ${t.line}`, textAlign: "right", fontWeight: 600 }}>{v}</span>,
                  ])}
                </div>
              </div>
              <div style={{ ...panel, width: 320, flexShrink: 0 }}>
                <b style={{ fontSize: 15 }}>Activity</b>
                <div style={{ display: "grid", gap: 14, marginTop: 14 }}>
                  {d.activity.map(([a, b, time], i) => (
                    <div key={a} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <span style={{ width: 30, height: 30, borderRadius: 9, flexShrink: 0, background: `color-mix(in srgb, ${i === 0 ? accent : tone.ok} 18%, transparent)`, display: "grid", placeItems: "center", color: i === 0 ? accent : tone.ok, fontSize: 13 }}>●</span>
                      <div style={{ flex: 1 }}><div style={{ fontWeight: 600, fontSize: 13 }}>{a}</div><div style={{ ...label, fontSize: 12 }}>{b}</div></div>
                      <span style={{ ...label, fontSize: 12 }}>{time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
