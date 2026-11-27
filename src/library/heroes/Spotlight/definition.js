import { header, textEl, textFields, shellFields, shellDefaults, variantField, defineSection, responsive, mediaEl, mediaFields, IMG, btnEl, secondaryBtn, buttonFields } from "../../sections/shared/kit.js";

// A hero built entirely from theme tokens: it always matches the site's colors, fonts, buttons and effects.
const RISE = { trigger: "page-load" };
const choreographies = {
  rise: {
    label: "Spotlight Rise", description: "Badge, headline and buttons rise in; the product image glides up last.",
    byType: {
      meta: [{ preset: "fade-in", duration: 0.7, delay: 0.05, ...RISE }, { delay: 1.1 }],
      heading: [{ preset: "slide-up", distance: 40, duration: 1, delay: 0.15, easing: "expo-out", ...RISE }],
      text: [{ preset: "fade-in", duration: 0.9, delay: 0.4, ...RISE }],
      button: [{ preset: "zoom-in", scale: 0.9, duration: 0.6, delay: 0.6, easing: "back-out", ...RISE }, { delay: 0.7 }],
      media: [{ preset: "perspective-in", rotation: 16, distance: 80, duration: 1.3, delay: 0.75, easing: "expo-out", ...RISE }],
    },
  },
  soft: {
    label: "Soft Focus", description: "Everything resolves gently from a blur.",
    byType: {
      meta: [{ preset: "fade-in", duration: 0.8, delay: 0, ...RISE }, { delay: 1 }],
      heading: [{ preset: "blur-reveal", blur: 18, duration: 1.1, delay: 0.1, ...RISE }],
      text: [{ preset: "fade-in", duration: 1, delay: 0.35, ...RISE }],
      button: [{ preset: "fade-in", duration: 0.8, delay: 0.55, ...RISE }, { delay: 0.65 }],
      media: [{ preset: "crossfade", blur: 14, duration: 1.4, delay: 0.6, ...RISE }],
    },
  },
};

export default defineSection({
  kind: "hero", library: "Hero",
  id: "spotlight-hero", name: "Spotlight Hero",
  description: "Theme-native hero: headline, buttons and a glowing product shot that always match your Theme Studio styles.",
  tags: ["theme", "saas", "product", "startup", "clean", "centered"],
  categories: ["Hero", "SaaS / Product", "Minimal / Editorial"],
  choreographies,
  defaults: {
    tokenNative: true,
    props: shellDefaults({ variant: "centered", paddingY: 120, glow: true, headerAlign: "center", gradient: "none" }),
    responsive: responsive({ paddingY: 96 }, { paddingY: 72 }),
    elements: [
      textEl("eyebrow", "meta", "Badge", { text: "✦ New — Theme Studio is here", textTransform: "none", letterSpacing: 0, fontWeight: 600, pill: true, color: "$primary" }),
      ...header({ heading: "Build a website that looks like one brand", subtitle: "Pick a theme, connect your sections and publish — every navbar, card and footer stays perfectly in tune." })
        .map((e) => (e.type === "heading" ? { ...e, props: { ...e.props, fontSize: "$h1", maxWidth: 900 } } : { ...e, props: { ...e.props, fontSize: "$body-lg", maxWidth: 620 } })),
      btnEl("cta", "Primary button", { text: "Start for free", arrow: true }),
      secondaryBtn("cta-2", "Secondary button", { text: "See how it works" }),
      textEl("note", "meta", "Small print", { text: "Free forever plan · No credit card", textTransform: "none", letterSpacing: 0, fontWeight: 500, color: "$muted" }),
      mediaEl("media", "Product image", { imageUrl: IMG("1551434678-e076c223a692", 1800), ratio: "16/9", radius: 20, shadow: 0.7 }, { mobile: { ratio: "4/3" } }),
    ],
  },
  variations: {
    centered: { label: "Centered spotlight", props: { variant: "centered", headerAlign: "center" } },
    split: { label: "Split spotlight", description: "Text on the left, product image on the right.", props: { variant: "split", headerAlign: "left" } },
  },
  editableProperties: [
    variantField([{ value: "centered", label: "Centered" }, { value: "split", label: "Split" }]),
    { key: "glow", label: "Theme glow behind image", type: "toggle", group: "Layout" },
    ...shellFields(),
  ],
  elementSchemas: {
    media: mediaFields(),
    meta: [...textFields({ max: 30, multiline: false }), { key: "pill", label: "Badge style", type: "toggle", group: "Colors" }],
    heading: textFields({ max: 140 }), text: textFields({ max: 40 }),
    button: buttonFields(),
  },
});
