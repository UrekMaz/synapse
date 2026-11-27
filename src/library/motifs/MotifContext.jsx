import { createContext, useContext } from "react";
import MotifLayer from "./Motifs.jsx";

// Page level: resolved experience + the page's section order (for "between sections" seams).
export const ExperienceContext = createContext(null);
export const useExperience = () => useContext(ExperienceContext);

// Section level: the motifs that apply to the section being rendered.
export const SectionMotifContext = createContext(null);

const reduced = () => typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
export function motifMotion(ctx) {
  if (!ctx?.exp?.motion.enabled) return false;
  return ctx.editor || !reduced();
}

/*
 * Drop-in slot for a section's background motifs. Sections render it between their background and their
 * content (content layers sit at z-index ≥ 2), so motifs decorate without covering text or controls.
 */
export function SectionMotifs({ bp = "desktop" }) {
  const s = useContext(SectionMotifContext);
  if (!s?.back.length) return null;
  return <MotifLayer motifs={s.back} motion={s.motion} bp={bp} style={{ zIndex: 1 }} />;
}
