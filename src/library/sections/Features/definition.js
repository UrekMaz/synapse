import { hideField } from "../../../registry/fieldGroups.js";
import {
  el, header, textFields, shellFields, shellDefaults, gridFields, cardFields, cardDefaults, variantField, defineSection, responsive,
  mediaEl, mediaFields, ICON_OPTIONS, IMG, btnEl, buttonFields,
} from "../shared/kit.js";

const feature = (n, icon, title, text) => el({ id: `feature-${n}`, type: "feature", label: `Feature ${n}`, props: { icon, imageUrl: "", title, text, linkLabel: "", href: "", hidden: false } });

export default defineSection({
  id: "features", name: "Features", library: "Features",
  description: "Show what your product does best — cards, icon grid or image-and-text.",
  tags: ["features", "benefits", "product", "grid", "icons"],
  choreoTypes: ["feature", "media"],
  defaults: {
    props: shellDefaults({ ...cardDefaults(), variant: "cards", columns: 3, gap: "$gap", iconStyle: "soft", iconColor: "$primary", itemAlign: "left", mediaSide: "left" }),
    responsive: responsive({ columns: 2 }, { columns: 1 }),
    elements: [
      ...header({ eyebrow: "Features", heading: "Everything you need to ship faster", subtitle: "Powerful building blocks that work together, so your team can focus on what actually matters." }),
      mediaEl("media", "Image (image & text layout)", { imageUrl: IMG("1551434678-e076c223a692"), ratio: "4/5", radius: 28, shadow: 0.6 }),
      feature(1, "zap", "Lightning fast", "Pages load in milliseconds on every device, with images and code optimised automatically."),
      feature(2, "shield-check", "Secure by default", "Enterprise-grade encryption, SSO and audit logs are built in from day one."),
      feature(3, "workflow", "Automated workflows", "Connect your tools and let routine work run itself in the background."),
      feature(4, "chart", "Real-time insights", "Live dashboards show exactly what's working — and what isn't."),
      feature(5, "users", "Built for teams", "Comments, roles and shared libraries keep everyone moving together."),
      feature(6, "globe", "Global by design", "Translations, currencies and a worldwide edge network out of the box."),
      { ...btnEl("cta", "Button", { text: "Explore all features", arrow: true }), visible: false },
    ],
  },
  variations: {
    cards: { label: "Three-column feature cards", description: "Bordered cards with soft icon badges.", props: { variant: "cards", columns: 3, headerAlign: "center", itemAlign: "left", iconStyle: "soft", cardBg: "$surface", cardBorderWidth: "$card-border", cardPadding: "$card-pad", cardHover: "lift" } },
    icons: { label: "Icon feature grid", description: "Centred icons, no card chrome — light and scannable.", props: { variant: "icons", columns: 3, headerAlign: "center", itemAlign: "center", iconStyle: "solid", cardBg: "$background", cardBorderWidth: 0, cardPadding: 12, cardHover: "none" } },
    media: { label: "Image & text features", description: "Large image beside a list of features.", props: { variant: "media", headerAlign: "left", itemAlign: "left", iconStyle: "soft", cardBg: "$background", cardBorderWidth: 0, cardPadding: 0, cardHover: "none" } },
  },
  elementTemplates: { feature: { label: "Feature", element: feature("tmp", "sparkles", "New feature", "Describe the benefit in one or two sentences.") } },
  editableProperties: [
    variantField([{ value: "cards", label: "Feature cards" }, { value: "icons", label: "Icon grid" }, { value: "media", label: "Image & text" }]),
    ...gridFields(),
    { key: "itemAlign", label: "Item alignment", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }], group: "Grid" },
    { key: "mediaSide", label: "Image side", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "right", label: "Right" }], group: "Layout", showIf: (p) => p.variant === "media" },
    { key: "iconStyle", label: "Icon style", type: "segmented", options: [{ value: "soft", label: "Soft" }, { value: "solid", label: "Solid" }, { value: "outline", label: "Outline" }, { value: "none", label: "None" }], group: "Icons" },
    { key: "iconColor", label: "Icon color", type: "color", tokens: true, group: "Icons" },
    ...cardFields(), ...shellFields(),
  ],
  elementSchemas: {
    feature: [
      { key: "title", label: "Title", type: "text", group: "Content" },
      { key: "text", label: "Description", type: "textarea", group: "Content" },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, group: "Content" },
      { key: "imageUrl", label: "Image (replaces icon)", type: "image", group: "Content" },
      { key: "linkLabel", label: "Link label", type: "text", group: "Link" },
      { key: "href", label: "Link URL", type: "link", group: "Link" },
      hideField(),
    ],
    media: mediaFields(),
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
    button: buttonFields(),
  },
});
