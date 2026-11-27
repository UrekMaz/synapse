import { lazy } from "react";
import { IMG } from "../sections/shared/kit.js";
import { defineNavbar, logo, link, navIcon, search, navBtn, ghostBtn } from "./fields.js";

// One configurable component powers all six designs; each design is its own data (defaults + elements).
const Navbar = lazy(() => import("./Navbar.jsx"));

const PRODUCT_COLUMNS = [
  { heading: "Platform", links: [
    { label: "Analytics", href: "#analytics", description: "Real-time dashboards for every team", icon: "chart" },
    { label: "Automation", href: "#automation", description: "Workflows that run themselves", icon: "workflow" },
    { label: "Integrations", href: "#integrations", description: "Connect 200+ tools in a click", icon: "puzzle" },
  ] },
  { heading: "Security", links: [
    { label: "Access control", href: "#access", description: "Roles, SSO and audit logs", icon: "lock" },
    { label: "Compliance", href: "#compliance", description: "SOC 2, GDPR and HIPAA ready", icon: "shield-check" },
    { label: "Data residency", href: "#residency", description: "Choose where your data lives", icon: "globe" },
  ] },
];

const minimal = defineNavbar({
  id: "nav-minimal", name: "Minimal Navbar", description: "Clean logo, links and one clear call to action. Generous spacing.",
  tags: ["minimal", "portfolio", "startup", "corporate"],
  props: { linksAlign: "right", borderBottom: false },
  elements: [
    logo({ text: "Northwind", mark: "dot" }),
    link(1, "Work", { active: true }), link(2, "Services"), link(3, "About"), link(4, "Journal"),
    navBtn("cta", "Primary button", { text: "Let's talk", arrow: true }),
  ],
});

const saas = defineNavbar({
  id: "nav-saas", name: "SaaS Navbar", description: "Product mega menu, solution & resource dropdowns, pricing, log in and a strong CTA.",
  tags: ["saas", "product", "dropdown", "mega menu", "startup"],
  props: { linksAlign: "left", linkGap: 26, activeStyle: "pill", position: "sticky" },
  elements: [
    logo({ text: "Lumen", mark: "spark" }),
    link(1, "Product", {
      dropdown: "mega", columns: PRODUCT_COLUMNS, megaWidth: 820,
      promoTitle: "What's new in Lumen 4", promoText: "AI forecasting, custom dashboards and a faster everything.", promoImage: IMG("1551434678-e076c223a692", 800), promoCta: "Read the release notes", promoHref: "#changelog",
    }),
    link(2, "Solutions", { dropdown: "list", items: [
      { label: "For startups", href: "#startups", description: "Move fast with sensible defaults", icon: "rocket" },
      { label: "For enterprise", href: "#enterprise", description: "Scale, security and support", icon: "building" },
      { label: "For agencies", href: "#agencies", description: "Manage every client in one place", icon: "briefcase" },
    ] }),
    link(3, "Resources", { dropdown: "list", items: [
      { label: "Documentation", href: "#docs", description: "Guides and API reference", icon: "code" },
      { label: "Blog", href: "#blog", description: "Product news and stories", icon: "feather" },
      { label: "Community", href: "#community", description: "Join 40k builders", icon: "users" },
    ] }),
    link(4, "Pricing"),
    ghostBtn("login", "Log in button", { text: "Log in" }),
    navBtn("cta", "Get started button", { text: "Get started", arrow: true }),
  ],
});

const luxury = defineNavbar({
  id: "nav-luxury", name: "Luxury Navbar", description: "Elegant serif wordmark, airy uppercase links and quiet hover transitions.",
  tags: ["luxury", "fashion", "architecture", "premium", "elegant"],
  props: {
    linksAlign: "center", height: 92, borderBottom: true, linkSize: 12, linkWeight: 500,
    linkTransform: "uppercase", linkTracking: 0.22, linkGap: 40, activeStyle: "underline", ddShadow: 0.1, ddRadius: 0,
  },
  responsive: { mobile: { height: 70 } },
  elements: [
    logo({ text: "MAISON ÉLAN", fontFamily: "$accentFont", fontSize: 26, fontWeight: 600, letterSpacing: 0.18, mark: "none" }, { mobile: { fontSize: 20 } }),
    link(1, "Collections", { dropdown: "list", items: [
      { label: "Autumn / Winter", href: "#aw", description: "", icon: "" }, { label: "Spring / Summer", href: "#ss", description: "", icon: "" }, { label: "Archive", href: "#archive", description: "", icon: "" },
    ] }),
    link(2, "Atelier"), link(3, "Journal"), link(4, "Stores"),
    navBtn("cta", "Appointment button", { text: "Book an appointment", variant: "outline", bgColor: "", textColor: "$headingText", borderColor: "$headingText", radius: 0, uppercase: true, hover: "brighten" }),
  ],
  choreography: "reveal-links",
});

