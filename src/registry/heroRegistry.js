import { lazy } from "react";
import typographyExplosion from "../library/heroes/TypographyExplosion/definition.js";
import floatingUniverse from "../library/heroes/FloatingUniverse/definition.js";
import floatingDashboard from "../library/heroes/FloatingDashboard/definition.js";
import cinematicReveal from "../library/heroes/CinematicReveal/definition.js";
import liquidChrome from "../library/heroes/LiquidChrome/definition.js";
import spotlight from "../library/heroes/Spotlight/definition.js";
import { NAVBARS } from "../library/navbars/index.js";
import { BODY_SECTIONS } from "../library/sections/index.js";
import { FOOTERS } from "../library/footers/index.js";

export const HERO_CATEGORIES = ["All", "Experimental", "Creative", "Premium", "SaaS / Product", "Interactive", "Minimal / Editorial"];
export const LIBRARY_CATEGORIES = [
  "Navigation", "Hero", "Features", "About", "Services", "Statistics", "Logos", "Testimonials",
  "Team", "Portfolio", "Pricing", "FAQ", "CTA", "Contact", "Footer",
];

const hero = (def, load) => ({ ...def, kind: "hero", library: "Hero", component: lazy(load) });

// Source of truth for the library, studio, renderer and inspector — every section kind lives here.
// Components load lazily so a published page only ships the sections it uses.
export const heroRegistry = {
  "typography-explosion": hero(typographyExplosion, () => import("../library/heroes/TypographyExplosion/TypographyExplosion.jsx")),
  "floating-universe": hero(floatingUniverse, () => import("../library/heroes/FloatingUniverse/FloatingUniverse.jsx")),
  "floating-dashboard": hero(floatingDashboard, () => import("../library/heroes/FloatingDashboard/FloatingDashboard.jsx")),
  "cinematic-reveal": hero(cinematicReveal, () => import("../library/heroes/CinematicReveal/CinematicReveal.jsx")),
  "liquid-chrome": hero(liquidChrome, () => import("../library/heroes/LiquidChrome/LiquidChrome.jsx")),
  "spotlight-hero": hero(spotlight, () => import("../library/heroes/Spotlight/Spotlight.jsx")),
  ...Object.fromEntries([...NAVBARS, ...BODY_SECTIONS, ...FOOTERS].map((d) => [d.id, d])),
};

export const getHero = (id) => heroRegistry[id];
export const getSection = getHero;
export const listHeroes = () => Object.values(heroRegistry).filter((d) => d.kind === "hero");

/*
 * Library cards. Body sections expose one card per design variation (variations switch the layout);
 * heroes, navbars and footers are one card each.
 */
export function listLibrary() {
  return Object.values(heroRegistry).flatMap((def) => {
    const base = { def, id: def.id, category: def.library, name: def.name, description: def.description, tags: def.tags || [] };
    if (def.kind === "body" && def.variations) {
      return Object.entries(def.variations).map(([vid, v]) => ({ ...base, key: `${def.id}::${vid}`, variationId: vid, name: v.label, description: v.description || def.description }));
    }
    return [{ ...base, key: def.id, variationId: null }];
  });
}
