import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, gridFields, cardFields, cardDefaults, variantField, defineSection, responsive, ICON_OPTIONS } from "../shared/kit.js";

const stat = (n, value, props) => el({
  id: `stat-${n}`, type: "stat", label: `Statistic ${n}`,
  props: { value, prefix: "", suffix: "", decimals: 0, separator: true, label: "", text: "", icon: "", hidden: false, ...props },
});

export default defineSection({
  id: "stats", name: "Statistics", library: "Statistics",
  description: "Animated counters that tick up as they scroll into view.",
  tags: ["statistics", "numbers", "counters", "metrics", "results"],
  choreoTypes: ["stat"],
  defaults: {
    props: shellDefaults({ ...cardDefaults({ cardPadding: "$card-pad" }), variant: "counters", columns: 4, gap: "$gap", countUp: true, countDuration: 2, numberColor: "$text", numberSize: 56, dividers: true, iconStyle: "soft", iconColor: "$primary", paddingY: 96 }),
    responsive: responsive({ columns: 2, numberSize: 48 }, { columns: 2, numberSize: 38 }),
    elements: [
      ...header({ eyebrow: "By the numbers", heading: "Trusted by teams who ship", subtitle: null }),
      stat(1, 12000, { suffix: "+", label: "Teams worldwide", text: "From two-person startups to Fortune 500s.", icon: "users" }),
      stat(2, 99.99, { suffix: "%", decimals: 2, label: "Uptime", text: "Measured across the last 24 months.", icon: "gauge" }),
      stat(3, 4.9, { suffix: "/5", decimals: 1, label: "Average rating", text: "From 3,800+ verified reviews.", icon: "star" }),
      stat(4, 38, { prefix: "$", suffix: "M", label: "Saved for customers", text: "In licence and infrastructure costs.", icon: "dollar" }),
    ],
  },
  variations: {
    counters: { label: "Four-column counters", props: { variant: "counters", columns: 4, numberSize: 56, dividers: true, headerAlign: "center", numberColor: "$text" } },
    large: { label: "Large numerical statistics", description: "Oversized numbers beside the heading.", props: { variant: "large", columns: 2, numberSize: 96, headerAlign: "left", numberColor: "$primary" } },
    icons: { label: "Statistics with icons", description: "Cards with an icon, number, label and description.", props: { variant: "icons", columns: 4, numberSize: 44, headerAlign: "center", cardBg: "$surface", cardBorderWidth: "$card-border", numberColor: "$text" } },
  },
  elementTemplates: { stat: { label: "Statistic", element: stat("tmp", 100, { suffix: "%", label: "New metric" }) } },
  editableProperties: [
    variantField([{ value: "counters", label: "Counters" }, { value: "large", label: "Large numbers" }, { value: "icons", label: "With icons" }]),
    ...gridFields(),
    { key: "countUp", label: "Count up on scroll", type: "toggle", group: "Numbers" },
    { key: "countDuration", label: "Counter duration", type: "range", min: 0.3, max: 6, step: 0.1, unit: "s", group: "Numbers", showIf: (p) => p.countUp },
    { key: "numberSize", label: "Number size", type: "range", min: 24, max: 200, step: 1, unit: "px", responsive: true, group: "Numbers" },
    { key: "numberColor", label: "Number color", type: "color", tokens: true, group: "Numbers" },
    { key: "dividers", label: "Dividers", type: "toggle", group: "Numbers", showIf: (p) => p.variant === "counters" },
    { key: "iconColor", label: "Icon color", type: "color", tokens: true, group: "Numbers", showIf: (p) => p.variant === "icons" },
    ...cardFields(), ...shellFields(),
  ],
  elementSchemas: {
    stat: [
      { key: "value", label: "Number", type: "number", group: "Number" },
      { key: "prefix", label: "Prefix", type: "text", group: "Number" },
      { key: "suffix", label: "Suffix", type: "text", group: "Number" },
      { key: "decimals", label: "Decimal places", type: "range", min: 0, max: 3, step: 1, group: "Number" },
      { key: "separator", label: "Thousands separator", type: "toggle", group: "Number" },
      { key: "label", label: "Label", type: "text", group: "Content" },
      { key: "text", label: "Description", type: "textarea", group: "Content" },
      { key: "icon", label: "Icon", type: "select", options: ICON_OPTIONS, group: "Content" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
  },
});
