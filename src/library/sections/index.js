import { lazy } from "react";
import features from "./Features/definition.js";
import about from "./About/definition.js";
import services from "./Services/definition.js";
import stats from "./Stats/definition.js";
import logos from "./Logos/definition.js";
import testimonials from "./Testimonials/definition.js";
import team from "./Team/definition.js";
import portfolio from "./Portfolio/definition.js";
import pricing from "./Pricing/definition.js";
import faq from "./FAQ/definition.js";
import cta from "./CTA/definition.js";
import contact from "./Contact/definition.js";

// Body section library: one configurable component per category; its variations are the design variants.
export const BODY_SECTIONS = [
  { ...features, component: lazy(() => import("./Features/Features.jsx")) },
  { ...about, component: lazy(() => import("./About/About.jsx")) },
  { ...services, component: lazy(() => import("./Services/Services.jsx")) },
  { ...stats, component: lazy(() => import("./Stats/Stats.jsx")) },
  { ...logos, component: lazy(() => import("./Logos/Logos.jsx")) },
  { ...testimonials, component: lazy(() => import("./Testimonials/Testimonials.jsx")) },
  { ...team, component: lazy(() => import("./Team/Team.jsx")) },
  { ...portfolio, component: lazy(() => import("./Portfolio/Portfolio.jsx")) },
  { ...pricing, component: lazy(() => import("./Pricing/Pricing.jsx")) },
  { ...faq, component: lazy(() => import("./FAQ/FAQ.jsx")) },
  { ...cta, component: lazy(() => import("./CTA/CTA.jsx")) },
  { ...contact, component: lazy(() => import("./Contact/Contact.jsx")) },
];
