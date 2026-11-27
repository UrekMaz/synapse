import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, gridFields, cardFields, cardDefaults, variantField, defineSection, responsive, IMG } from "../shared/kit.js";

const t = (n, quote, name, role, company, img, rating = 5) => el({
  id: `testimonial-${n}`, type: "testimonial", label: `Testimonial · ${name}`,
  props: { quote, name, role, company, avatarUrl: IMG(img, 200), rating, hidden: false },
});

export default defineSection({
  id: "testimonials", name: "Testimonials", library: "Testimonials",
  description: "Customer love as cards, a large featured quote or an auto-playing carousel.",
  tags: ["testimonials", "reviews", "quotes", "social proof", "carousel"],
  choreoTypes: ["testimonial"],
  defaults: {
    props: shellDefaults({
      ...cardDefaults({ cardPadding: "$card-pad" }), variant: "cards", columns: 3, gap: "$gap", showRating: true, starColor: "#f5a524", quoteSize: 18,
      autoplay: true, interval: 5, arrows: true, dots: true, perView: 3, background: "$background",
    }),
    responsive: responsive({ columns: 2, perView: 2 }, { columns: 1, perView: 1 }),
    elements: [
      ...header({ eyebrow: "Testimonials", heading: "Loved by product teams everywhere", subtitle: null }),
      t(1, "We replaced four tools with one and shipped our redesign a month early. The team genuinely enjoys using it — that never happens.", "Maya Chen", "Head of Product", "Northwind", "1494790108377-be9c29b29330"),
      t(2, "The attention to detail is unreal. Our conversion rate went up 31% in the first quarter after switching.", "Daniel Okafor", "Growth Lead", "Globex", "1500648767791-00dcc994a43e"),
      t(3, "Onboarding took an afternoon. Support answers in minutes, not days. It feels like having an extra senior engineer on the team.", "Sofia Martins", "CTO", "Initech", "1438761681033-6461ffad8d80"),
      t(4, "Finally a platform that designers and engineers both love. Our handoff meetings basically disappeared.", "James Lee", "Design Director", "Hooli", "1507003211169-0a1dd7228f2d"),
      t(5, "Rock solid. We've scaled 10× this year without a single incident traced back to the platform.", "Amara Singh", "VP Engineering", "Stark", "1544005313-94ddf0286df2", 5),
    ],
  },
  variations: {
    cards: { label: "Testimonial cards", props: { variant: "cards", columns: 3 } },
    featured: { label: "Large featured testimonial", description: "One big quote with a customer switcher.", props: { variant: "featured", quoteSize: 34, cardBg: "$surface" } },
    carousel: { label: "Carousel testimonials", description: "Auto-playing slider with arrows and dots.", props: { variant: "carousel", perView: 3, autoplay: true } },
  },
  elementTemplates: { testimonial: { label: "Testimonial", element: t("tmp", "Write what your customer said here.", "Customer name", "Role", "Company", "1472099645785-5658abf4ff4e") } },
  editableProperties: [
    variantField([{ value: "cards", label: "Cards" }, { value: "featured", label: "Featured quote" }, { value: "carousel", label: "Carousel" }]),
    ...gridFields(),
    { key: "quoteSize", label: "Quote size", type: "range", min: 14, max: 56, step: 1, unit: "px", responsive: true, group: "Quotes" },
    { key: "showRating", label: "Show rating", type: "toggle", group: "Quotes" },
    { key: "starColor", label: "Star color", type: "color", tokens: true, group: "Quotes", showIf: (p) => p.showRating },
    { key: "perView", label: "Slides visible", type: "range", min: 1, max: 4, step: 1, responsive: true, group: "Carousel", showIf: (p) => p.variant === "carousel" },
    { key: "autoplay", label: "Autoplay", type: "toggle", group: "Carousel", showIf: (p) => p.variant !== "cards" },
    { key: "interval", label: "Autoplay interval", type: "range", min: 2, max: 15, step: 0.5, unit: "s", group: "Carousel", showIf: (p) => p.variant !== "cards" && p.autoplay },
    { key: "arrows", label: "Navigation arrows", type: "toggle", group: "Carousel", showIf: (p) => p.variant === "carousel" },
    { key: "dots", label: "Dots", type: "toggle", group: "Carousel", showIf: (p) => p.variant === "carousel" },
    ...cardFields(), ...shellFields(),
  ],
  elementSchemas: {
    testimonial: [
      { key: "quote", label: "Review text", type: "textarea", group: "Content" },
      { key: "name", label: "Customer name", type: "text", group: "Customer" },
      { key: "role", label: "Role", type: "text", group: "Customer" },
      { key: "company", label: "Company", type: "text", group: "Customer" },
      { key: "avatarUrl", label: "Profile image", type: "image", group: "Customer" },
      { key: "rating", label: "Rating", type: "range", min: 0, max: 5, step: 0.5, group: "Content" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
  },
});
