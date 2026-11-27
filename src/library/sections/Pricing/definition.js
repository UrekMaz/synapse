import { hideField } from "../../../registry/fieldGroups.js";
import { el, header, textFields, shellFields, shellDefaults, gridFields, cardFields, cardDefaults, variantField, defineSection, responsive } from "../shared/kit.js";

const f = (text, included = true) => ({ text, included });
const plan = (n, props) => el({
  id: `plan-${n}`, type: "plan", label: `Plan · ${props.name}`,
  props: { name: "", description: "", monthly: "0", yearly: "0", badge: "", features: [], ctaText: "Get started", ctaHref: "#", highlighted: false, hidden: false, ...props },
});

export default defineSection({
  id: "pricing", name: "Pricing", library: "Pricing",
  description: "Clear plans with feature lists, a highlighted plan and a working monthly / yearly toggle.",
  tags: ["pricing", "plans", "saas", "subscription", "billing"],
  choreoTypes: ["plan"],
  defaults: {
    props: shellDefaults({
      ...cardDefaults({ cardPadding: "$card-pad", cardBg: "$background", cardShadow: "$card-shadow", cardHover: "none" }), variant: "cards", columns: 3, gap: "$gap",
      currency: "$", showToggle: true, defaultBilling: "monthly", monthlyLabel: "Monthly", yearlyLabel: "Yearly", saveLabel: "Save 20%",
      periodMonthly: "/ month", periodYearly: "/ month, billed yearly", highlightColor: "$primary", background: "$surface",
    }),
    responsive: responsive({ columns: 1 }, { columns: 1 }),
    elements: [
      ...header({ eyebrow: "Pricing", heading: "Simple pricing that scales with you", subtitle: "Start free. Upgrade when you're ready. Cancel anytime." }),
      plan(1, { name: "Starter", description: "For individuals and side projects.", monthly: "0", yearly: "0", ctaText: "Start for free",
        features: [f("1 project"), f("Basic analytics"), f("Community support"), f("Custom domain", false), f("Team members", false)] }),
      plan(2, { name: "Pro", description: "For growing teams that ship every week.", monthly: "29", yearly: "23", badge: "Most popular", highlighted: true, ctaText: "Start 14-day trial",
        features: [f("Unlimited projects"), f("Advanced analytics"), f("Priority support"), f("Custom domain"), f("Up to 10 team members")] }),
      plan(3, { name: "Enterprise", description: "For organisations with advanced needs.", monthly: "Custom", yearly: "Custom", ctaText: "Talk to sales",
        features: [f("Everything in Pro"), f("SSO & audit logs"), f("Dedicated success manager"), f("99.99% uptime SLA"), f("Unlimited team members")] }),
    ],
  },
  variations: {
    cards: { label: "Three-column pricing cards", props: { variant: "cards", showToggle: false } },
    featured: { label: "Featured central plan", description: "The highlighted plan is raised and inverted.", props: { variant: "featured", showToggle: false } },
    toggle: { label: "Monthly / yearly toggle", description: "Switch billing period — prices update instantly.", props: { variant: "cards", showToggle: true, defaultBilling: "monthly" } },
  },
  elementTemplates: { plan: { label: "Plan", element: plan("tmp", { name: "New plan", description: "Who this plan is for.", monthly: "49", yearly: "39", features: [f("First feature"), f("Second feature")] }) } },
  editableProperties: [
    variantField([{ value: "cards", label: "Cards" }, { value: "featured", label: "Featured centre plan" }]),
    ...gridFields(4),
    { key: "currency", label: "Currency symbol", type: "text", group: "Billing" },
    { key: "showToggle", label: "Monthly / yearly toggle", type: "toggle", group: "Billing" },
    { key: "defaultBilling", label: "Default billing", type: "segmented", options: [{ value: "monthly", label: "Monthly" }, { value: "yearly", label: "Yearly" }], group: "Billing" },
    { key: "monthlyLabel", label: "Monthly label", type: "text", group: "Billing", showIf: (p) => p.showToggle },
    { key: "yearlyLabel", label: "Yearly label", type: "text", group: "Billing", showIf: (p) => p.showToggle },
    { key: "saveLabel", label: "Yearly savings badge", type: "text", group: "Billing", showIf: (p) => p.showToggle },
    { key: "periodMonthly", label: "Monthly period text", type: "text", group: "Billing" },
    { key: "periodYearly", label: "Yearly period text", type: "text", group: "Billing" },
    { key: "highlightColor", label: "Highlight color", type: "color", tokens: true, group: "Billing" },
    ...cardFields(), ...shellFields(),
  ],
  elementSchemas: {
    plan: [
      { key: "name", label: "Plan name", type: "text", group: "Plan" },
      { key: "description", label: "Description", type: "textarea", group: "Plan" },
      { key: "monthly", label: "Monthly price (number or text)", type: "text", group: "Price" },
      { key: "yearly", label: "Yearly price per month", type: "text", group: "Price" },
      { key: "highlighted", label: "Highlighted plan", type: "toggle", group: "Plan" },
      { key: "badge", label: "Badge", type: "text", group: "Plan" },
      { key: "features", label: "Features", type: "list", itemLabel: "Feature", titleKey: "text", itemFields: [{ key: "text", label: "Feature", type: "text" }, { key: "included", label: "Included", type: "toggle" }], newItem: { text: "New feature", included: true }, group: "Features" },
      { key: "ctaText", label: "Button text", type: "text", group: "Button" },
      { key: "ctaHref", label: "Button URL", type: "link", group: "Button" },
      hideField(),
    ],
    meta: textFields({ max: 30, multiline: false }), heading: textFields({ max: 120 }), text: textFields({ max: 30 }),
  },
});
