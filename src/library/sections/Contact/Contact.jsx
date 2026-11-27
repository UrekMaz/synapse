import { useState } from "react";
import { HeroElement, useHeroRuntime } from "../../../components/hero-studio/runtime/HeroRuntime.jsx";
import EditableText from "../../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, SectionHeader, Socials } from "../shared/Shell.jsx";
import { useItems } from "../shared/style.js";
import { Icon } from "../shared/icons.jsx";
import { css, px } from "../../../utils/tokens.js";
import { useLinkProps } from "../../../components/hero-studio/runtime/links.js";
import { toLink } from "../../../utils/links.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE = /^[+()\-.\s\d]{6,}$/;

function fieldStyle(sp, kind) {
  // Inputs follow the theme's form tokens (background, text, border, radius, focus, placeholder).
  const base = { padding: kind === "textarea" ? "14px 16px" : "0 16px", height: kind === "textarea" ? undefined : 50, minHeight: kind === "textarea" ? 140 : undefined, borderRadius: px(sp.fieldRadius, "var(--syn-input-radius)"), color: "var(--syn-input-text)", fontSize: 15, resize: "vertical" };
  if (sp.fieldStyle === "filled") return { ...base, background: "var(--syn-surface)", border: "1px solid transparent" };
  if (sp.fieldStyle === "underline") return { ...base, background: "transparent", border: 0, borderBottom: "1.5px solid var(--syn-input-border)", borderRadius: 0, paddingInline: 0 };
  return { ...base, background: "var(--syn-input-bg)", border: "1px solid var(--syn-input-border)" };
}

function Field({ id, sp, error }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const p = resolveEl(elementsById[id]);
  const fid = `f-${id}`;
  const common = { id: fid, name: p.name || id, required: p.required, placeholder: p.placeholder, className: "syn-field", "aria-invalid": error ? "true" : undefined, "aria-describedby": error ? `${fid}-err` : undefined, style: fieldStyle(sp, p.kind) };
  return (
    <HeroElement id={id} wrapperStyle={{ gridColumn: p.width === "half" ? "span 1" : "1 / -1", minWidth: 0 }} style={{ display: "grid", gap: 8 }}>
      <label htmlFor={fid} style={{ fontSize: 14, fontWeight: 600, color: "var(--syn-text)" }}>
        <EditableText id={id} k="label" value={p.label} />{p.required && <span aria-hidden style={{ color: "var(--syn-primary)" }}> *</span>}
      </label>
      {p.kind === "textarea" ? <textarea {...common} rows={5} />
        : p.kind === "select" ? (
          <select {...common} defaultValue="">
            <option value="" disabled>Select…</option>
            {(p.options || []).map((o, i) => <option key={i} value={o.label}>{o.label}</option>)}
          </select>
        ) : <input {...common} type={p.kind === "email" ? "email" : p.kind === "tel" ? "tel" : "text"} autoComplete={p.kind === "email" ? "email" : p.name === "name" ? "name" : undefined} />}
      {error && <span id={`${fid}-err`} role="alert" style={{ fontSize: 13, color: "#e5484d" }}>{error}</span>}
    </HeroElement>
  );
}

