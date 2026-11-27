import { header, textFields, shellFields, shellDefaults, variantField, defineSection, responsive, mediaEl, mediaFields, IMG, btnEl, secondaryBtn, buttonFields, textEl } from "../shared/kit.js";

const LIGHT = { heading: { color: "#ffffff" }, text: { color: "rgba(255,255,255,.82)" }, meta: { color: "rgba(255,255,255,.75)" } };
const DARK = { heading: { color: "$text" }, text: { color: "$muted" }, meta: { color: "$muted" } };

export default defineSection({
  id: "cta", name: "Call to Action", library: "CTA",
  description: "Turn interest into action — a bold banner, an image split or a gradient card.",
  tags: ["cta", "call to action", "signup", "conversion", "banner"],
  choreoTypes: ["media"],
  defaults: {
    props: shellDefaults({
      variant: "banner", align: "center", gradient: "linear", gradientFrom: "$primary", gradientTo: "$secondary", gradientAngle: 135, background: "$primary",
      cardFrom: "$primary", cardTo: "$accent", cardRadius: 32, cardPadding: 72, paddingY: 112,
    }),
    responsive: responsive({ cardPadding: 48 }, { cardPadding: 28, paddingY: 64 }),
    elements: [
      ...header({ eyebrow: null, heading: "Ready to build something remarkable?", subtitle: "Join 12,000+ teams who design, launch and grow with us. Free for 14 days — no credit card required." })
        .map((e) => ({ ...e, props: { ...e.props, ...(LIGHT[e.type] || {}) } })),
      btnEl("cta", "Primary button", { text: "Start free trial", bgColor: "#ffffff", textColor: "$text", arrow: true, hover: "lift" }),
      secondaryBtn("cta-2", "Secondary button", { text: "Book a demo", textColor: "#ffffff", borderColor: "rgba(255,255,255,.4)" }),
      textEl("note", "meta", "Small print", { text: "Cancel anytime · SOC 2 certified · 24/7 support", textTransform: "none", letterSpacing: 0, fontWeight: 500, color: "rgba(255,255,255,.75)" }),
      mediaEl("media", "Image (split layout)", { imageUrl: IMG("1556761175-5973dc0f32e7"), ratio: "auto", radius: 0 }),
    ],
  },
  variations: {
    banner: {
      label: "Full-width CTA banner", props: { variant: "banner", align: "center", gradient: "linear", gradientFrom: "$primary", gradientTo: "$secondary", background: "$primary" },
      byType: LIGHT, byId: { cta: { bgColor: "#ffffff", textColor: "$text" }, "cta-2": { textColor: "#ffffff", borderColor: "rgba(255,255,255,.4)" } },
    },
    split: {
      label: "Split image & text CTA", description: "Image on one side, message on the other.", props: { variant: "split", align: "left", gradient: "none", background: "$background", cardRadius: 28 },
      byType: DARK, byId: { cta: { bgColor: "$primary", textColor: "$buttonText" }, "cta-2": { textColor: "$text", borderColor: "$border" } },
    },
    gradient: {
      label: "Gradient CTA card", description: "A rounded gradient card floating in the section.", props: { variant: "card", align: "center", gradient: "none", background: "$background", cardFrom: "$primary", cardTo: "$accent", cardRadius: 32 },
      byType: LIGHT, byId: { cta: { bgColor: "#ffffff", textColor: "$text" }, "cta-2": { textColor: "#ffffff", borderColor: "rgba(255,255,255,.45)" } },
    },
  },
  editableProperties: [
    variantField([{ value: "banner", label: "Full-width banner" }, { value: "split", label: "Split image & text" }, { value: "card", label: "Gradient card" }]),
    { key: "align", label: "Alignment", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }], responsive: true, group: "Layout" },
    { key: "cardFrom", label: "Card gradient from", type: "color", tokens: true, group: "Card", showIf: (p) => p.variant === "card" },
    { key: "cardTo", label: "Card gradient to", type: "color", tokens: true, group: "Card", showIf: (p) => p.variant === "card" },
    { key: "cardRadius", label: "Card radius", type: "range", min: 0, max: 60, step: 1, unit: "px", group: "Card", showIf: (p) => p.variant !== "banner" },
    { key: "cardPadding", label: "Card padding", type: "range", min: 16, max: 140, step: 2, unit: "px", responsive: true, group: "Card" },
    ...shellFields({ header: false }),
  ],
  elementSchemas: {
    media: mediaFields(),
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
    button: buttonFields(),
  },
});
