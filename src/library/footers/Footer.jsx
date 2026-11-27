import { useState } from "react";
import { HeroElement, useHeroRuntime } from "../../components/hero-studio/runtime/HeroRuntime.jsx";
import HeroText from "../../components/hero-studio/runtime/HeroText.jsx";
import HeroButton from "../../components/hero-studio/runtime/HeroButton.jsx";
import EditableText from "../../components/hero-studio/runtime/EditableText.jsx";
import { SectionShell, BrandLogo, Socials } from "../sections/shared/Shell.jsx";
import { useItems } from "../sections/shared/style.js";
import { css } from "../../utils/tokens.js";
import { useLinkProps } from "../../components/hero-studio/runtime/links.js";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const has = (rt, id) => rt.elementsById[id] && rt.elementsById[id].visible !== false && !rt.resolveEl(rt.elementsById[id]).hidden;

function LinkColumn({ id }) {
  const { elementsById, resolveEl, editor } = useHeroRuntime();
  const linkProps = useLinkProps();
  const p = resolveEl(elementsById[id]);
  return (
    <HeroElement id={id} style={{ minWidth: 0 }}>
      {p.heading && <EditableText id={id} k="heading" value={p.heading} as="h4" style={{ margin: "0 0 18px", fontSize: 13, fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--syn-text)" }} />}
      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: 12 }}>
        {(p.links || []).map((l, i) => <li key={i}><a {...linkProps(l.href, editor ? { onClick: (e) => e.preventDefault() } : {})} className="syn-foot-link">{l.label}</a></li>)}
      </ul>
    </HeroElement>
  );
}

function LinkRow({ id = "legal", style }) {
  const rt = useHeroRuntime();
  const linkProps = useLinkProps();
  if (!has(rt, id)) return null;
  const p = rt.resolveEl(rt.elementsById[id]);
  return (
    <HeroElement id={id} style={{ display: "flex", flexWrap: "wrap", gap: "10px 26px", ...style }}>
      {(p.links || []).map((l, i) => <a key={i} {...linkProps(l.href)} className="syn-foot-link" style={{ fontSize: 14 }}>{l.label}</a>)}
    </HeroElement>
  );
}

function SocialEl({ style }) {
  const rt = useHeroRuntime();
  if (!has(rt, "social")) return null;
  return <HeroElement id="social" style={{ color: "var(--syn-text)", ...style }}><Socials items={rt.resolveEl(rt.elementsById.social).items} size={17} /></HeroElement>;
}

function Payments() {
  const rt = useHeroRuntime();
  if (!has(rt, "payments")) return null;
  const p = rt.resolveEl(rt.elementsById.payments);
  return (
    <HeroElement id="payments" style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
      {p.label && <span style={{ fontSize: 13, color: "var(--syn-muted)", marginRight: 6 }}>{p.label}</span>}
      {(p.methods || []).map((m, i) => (
        <span key={i} style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: ".02em", padding: "5px 10px", borderRadius: 6, border: "1px solid var(--syn-border)", background: "var(--syn-background)", color: "var(--syn-text)" }}>{m.name}</span>
      ))}
    </HeroElement>
  );
}

// Newsletter signup: validates the email; only claims success when a signup endpoint actually accepted it.
function Newsletter({ inline = false, card = false }) {
  const { elementsById, resolveEl, editor, bp } = useHeroRuntime();
  const [status, setStatus] = useState(null);
  if (!elementsById.newsletter || elementsById.newsletter.visible === false) return null;
  const p = resolveEl(elementsById.newsletter);
  if (p.hidden) return null;
  const onSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = String(new FormData(form).get("email") || "").trim();
    if (!EMAIL.test(email)) return setStatus({ ok: false, msg: "Please enter a valid email address." });
    if (editor) return setStatus({ ok: true, msg: p.endpoint ? "Looks good! On the published page this posts to your signup endpoint." : "Looks good! Add a signup endpoint in the inspector to collect subscribers." });
    if (!p.endpoint) return setStatus({ ok: false, msg: "Newsletter signup isn't available yet — please check back soon." });
    setStatus({ sending: true });
    try {
      const res = await fetch(p.endpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setStatus({ ok: true, msg: p.successMessage });
    } catch {
      setStatus({ ok: false, msg: "Sorry, that didn't work. Please try again later." });
    }
  };
  const stack = !inline || bp === "mobile";
  return (
    <HeroElement id="newsletter" style={{
      display: "grid", gap: 16, alignItems: "center", gridTemplateColumns: stack ? "1fr" : "minmax(0, 1fr) minmax(0, 1fr)",
      ...(card ? { padding: 26, borderRadius: 20, background: "color-mix(in srgb, var(--syn-text) 6%, transparent)", border: "1px solid var(--syn-border)" } : {}),
    }}>
      <div style={{ display: "grid", gap: 6 }}>
        <EditableText id="newsletter" k="heading" value={p.heading} as="h4" style={{ margin: 0, fontFamily: "var(--syn-font-heading)", fontWeight: "var(--syn-weight-heading)", fontSize: inline ? 24 : 17, color: "var(--syn-text)" }} />
        <EditableText id="newsletter" k="text" value={p.text} as="p" multiline style={{ margin: 0, fontSize: 14.5, color: "var(--syn-muted)" }} />
      </div>
      <form noValidate onSubmit={onSubmit} style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: bp === "mobile" ? "wrap" : "nowrap" }}>
          <input name="email" type="email" required aria-label="Email address" placeholder={p.placeholder} className="syn-field"
            style={{ flex: "1 1 180px", minWidth: 0, height: 46, padding: "0 14px", borderRadius: "var(--syn-input-radius)", border: "1px solid var(--syn-input-border)", background: "var(--syn-input-bg)", color: "var(--syn-input-text)", fontSize: 15 }} />
          <button type="submit" className="syn-plan-cta" disabled={status?.sending} onClick={editor ? (e) => e.currentTarget.form?.requestSubmit() : undefined}
            style={{ height: 46, padding: "0 20px", borderRadius: "var(--syn-btn-radius)", border: 0, background: "var(--syn-primary)", color: "var(--syn-buttonText)", font: "inherit", fontWeight: 600, fontSize: 15, cursor: "pointer", flex: bp === "mobile" ? "1 1 100%" : "0 0 auto" }}>
            {status?.sending ? "…" : <EditableText id="newsletter" k="buttonText" value={p.buttonText} />}
          </button>
        </div>
        {status?.msg && <span role="status" style={{ fontSize: 13, color: status.ok ? "#22c55e" : "#f87171" }}>{status.msg}</span>}
      </form>
    </HeroElement>
  );
}

