export const EASING_OPTIONS = [
  { value: "ease-out", label: "Ease out" },
  { value: "ease-in", label: "Ease in" },
  { value: "ease-in-out", label: "Ease in-out" },
  { value: "linear", label: "Linear" },
  { value: "expo-out", label: "Expo out" },
  { value: "back-out", label: "Back out (overshoot)" },
  { value: "spring", label: "Spring" },
  { value: "custom", label: "Custom curve" },
];

const CURVES = {
  linear: "linear",
  "ease-out": [0, 0, 0.58, 1],
  "ease-in": [0.42, 0, 1, 1],
  "ease-in-out": [0.42, 0, 0.58, 1],
  "expo-out": [0.16, 1, 0.3, 1],
  "back-out": [0.34, 1.56, 0.64, 1],
};

export function baseTransition(cfg) {
  if (cfg.easing === "spring") return { type: "spring", stiffness: 140, damping: 16, mass: 0.9 };
  const ease = cfg.easing === "custom" && Array.isArray(cfg.bezier) ? cfg.bezier : CURVES[cfg.easing] ?? CURVES["ease-out"];
  return { duration: cfg.duration ?? 0.8, ease };
}