const ecommerce = defineNavbar({
  id: "nav-ecommerce", name: "E-commerce Navbar", description: "Two-row store header: search, account, wishlist and cart, plus a category bar.",
  tags: ["ecommerce", "store", "shop", "search", "cart"],
  props: { arrangement: "two-row", height: 72, linksAlign: "center", linkGap: 34, linkSize: 14, linkWeight: 600, activeStyle: "color", fullWidth: true, collapseAt: "tablet" },
  elements: [
    logo({ text: "Kōbo", mark: "square", fontSize: 24 }),
    search(),
    navIcon(1, "user", "Account"), navIcon(2, "heart", "Wishlist", { badge: "3" }), navIcon(3, "bag", "Cart", { badge: "2" }),
    link(1, "New in", { active: true }),
    link(2, "Women", { dropdown: "mega", megaWidth: 760, columns: [
      { heading: "Clothing", links: ["Dresses", "Knitwear", "Coats & jackets", "Trousers"].map((l) => ({ label: l, href: `#${l}`, description: "", icon: "" })) },
      { heading: "Accessories", links: ["Bags", "Jewellery", "Scarves", "Sunglasses"].map((l) => ({ label: l, href: `#${l}`, description: "", icon: "" })) },
    ], promoTitle: "The winter edit", promoText: "Cosy layers and quiet colours — up to 30% off.", promoImage: IMG("1490481651871-ab68de25d43d", 800), promoCta: "Shop the edit", promoHref: "#winter" }),
    link(3, "Men"), link(4, "Home"), link(5, "Beauty"), link(6, "Sale"),
  ],
  choreography: "fade-in",
});

const transparent = defineNavbar({
  id: "nav-transparent", name: "Transparent Navbar", description: "Floats over your hero with optional blur; turns solid as you scroll.",
  tags: ["transparent", "overlay", "hero", "blur", "sticky"],
  props: {
    overlay: true, position: "sticky", background: "#000000", bgOpacity: 0, blur: 0, borderBottom: true, borderColor: "rgba(255,255,255,.14)",
    linkColor: "#ffffff", linkHover: "#ffffff", activeColor: "#ffffff", activeStyle: "underline", linksAlign: "center",
    changeOnScroll: true, scrolledBg: "$secondary", scrolledOpacity: 0.78, scrolledBlur: 18, scrolledText: "",
    menuBg: "$secondary", menuText: "#ffffff", fullWidth: true, paddingX: 48,
  },
  elements: [
    logo({ text: "Aether", mark: "spark", color: "#ffffff", markColor: "#ffffff" }),
    link(1, "Studio"), link(2, "Projects"), link(3, "Process"), link(4, "Contact"),
    navBtn("cta", "Primary button", { text: "Start a project", bgColor: "#ffffff", textColor: "#0b0b10", hover: "glow", glowColor: "#ffffff" }),
  ],
  choreography: "staggered-links",
});

const centered = defineNavbar({
  id: "nav-centered", name: "Centered Navbar", description: "Logo in the middle, links balanced on both sides. Symmetrical and calm.",
  tags: ["centered", "symmetrical", "creative", "luxury", "restaurant"],
  props: { arrangement: "centered", height: 84, linkGap: 34, linkTransform: "uppercase", linkTracking: 0.14, linkSize: 13, activeStyle: "dot", borderBottom: true },
  elements: [
    logo({ text: "Olive & Ash", fontFamily: "$accentFont", fontSize: 26, fontWeight: 500, mark: "none", letterSpacing: -0.01 }),
    link(1, "Menu"), link(2, "Story"), link(3, "Wine"), link(4, "Events"), link(5, "Gift cards"),
    navBtn("cta", "Reservation button", { text: "Reserve a table" }),
  ],
  choreography: "staggered-links",
});

export const NAVBARS = [minimal, saas, luxury, ecommerce, transparent, centered].map((d) => ({ ...d, component: Navbar }));
