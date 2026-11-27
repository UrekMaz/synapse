import { lazy } from "react";
import { hideField } from "../../registry/fieldGroups.js";
import { el, textEl, btnEl, textFields, buttonFields, shellFields, shellDefaults, SOCIAL_LIST, defineSection } from "../sections/shared/kit.js";
import { logo, NAV_SCHEMAS } from "../navbars/fields.js";

// One configurable Footer component; the five designs are data (layout + elements).
const Footer = lazy(() => import("./Footer.jsx"));

const LINK = { type: "list", itemLabel: "Link", titleKey: "label", itemFields: [{ key: "label", label: "Label", type: "text" }, { key: "href", label: "URL", type: "link" }], newItem: { label: "New link", href: "#" } };
const links = (...labels) => labels.map((label) => ({ label, href: `#${label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}` }));
const column = (n, heading, ls) => el({ id: `column-${n}`, type: "column", label: `Column · ${heading}`, props: { heading, links: links(...ls), hidden: false } });
const social = (items = ["x", "linkedin", "instagram", "github"]) => el({ id: "social", type: "social", label: "Social links", props: { items: items.map((network) => ({ network, url: "#" })), hidden: false } });
const legal = (...ls) => el({ id: "legal", type: "linkrow", label: "Legal links", props: { links: links(...ls), hidden: false } });
const copyright = (text) => textEl("copyright", "meta", "Copyright", { text, textTransform: "none", letterSpacing: 0, fontWeight: 400, fontSize: 14, color: "$muted" });
const desc = (text) => textEl("description", "text", "Footer text", { text, fontSize: 15, maxWidth: 320 });
const newsletter = (props = {}) => el({
  id: "newsletter", type: "newsletter", label: "Newsletter",
  props: { heading: "Stay in the loop", text: "Product news and tips, once a month. No spam.", placeholder: "you@company.com", buttonText: "Subscribe", endpoint: "", successMessage: "You're subscribed — thanks!", hidden: false, ...props },
});
const payments = () => el({ id: "payments", type: "payments", label: "Payment methods", props: { methods: ["Visa", "Mastercard", "Amex", "PayPal", "Apple Pay", "Klarna"].map((name) => ({ name })), label: "We accept", hidden: false } });

// Footers follow the theme's footer tokens (each theme decides light / dark / brand footers).
const DARK = { background: "$footerBg", textColor: "$footerText", mutedColor: "$footerMuted", lineColor: "$footerLine" };
const LIGHT = DARK;
const props = (layout, extra) => shellDefaults({ layout, paddingY: 88, columnGap: 48, linkHover: "$primary", align: "left", ...LIGHT, ...extra });

const FOOTER_FIELDS = [
  { key: "textColor", label: "Text color", type: "color", tokens: true, group: "Colors" },
  { key: "mutedColor", label: "Secondary text color", type: "color", tokens: true, group: "Colors" },
  { key: "linkHover", label: "Link hover color", type: "color", tokens: true, group: "Colors" },
  { key: "lineColor", label: "Divider color", type: "color", tokens: true, group: "Colors" },
  { key: "columnGap", label: "Column spacing", type: "range", min: 16, max: 120, step: 2, unit: "px", responsive: true, group: "Layout" },
  { key: "align", label: "Alignment", type: "segmented", options: [{ value: "left", label: "Left" }, { value: "center", label: "Center" }], responsive: true, group: "Layout" },
  ...shellFields({ header: false }),
];
const SCHEMAS = {
  logo: NAV_SCHEMAS.logo,
  column: [{ key: "heading", label: "Column heading", type: "text", group: "Column" }, { key: "links", label: "Links", ...LINK, group: "Column" }, hideField()],
  linkrow: [{ key: "links", label: "Links", ...LINK, group: "Links" }, hideField()],
  social: [{ key: "items", label: "Social links", ...SOCIAL_LIST, group: "Social" }, hideField()],
  newsletter: [
    { key: "heading", label: "Heading", type: "text", group: "Content" }, { key: "text", label: "Text", type: "textarea", group: "Content" },
    { key: "placeholder", label: "Field placeholder", type: "text", group: "Field" }, { key: "buttonText", label: "Button text", type: "text", group: "Field" },
    { key: "endpoint", label: "Signup endpoint URL (POST)", type: "text", group: "Submission" }, { key: "successMessage", label: "Success message", type: "text", group: "Submission" },
    hideField(),
  ],
  payments: [{ key: "label", label: "Label", type: "text", group: "Payments" }, { key: "methods", label: "Payment methods", type: "list", itemLabel: "Method", titleKey: "name", itemFields: [{ key: "name", label: "Name", type: "text" }], newItem: { name: "New method" }, group: "Payments" }, hideField()],
  meta: textFields({ max: 30, multiline: false }), text: textFields({ max: 30 }), heading: textFields({ max: 260 }),
  button: buttonFields(),
};

const FADE = {
  "fade-up": {
    label: "Fade Up", description: "Columns rise in as the footer comes into view.",
    byType: Object.fromEntries(["logo", "text", "column", "newsletter", "social", "heading", "button", "linkrow", "meta", "payments"].map((t, i) => [t, [{ preset: "slide-up", distance: 20, duration: 0.7, delay: 0.05 * i, easing: "expo-out", trigger: "viewport" }, { delay: 0.05 * i + 0.08 }, { delay: 0.05 * i + 0.16 }, { delay: 0.05 * i + 0.24 }, { delay: 0.05 * i + 0.32 }]])),
  },
  none: { label: "No animation", description: "Static footer.", byType: {} },
};

