import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function IconButton({ icon: Icon, active, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`grid place-items-center h-9 w-9 rounded-xl border border-ed-border transition
        ${active ? "bg-ed-accent/20 border-ed-accent text-white" : "bg-ed-raised text-ed-muted hover:text-white hover:bg-white/10"}
        ${className}`}
    >
      <Icon size={16} />
    </button>
  );
}

export function Pill({ children, active, className = "", ...props }) {
  return (
    <button
      {...props}
      className={`px-3.5 h-9 rounded-xl border text-sm font-medium transition
        ${active ? "bg-ed-accent/20 border-ed-accent text-white" : "bg-ed-raised border-ed-border text-ed-text hover:bg-white/10"}
        ${className}`}
    >
      {children}
    </button>
  );
}

export function Tag({ children }) {
  return (
    <span className="px-2 py-0.5 rounded-full border border-ed-border bg-ed-raised text-[10px] font-semibold tracking-widest text-ed-muted uppercase">
      {children}
    </span>
  );
}

export function Segmented({ options, value, onChange }) {
  return (
    <div className="grid p-1 gap-1 rounded-2xl bg-ed-bg/60 border border-ed-border"
         style={{ gridTemplateColumns: `repeat(${options.length}, 1fr)` }}>
      {options.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex items-center justify-center gap-2 h-10 rounded-xl text-sm transition
            ${value === id ? "bg-ed-accent/30 text-white shadow-inner" : "text-ed-muted hover:text-white"}`}
        >
          {Icon && <Icon size={14} />} {label}
        </button>
      ))}
    </div>
  );
}

export function Collapsible({ title, icon: Icon, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <section className="border-b border-ed-border">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-2 px-4 py-3">
        {Icon && <Icon size={15} className="text-ed-accent" />}
        <span className="label flex-1 text-left text-ed-text">{title}</span>
        <ChevronDown size={14} className={`text-ed-muted transition ${open ? "" : "-rotate-90"}`} />
      </button>
      {open && <div className="px-4 pb-4 space-y-3">{children}</div>}
    </section>
  );
}

export function Switch({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full border transition ${checked ? "bg-ed-accent border-ed-accent" : "bg-ed-raised border-ed-border"}`}
    >
      <span className={`absolute top-0.5 h-3.5 w-3.5 rounded-full bg-white transition-all ${checked ? "left-[18px]" : "left-0.5"}`} />
    </button>
  );
}