const Divider = ({ gap = 48 }) => <div aria-hidden style={{ height: 1, background: "var(--syn-border)", margin: `${gap}px 0 28px` }} />;

export default function Footer() {
  const rt = useHeroRuntime();
  const { sectionProps: sp, bp } = rt;
  const columns = useItems("column");
  const mobile = bp === "mobile", desktop = bp === "desktop";
  const center = sp.align === "center";
  const metaRow = (extra) => (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: center ? "center" : "space-between", gap: "14px 24px", textAlign: center ? "center" : "left" }}>
      {has(rt, "copyright") && <HeroText id="copyright" />}
      {extra}
    </div>
  );
  const cols = (n) => <div style={{ display: "grid", gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, gap: sp.columnGap }}>{columns.map((c) => <LinkColumn key={c.id} id={c.id} />)}</div>;

  let body;
  switch (sp.layout) {
    case "minimal":
      body = (
        <>
          <div style={{ display: "flex", flexDirection: mobile ? "column" : "row", alignItems: mobile || center ? "center" : "center", justifyContent: "space-between", gap: 28 }}>
            <BrandLogo />
            <LinkRow style={{ justifyContent: "center" }} />
            <SocialEl />
          </div>
          <Divider gap={36} />
          {metaRow()}
        </>
      );
      break;
    case "saas":
      body = (
        <>
          <div style={{ display: "grid", gridTemplateColumns: desktop ? "1.1fr 2fr 1.4fr" : "1fr", gap: desktop ? 56 : 40 }}>
            <div style={{ display: "grid", gap: 16, alignContent: "start" }}>
              <BrandLogo />
              {has(rt, "description") && <HeroText id="description" as="p" />}
              <SocialEl style={{ marginTop: 6 }} />
            </div>
            {cols(mobile ? 2 : Math.max(1, columns.length))}
            <Newsletter card />
          </div>
          <Divider gap={56} />
          {metaRow(<LinkRow />)}
        </>
      );
      break;
    case "ecommerce":
      body = (
        <>
          <Newsletter inline />
          <Divider gap={44} />
          <div style={{ display: "grid", gridTemplateColumns: desktop ? "1fr 4fr" : "1fr", gap: desktop ? 56 : 36 }}>
            <div style={{ display: "grid", gap: 18, alignContent: "start" }}><BrandLogo /><SocialEl /></div>
            {cols(mobile ? 2 : bp === "tablet" ? 2 : Math.max(1, columns.length))}
          </div>
          <Divider gap={48} />
          {metaRow(<Payments />)}
        </>
      );
      break;
    case "creative":
      body = (
        <>
          <div style={{ display: "grid", gridTemplateColumns: desktop ? "minmax(0, 1.6fr) minmax(0, 1fr)" : "1fr", gap: desktop ? 64 : 40, alignItems: "end" }}>
            <div style={{ display: "grid", gap: 28 }}>
              {has(rt, "statement") && <HeroText id="statement" as="h2" />}
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 20 }}>
                {has(rt, "cta") && <HeroButton id="cta" />}
                {has(rt, "contact") && <HeroText id="contact" />}
              </div>
            </div>
            <div style={{ display: "grid", gap: 28 }}>
              {cols(2)}
              <SocialEl />
            </div>
          </div>
          <div style={{ marginTop: mobile ? 48 : 72, overflow: "hidden", lineHeight: 0.8 }}><BrandLogo /></div>
          <Divider gap={20} />
          {metaRow(has(rt, "meta-right") && <HeroText id="meta-right" />)}
        </>
      );
      break;
    default: // columns
      body = (
        <>
          <div style={{ display: "grid", gridTemplateColumns: desktop ? "1.3fr 2fr" : "1fr", gap: desktop ? 80 : 40 }}>
            <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
              <BrandLogo />
              {has(rt, "description") && <HeroText id="description" as="p" />}
              <SocialEl style={{ marginTop: 4 }} />
            </div>
            {cols(mobile ? 2 : Math.max(1, columns.length))}
          </div>
          <Divider gap={56} />
          {metaRow(<LinkRow />)}
        </>
      );
  }

  // Footers are often dark: re-point the text tokens inside the footer so linked elements stay readable.
  const scope = (name, value) => (value && value !== `$${name}` ? { [`--syn-${name}`]: css(value) } : {});
  return (
    <SectionShell as="footer" style={{ ...scope("text", sp.textColor), ...scope("muted", sp.mutedColor), ...scope("border", sp.lineColor), "--foot-hover": css(sp.linkHover, "var(--syn-primary)"), textAlign: center ? "center" : undefined }}>
      {body}
    </SectionShell>
  );
}