const defineFooter = ({ id, name, description, tags, layout, extra, elements }) => ({
  ...defineSection({
    kind: "footer", library: "Footer", id, name, description, tags, choreographies: FADE,
    defaults: { props: props(layout, extra), elements, responsive: { desktop: {}, tablet: { paddingY: 72, columnGap: 32 }, mobile: { paddingY: 56, paddingX: 20, columnGap: 28 } } },
    elementTemplates: { column: { label: "Link column", element: column("tmp", "New column", ["First link", "Second link"]) } },
    editableProperties: FOOTER_FIELDS, elementSchemas: SCHEMAS,
  }),
  component: Footer,
});

const year = new Date().getFullYear();
const brandLogo = (extra = {}) => logo({ text: "Northwind", mark: "dot", ...extra });

export const FOOTERS = [
  defineFooter({
    id: "footer-minimal", name: "Minimal Footer", layout: "minimal", tags: ["minimal", "simple", "small"],
    description: "Logo, a few links and social icons on one line, with copyright below.",
    elements: [brandLogo(), legal("Work", "About", "Journal", "Contact"), social(), copyright(`© ${year} Northwind Studio. All rights reserved.`)],
  }),
  defineFooter({
    id: "footer-columns", name: "Multi-Column Footer", layout: "columns", tags: ["columns", "links", "company", "corporate"],
    description: "Brand and description beside company, product and resource columns.",
    elements: [
      brandLogo(), desc("Calm, beautiful software for ambitious teams. Made with care in San Francisco and Lisbon."), social(),
      column(1, "Product", ["Features", "Pricing", "Integrations", "Changelog"]), column(2, "Company", ["About", "Careers", "Press", "Contact"]),
      column(3, "Resources", ["Docs", "Guides", "Blog", "Community"]),
      copyright(`© ${year} Northwind, Inc.`), legal("Privacy", "Terms", "Cookies"),
    ],
  }),
  defineFooter({
    id: "footer-saas", name: "SaaS Footer", layout: "saas", tags: ["saas", "newsletter", "product", "startup"],
    description: "Product, resource and company links plus a newsletter signup, on a dark band.",
    extra: DARK,
    elements: [
      logo({ text: "Lumen", mark: "spark" }), desc("The analytics workspace for modern product teams."),
      column(1, "Product", ["Overview", "Analytics", "Automation", "Pricing"]), column(2, "Resources", ["Documentation", "API reference", "Status", "Blog"]),
      column(3, "Company", ["About", "Customers", "Careers", "Contact"]),
      newsletter(), social(["x", "linkedin", "github", "youtube"]),
      copyright(`© ${year} Lumen Labs, Inc.`), legal("Privacy", "Terms", "Security", "DPA"),
    ],
  }),
  defineFooter({
    id: "footer-ecommerce", name: "E-commerce Footer", layout: "ecommerce", tags: ["ecommerce", "store", "shop", "payments", "newsletter"],
    description: "Newsletter band, customer-service and shopping columns, policies and accepted payments.",
    extra: {},
    elements: [
      logo({ text: "Kōbo", mark: "square", fontSize: 24 }),
      newsletter({ heading: "Join the Kōbo club", text: "10% off your first order, early access to drops and the occasional good read.", buttonText: "Sign up" }),
      column(1, "Customer care", ["Contact us", "Track your order", "Returns & exchanges", "FAQ"]),
      column(2, "Shopping", ["Shipping & delivery", "Size guide", "Gift cards", "Store locator"]),
      column(3, "About Kōbo", ["Our story", "Sustainability", "Careers", "Press"]),
      column(4, "Policies", ["Privacy policy", "Terms of sale", "Cookie settings", "Accessibility"]),
      payments(), social(["instagram", "tiktok", "facebook", "youtube"]), copyright(`© ${year} Kōbo Store Ltd.`),
    ],
  }),
  defineFooter({
    id: "footer-creative", name: "Large Creative Footer", layout: "creative", tags: ["creative", "agency", "portfolio", "bold", "oversized"],
    description: "Oversized statement, contact CTA, socials and a giant wordmark.",
    extra: DARK,
    elements: [
      textEl("statement", "heading", "Statement", { text: "Let's make something people remember.", fontSize: "$h1", color: "$footerText", maxWidth: 900 }),
      btnEl("cta", "Contact button", { text: "Start a project", bgColor: "$footerText", textColor: "$footerBg", arrow: true, hover: "glow" }),
      textEl("contact", "meta", "Contact line", { text: "hello@studio-aether.com · +44 20 7946 0958", textTransform: "none", letterSpacing: 0, fontSize: 16, fontWeight: 500, color: "$footerMuted" }),
      social(["instagram", "dribbble", "linkedin", "x"]),
      column(1, "Studio", ["Work", "Services", "About", "Careers"]), column(2, "Offices", ["London", "Lisbon", "New York"]),
      logo({ text: "AETHER", mark: "none", fontSize: 220, fontWeight: 800, letterSpacing: -0.05 }, { tablet: { fontSize: 140 }, mobile: { fontSize: 72 } }),
      copyright(`© ${year} Aether Studio Ltd.`), textEl("meta-right", "meta", "Metadata", { text: "Designed in London · Built with Synapse", textTransform: "none", letterSpacing: 0, fontWeight: 400, fontSize: 14, color: "$muted" }),
    ],
  }),
];
