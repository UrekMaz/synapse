/*
 * Smart links. A link prop holds either a legacy string (treated as a custom URL) or a serializable object:
 *   { type: "section", sectionId, pageId?, scroll? }        same page when pageId is empty
 *   { type: "page", pageId, sectionId? }                     another page (optionally a section on it)
 *   { type: "external", url, newTab }   { type: "email", email, subject }   { type: "phone", phone }
 *   { type: "file", url }   { type: "custom", url, newTab }   { type: "none" }
 * Sections are referenced by their stable id; the anchor shown in URLs is resolved at render time,
 * so renaming a section or changing its anchor never breaks links.
 */
export const LINK_TYPES = ["section", "page", "external", "email", "phone", "file", "custom", "none"];
export const LINK_KEYS = ["href", "ctaHref", "promoHref", "url", "link"];

export const isLinkObject = (v) => v && typeof v === "object" && LINK_TYPES.includes(v.type);
export const toLink = (v) => (isLinkObject(v) ? v : typeof v === "string" && v ? { type: "custom", url: v } : { type: "none" });

export const slugify = (s) => String(s || "").toLowerCase().normalize("NFKD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 48);
export const anchorOf = (section) => section?.anchor || section?.id;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const digits = (p) => String(p || "").replace(/[^\d+]/g, "");

/* ---------- Site context ---------- */
// Lightweight summaries of every page, used by the resolver, validator, link picker and runtime.
export function siteSummary(page, pages = [], nameOf = (s) => s.type) {
  return [page, ...pages].filter(Boolean).map((p) => ({
    id: p.id, name: p.name, slug: p.slug ?? "", home: !!p.home,
    sections: (p.sections || []).map((s, i) => ({ id: s.id, anchor: anchorOf(s), name: s.name || nameOf(s), type: s.type, kind: s.kind, index: i })),
  }));
}

export const pageUrl = (p, basePath = "/preview") => (!p || p.home || !p.slug ? basePath : `${basePath}/${p.slug}`);

function findSection(site, sectionId, pageId) {
  for (const p of site) {
    if (pageId && p.id !== pageId) continue;
    const s = p.sections.find((x) => x.id === sectionId);
    if (s) return { page: p, section: s };
  }
  return null;
}

/* ---------- Resolve to an href ---------- */
export function resolveHref(value, ctx = {}) {
  const l = toLink(value);
  const site = ctx.site || [];
  const current = ctx.currentPageId;
  const base = ctx.basePath || "/preview";
  switch (l.type) {
    case "section": {
      const hit = findSection(site, l.sectionId, l.pageId || undefined);
      if (!hit) return "#";
      return hit.page.id === current ? `#${hit.section.anchor}` : `${pageUrl(hit.page, base)}#${hit.section.anchor}`;
    }
    case "page": {
      const p = site.find((x) => x.id === l.pageId);
      if (!p) return "#";
      const s = l.sectionId && p.sections.find((x) => x.id === l.sectionId);
      return `${pageUrl(p, base)}${s ? `#${s.anchor}` : ""}`;
    }
    case "external": return l.url ? (/^[a-z][a-z0-9+.-]*:/i.test(l.url) ? l.url : `https://${l.url}`) : "#";
    case "email": return l.email ? `mailto:${l.email}${l.subject ? `?subject=${encodeURIComponent(l.subject)}` : ""}` : "#";
    case "phone": return l.phone ? `tel:${digits(l.phone)}` : "#";
    case "file": case "custom": return siteRelative(l.url, site, base) || l.url || "#";
    default: return "#";
  }
}

// "/" or "/about#team" in a custom link means this website's own pages, wherever it is hosted (/preview, /s/my-site…).
function siteRelative(url, site, base) {
  const m = /^\/(?!\/)([^#?]*)(#.*)?$/.exec(url || "");
  if (!m) return null;
  const slug = m[1].replace(/\/+$/, "");
  const page = slug ? site.find((p) => p.slug === slug) : site.find((p) => p.home) || site[0];
  return page ? `${pageUrl(page, base)}${m[2] || ""}` : null;
}

/* ---------- Validation ---------- */
// level: "ok" | "empty" (not connected yet) | "warn" (works but suspicious) | "error" (broken)
export function validateLink(value, ctx = {}) {
  const l = toLink(value);
  const site = ctx.site || [];
  const current = site.find((p) => p.id === ctx.currentPageId);
  switch (l.type) {
    case "none": return { level: "empty", message: "Not connected to a destination yet." };
    case "section": {
      if (!l.sectionId) return { level: "empty", message: "Choose a section." };
      const hit = findSection(site, l.sectionId, l.pageId || undefined);
      return hit ? { level: "ok", message: `→ ${hit.section.name}${hit.page.id !== ctx.currentPageId ? ` on “${hit.page.name}”` : ""}` } : { level: "error", message: "The linked section was deleted." };
    }
    case "page": {
      if (!l.pageId) return { level: "empty", message: "Choose a page." };
      const p = site.find((x) => x.id === l.pageId);
      if (!p) return { level: "error", message: "The linked page was deleted." };
      if (l.sectionId && !p.sections.some((s) => s.id === l.sectionId)) return { level: "error", message: `The linked section on “${p.name}” was deleted.` };
      return { level: "ok", message: `→ ${p.name}` };
    }
    case "external": {
      if (!l.url) return { level: "empty", message: "Enter a website address." };
      try {
        const u = new URL(/^[a-z][a-z0-9+.-]*:/i.test(l.url) ? l.url : `https://${l.url}`);
        return /^https?:$/.test(u.protocol) && u.hostname.includes(".") ? { level: "ok", message: `→ ${u.hostname}` } : { level: "error", message: "That doesn't look like a valid web address." };
      } catch { return { level: "error", message: "That doesn't look like a valid web address." }; }
    }
    case "email": return !l.email ? { level: "empty", message: "Enter an email address." } : EMAIL.test(l.email) ? { level: "ok", message: `→ ${l.email}` } : { level: "error", message: "Invalid email address." };
    case "phone": return !l.phone ? { level: "empty", message: "Enter a phone number." } : digits(l.phone).replace("+", "").length >= 6 ? { level: "ok", message: `→ ${l.phone}` } : { level: "error", message: "Invalid phone number." };
    case "file": return l.url ? { level: "ok", message: "File download" } : { level: "empty", message: "Enter the file URL." };
    default: {
      const url = l.url || "";
      if (!url || url === "#") return { level: "empty", message: "Not connected to a destination yet." };
      if (url.startsWith("#")) {
        const ok = current?.sections.some((s) => s.anchor === url.slice(1));
        // Starter content ships with placeholder anchors (#work, #service-1…): treat them as "not connected yet".
        return ok ? { level: "ok", message: "Anchor on this page" } : { level: "empty", message: `Placeholder link (${url}) — choose a destination.` };
      }
      return { level: "ok", message: url };
    }
  }
}

/* ---------- Walking every link on the site ---------- */
// Calls visit(value, { get label, path, set }) for every link-like prop, including inside list items.
export function walkLinks(sections, visit) {
  sections.forEach((section) => {
    (section.elements || []).forEach((el) => {
      const walk = (obj, path, label) => {
        Object.entries(obj || {}).forEach(([k, v]) => {
          if (Array.isArray(v)) v.forEach((item, i) => item && typeof item === "object" && !isLinkObject(item) && walk(item, [...path, k, i], item.label || item.text || item.heading || item.network || label));
          else if (LINK_KEYS.includes(k) && (typeof v === "string" || isLinkObject(v))) {
            visit(v, { section, element: el, path: [...path, k], label, set: (nv) => { obj[k] = nv; } });
          }
        });
      };
      walk(el.props, ["props"], el.props?.label || el.props?.title || el.props?.name || el.props?.ctaText || el.props?.linkLabel || el.props?.text || el.label);
      Object.entries(el.responsive || {}).forEach(([bp, o]) => walk(o, ["responsive", bp], el.label));
    });
  });
}

export const refersTo = (v, sectionId) => isLinkObject(v) && v.sectionId === sectionId;

/* ---------- Smart auto-connect ---------- */
const SYNONYMS = {
  about: ["about", "about us", "our story", "story", "studio", "who we are", "company"],
  services: ["services", "what we do", "offer", "solutions"],
  features: ["features", "product", "platform", "why us"],
  portfolio: ["work", "portfolio", "projects", "case studies", "our work", "explore our work", "view work"],
  pricing: ["pricing", "plans", "price"],
  contact: ["contact", "contact us", "get in touch", "let's talk", "talk to us", "start a project", "book a call"],
  team: ["team", "people", "our team"],
  faq: ["faq", "help", "questions"],
  testimonials: ["testimonials", "reviews", "customers", "love"],
  stats: ["results", "numbers"],
  logos: ["clients", "customers"],
};
// Best section on the page for a link label, by section name first, then by section type keywords.
export function guessSection(label, sections) {
  const l = String(label || "").toLowerCase().trim();
  if (!l) return null;
  const byName = sections.find((s) => String(s.name || "").toLowerCase() === l);
  if (byName) return byName;
  for (const [type, words] of Object.entries(SYNONYMS)) {
    if (words.some((w) => l === w || l.startsWith(`${w} `) || l.endsWith(` ${w}`))) {
      const hit = sections.find((s) => s.type === type);
      if (hit) return hit;
    }
  }
  return null;
}
// Unconnected = empty, "#", or a placeholder "#anchor" that matches nothing on the page.
export const isUnconnected = (v, anchors) => {
  if (isLinkObject(v)) return v.type === "none";
  return !v || v === "#" || (v.startsWith("#") && !anchors.includes(v.slice(1)));
};