// Validation + submission. Sends only when an endpoint is configured; otherwise hands off to the visitor's email app.
function ContactForm({ sp, card = true }) {
  const { elementsById, resolveEl, editor, bp } = useHeroRuntime();
  const fields = useItems("field");
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState(null);
  const submit = elementsById.submit ? resolveEl(elementsById.submit) : { text: "Send" };

  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const next = {};
    fields.forEach((f) => {
      const p = resolveEl(elementsById[f.id]);
      const v = String(data.get(p.name || f.id) || "").trim();
      if (p.required && !v) next[f.id] = `${p.label || "This field"} is required.`;
      else if (v && p.kind === "email" && !EMAIL.test(v)) next[f.id] = "Please enter a valid email address.";
      else if (v && p.kind === "tel" && !PHONE.test(v)) next[f.id] = "Please enter a valid phone number.";
    });
    setErrors(next);
    if (Object.keys(next).length) { setStatus(null); return; }

    if (editor) {
      setStatus({ ok: true, msg: sp.endpoint ? "Looks good! On the published page this form posts to your endpoint." : sp.recipient ? `Looks good! On the published page this opens the visitor's email app addressed to ${sp.recipient}.` : "Looks good! Add a form endpoint or fallback email to receive messages." });
      return;
    }
    if (sp.endpoint) {
      setStatus({ sending: true });
      try {
        const res = await fetch(sp.endpoint, { method: "POST", body: data, headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error(String(res.status));
        form.reset();
        setStatus({ ok: true, msg: sp.successMessage });
      } catch {
        setStatus({ ok: false, msg: `Sorry, your message couldn't be sent. ${sp.recipient ? `Please email ${sp.recipient} directly.` : "Please try again later."}` });
      }
    } else if (sp.recipient) {
      const body = [...data.entries()].map(([k, v]) => `${k}: ${v}`).join("\n");
      window.location.href = `mailto:${sp.recipient}?subject=${encodeURIComponent(sp.subject || "Website enquiry")}&body=${encodeURIComponent(body)}`;
      setStatus({ ok: true, msg: "Your email app should open with your message ready to send." });
    } else {
      setStatus({ ok: false, msg: "This form isn't connected yet." });
    }
  };

  return (
    <form noValidate onSubmit={onSubmit} style={{ display: "grid", gridTemplateColumns: bp === "mobile" ? "1fr" : "1fr 1fr", gap: 18, ...(card ? { padding: bp === "mobile" ? 22 : 36, borderRadius: 24, background: "var(--syn-background)", border: "1px solid var(--syn-border)", boxShadow: "0 40px 80px -50px rgba(15,23,42,.35)" } : {}) }}>
      {fields.map((f) => <Field key={f.id} id={f.id} sp={sp} error={errors[f.id]} />)}
      {elementsById.submit && (
        <HeroElement id="submit" wrapperStyle={{ gridColumn: "1 / -1" }} editKey="text">
          {/* The editor cancels default clicks (so links don't navigate); submit explicitly so validation can be tried on the canvas. */}
          <button type="submit" disabled={status?.sending} className="syn-plan-cta" onClick={editor ? (e) => e.currentTarget.form?.requestSubmit() : undefined}
            style={{ width: submit.fullWidth || bp === "mobile" ? "100%" : undefined, display: "inline-flex", justifyContent: "center", alignItems: "center", gap: 8, padding: "var(--syn-btn-py) calc(var(--syn-btn-px) * 1.3)", borderRadius: "var(--syn-btn-radius)", border: 0, background: "var(--syn-primary)", color: "var(--syn-buttonText)", font: "inherit", fontWeight: "var(--syn-btn-weight)", fontSize: "var(--syn-btn-size)", cursor: "pointer", opacity: status?.sending ? 0.7 : 1 }}>
            {status?.sending ? "Sending…" : <EditableText id="submit" k="text" value={submit.text} />}
            {!status?.sending && <Icon name="send" size={16} />}
          </button>
        </HeroElement>
      )}
      {status?.msg && (
        <p role="status" style={{ gridColumn: "1 / -1", margin: 0, padding: "12px 16px", borderRadius: 12, fontSize: 14, background: status.ok ? "color-mix(in srgb, #16a34a 10%, transparent)" : "color-mix(in srgb, #e5484d 10%, transparent)", color: status.ok ? "#15803d" : "#c62828" }}>{status.msg}</p>
      )}
    </form>
  );
}

function InfoList({ color, inline = false }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  const linkProps = useLinkProps();
  const items = useItems("info");
  return (
    <div style={{ display: inline ? "flex" : "grid", flexWrap: "wrap", justifyContent: "center", gap: inline ? "18px 36px" : 22 }}>
      {items.map((i) => {
        const p = resolveEl(elementsById[i.id]);
        const linked = toLink(p.href).type !== "none";
        const Tag = linked ? "a" : "div";
        return (
          <HeroElement key={i.id} id={i.id} as={Tag} htmlProps={linked ? linkProps(p.href) : undefined} style={{ display: "flex", gap: 14, alignItems: "flex-start", color: color || "var(--syn-text)", textDecoration: "none" }}>
            <span style={{ display: "grid", placeItems: "center", width: 42, height: 42, borderRadius: 12, flexShrink: 0, background: "color-mix(in srgb, currentColor 9%, transparent)" }}><Icon name={p.icon} size={19} /></span>
            <span style={{ display: "grid", gap: 2 }}>
              <EditableText id={i.id} k="label" value={p.label} style={{ fontSize: 13, opacity: 0.65 }} />
              <EditableText id={i.id} k="value" value={p.value} style={{ fontWeight: 600, fontSize: 15.5 }} />
            </span>
          </HeroElement>
        );
      })}
    </div>
  );
}

function SocialRow({ color, style }) {
  const { elementsById, resolveEl } = useHeroRuntime();
  if (!elementsById.social) return null;
  const p = resolveEl(elementsById.social);
  return <HeroElement id="social" style={{ color: color || "var(--syn-text)", ...style }}><Socials items={p.items} /></HeroElement>;
}

function MapBlock() {
  const { elementsById, resolveEl, editor } = useHeroRuntime();
  if (!elementsById.map) return null;
  const p = resolveEl(elementsById.map);
  const safe = /^https:\/\//.test(p.embedUrl || "");
  return (
    <HeroElement id="map" style={{ position: "relative", height: p.height, borderRadius: 24, overflow: "hidden", background: "var(--syn-surface)", border: "1px solid var(--syn-border)" }}>
      {safe ? (
        <iframe title={p.address || "Map"} src={p.embedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" style={{ width: "100%", height: "100%", border: 0, pointerEvents: editor ? "none" : "auto" }} />
      ) : (
        <>
          {/* Styled placeholder until an embed URL is configured. */}
          <svg width="100%" height="100%" aria-hidden style={{ position: "absolute", inset: 0 }}>
            <defs><pattern id="syn-map-grid" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M64 0H0V64" fill="none" stroke="var(--syn-border)" strokeWidth="1" /></pattern></defs>
            <rect width="100%" height="100%" fill="url(#syn-map-grid)" />
            <path d="M-20 340 C 180 300, 260 420, 460 360 S 760 240, 980 300" fill="none" stroke="color-mix(in srgb, var(--syn-primary) 30%, transparent)" strokeWidth="14" strokeLinecap="round" />
            <path d="M260 -20 C 300 160, 220 300, 300 560" fill="none" stroke="var(--syn-border)" strokeWidth="18" strokeLinecap="round" />
            <path d="M-20 140 L 980 220" fill="none" stroke="var(--syn-border)" strokeWidth="10" />
            <circle cx="62%" cy="44%" r="90" fill="color-mix(in srgb, var(--syn-primary) 9%, transparent)" />
          </svg>
          <div style={{ position: "absolute", left: "62%", top: "44%", transform: "translate(-50%, -100%)", display: "grid", justifyItems: "center", gap: 10 }}>
            <span style={{ padding: "8px 14px", borderRadius: 12, background: "var(--syn-background)", boxShadow: "0 12px 30px -12px rgba(15,23,42,.35)", fontSize: 13.5, fontWeight: 600, whiteSpace: "nowrap", color: "var(--syn-text)" }}>
              <EditableText id="map" k="address" value={p.address} />
            </span>
            <span style={{ color: "var(--syn-primary)" }}><Icon name="pin" size={34} strokeWidth={2} /></span>
          </div>
          {editor && <span style={{ position: "absolute", left: 14, bottom: 12, fontSize: 12, color: "var(--syn-muted)" }}>Add a map embed URL in the inspector to show a live map.</span>}
        </>
      )}
    </HeroElement>
  );
}

export default function Contact() {
  const { sectionProps: sp, bp } = useHeroRuntime();
  const desktop = bp === "desktop";

  if (sp.variant === "centered") {
    return (
      <SectionShell innerStyle={{ maxWidth: 760 }}>
        <SectionHeader align="center" marginBottom={44} />
        <ContactForm sp={sp} />
        <div style={{ marginTop: 44 }}><InfoList inline /></div>
        <SocialRow style={{ display: "flex", justifyContent: "center", marginTop: 26 }} />
      </SectionShell>
    );
  }
  if (sp.variant === "map") {
    return (
      <SectionShell>
        <div style={{ display: "grid", gridTemplateColumns: desktop ? "minmax(0, 1fr) minmax(0, 1fr)" : "1fr", gap: desktop ? 64 : 40, alignItems: "start" }}>
          <div>
            <SectionHeader align="left" marginBottom={36} />
            <ContactForm sp={sp} card={false} />
          </div>
          <div style={{ display: "grid", gap: 28 }}>
            <MapBlock />
            <InfoList />
          </div>
        </div>
      </SectionShell>
    );
  }
  const panelText = css(sp.panelText, "#fff");
  return (
    <SectionShell>
      <div style={{ display: "grid", gridTemplateColumns: desktop ? "minmax(0, 0.85fr) minmax(0, 1.15fr)" : "1fr", gap: desktop ? 40 : 28, alignItems: "stretch" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 36, padding: bp === "mobile" ? 26 : 44, borderRadius: 28, background: css(sp.panelBg, "var(--syn-secondary)"), color: panelText, "--syn-text": panelText, "--syn-muted": `color-mix(in srgb, ${panelText} 70%, transparent)` }}>
          <SectionHeader align="left" marginBottom={0} />
          <InfoList color={panelText} />
          <SocialRow color={panelText} style={{ marginTop: "auto" }} />
        </div>
        <ContactForm sp={sp} />
      </div>
    </SectionShell>
  );
}
