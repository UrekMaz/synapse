import { useEffect, useState } from "react";

const chip = (active) =>
  `h-9 rounded-lg border text-xs font-medium transition ${
    active
      ? "bg-ed-accent/20 border-ed-accent text-white"
      : "bg-ed-raised border-ed-border text-ed-muted hover:text-white hover:bg-white/10"
  }`;

export default function Choice({ label, options, value, onChange, cols, allowCustom = false, min = 0, max = 9999, unit = "px" }) {
  const opts = options.map((o) => (typeof o === "object" ? o : { value: o, label: `${o}${unit}` }));
  const isPreset = opts.some((o) => o.value === value);
  const [customOpen, setCustomOpen] = useState(false);
  const showCustom = allowCustom && (customOpen || !isPreset);
  const [text, setText] = useState(String(value));
  useEffect(() => setText(String(value)), [value]);

  const commit = () => {
    const n = Math.round(Number(text));
    if (Number.isFinite(n) && text !== "") onChange(Math.min(max, Math.max(min, n)));
    else setText(String(value));
  };

  return (
    <div>
      {label && <div className="label mb-1.5">{label}</div>}
      <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${cols ?? opts.length + (allowCustom ? 1 : 0)}, minmax(0, 1fr))` }}>
        {opts.map((o) => (
          <button key={o.value} className={chip(!showCustom && o.value === value)}
                  onClick={() => { setCustomOpen(false); onChange(o.value); }}>
            {o.label}
          </button>
        ))}
        {allowCustom && <button className={chip(showCustom)} onClick={() => setCustomOpen(true)}>Custom</button>}
      </div>
      {showCustom && (
        <div className="mt-2 flex items-center gap-2">
          <input className="field" inputMode="numeric" value={text}
                 onChange={(e) => setText(e.target.value.replace(/\D/g, ""))}
                 onBlur={commit} onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()} />
          <span className="text-xs text-ed-muted">{unit}</span>
        </div>
      )}
    </div>
  );
}