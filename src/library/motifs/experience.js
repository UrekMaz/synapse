/*
 * Theme "experience" — the mood layer of a theme (motifs, materials, section styles, motion, sound).
 * Everything here is plain serializable data: no functions, no audio objects. Renderers and the sound
 * engine interpret it at runtime. Themes without an experience behave exactly as before.
 */
export const MATERIALS = [
  { value: "none", label: "Theme default" }, { value: "paper", label: "Paper texture" }, { value: "polaroid", label: "Polaroid / photo print" },
  { value: "metal", label: "Brushed metal" }, { value: "scales", label: "Serpent scales" }, { value: "glass", label: "Frosted glass" },
];
export const NAV_STYLES = [{ value: "default", label: "Theme default" }, { value: "glass", label: "Frosted glass" }, { value: "ink", label: "Ink rule" }];
export const HEADLINE_STYLES = [
  { value: "default", label: "Theme default" }, { value: "newspaper", label: "Newspaper headline" }, { value: "handwritten", label: "Handwritten" },
  { value: "glow", label: "Soft glow" }, { value: "underline", label: "Wavy underline" },
];
export const IMAGE_STYLES = [
  { value: "none", label: "Original" }, { value: "vintage", label: "Vintage film" }, { value: "mono", label: "High-contrast mono" },
  { value: "dreamy", label: "Dreamy pastel" }, { value: "night", label: "Night tint" },
];
export const CTA_STYLES = [{ value: "default", label: "Theme default" }, { value: "glow", label: "Glow" }, { value: "stamp", label: "Stamped" }, { value: "pill", label: "Pill" }];
export const TRANSITIONS = [{ value: "none", label: "None" }, { value: "fade", label: "Fade" }, { value: "rise", label: "Rise" }, { value: "blur", label: "Blur in" }, { value: "curtain", label: "Curtain wipe" }];
export const CARD_HOVERS = [{ value: "default", label: "Theme default" }, { value: "lift", label: "Lift" }, { value: "tilt", label: "Polaroid tilt" }, { value: "glow", label: "Glow" }, { value: "sheen", label: "Metallic sheen" }];
export const IMAGE_HOVERS = [{ value: "none", label: "None" }, { value: "zoom", label: "Slow zoom" }, { value: "color", label: "Color on hover" }];

export const DEFAULT_EXPERIENCE = {
  mood: [], tagline: "",
  decorations: true,
  motifs: [],
  materials: { card: "none" },
  styles: { nav: "default", headline: "default", image: "none", cta: "default" },
  motion: { enabled: true, intensity: 1, transition: "none", cardHover: "default", imageHover: "none", choreography: "" },
  sound: { enabled: false, track: "", uploadUrl: "", uploadName: "", volume: 0.5, loop: true, fadeIn: 2, fadeOut: 1.5, sfx: false, recommended: [] },
};

export function resolveExperience(exp) {
  if (!exp) return null;
  const d = DEFAULT_EXPERIENCE;
  return {
    ...d, ...exp,
    motifs: Array.isArray(exp.motifs) ? exp.motifs : [],
    materials: { ...d.materials, ...exp.materials }, styles: { ...d.styles, ...exp.styles },
    motion: { ...d.motion, ...exp.motion }, sound: { ...d.sound, ...exp.sound },
  };
}

// Page-root data attributes that switch on the CSS for materials, section styles and hovers.
export function experienceAttrs(exp, editor) {
  if (!exp) return {};
  const v = (x, none) => (x && x !== none ? x : undefined);
  return {
    "data-experience": "",
    "data-material": v(exp.materials.card, "none"),
    "data-nav-style": v(exp.styles.nav, "default"), "data-headline": v(exp.styles.headline, "default"),
    "data-image": v(exp.styles.image, "none"), "data-cta": v(exp.styles.cta, "default"),
    "data-card-hover": v(exp.motion.cardHover, "default"), "data-image-hover": v(exp.motion.imageHover, "none"),
    "data-transition": editor ? undefined : v(exp.motion.enabled ? exp.motion.transition : "none", "none"),
    "data-motifs-still": exp.motion.enabled ? undefined : "",
    "data-editor": editor ? "" : undefined,
  };
}

const PLACE_KIND = { hero: ["hero"], sections: ["body"], footer: ["footer"], all: ["hero", "body", "footer"] };
// Motifs for one section, split by layer. "between" motifs sit on the seam above every section after the first.
export function motifsForSection(exp, section, index) {
  const out = { back: [], front: [], seam: [] };
  if (!exp || !exp.decorations || section.hideMotifs || section.kind === "nav") return out;
  for (const m of exp.motifs) {
    if (m.hidden) continue;
    if (m.placement === "between") { if (index > 0) out.seam.push(m); continue; }
    const hit = m.placement === "section" ? m.sectionId === section.id : (PLACE_KIND[m.placement] || []).includes(section.kind);
    if (hit) out[m.layer === "front" ? "front" : "back"].push(m);
  }
  return out;
}
