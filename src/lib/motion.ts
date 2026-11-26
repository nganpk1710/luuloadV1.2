/** Motion tokens dùng chung (docs/MOTION.md mục 0). */
export const ease = {
  out: [0.22, 1, 0.36, 1],
  inOut: [0.65, 0, 0.35, 1],
} as const;

export const easeCss = {
  out: "cubic-bezier(0.22, 1, 0.36, 1)",
  inOut: "cubic-bezier(0.65, 0, 0.35, 1)",
  /** Gần đúng spring có overshoot nhẹ, cho hiệu ứng CSS thuần. */
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
} as const;

export const spring = { type: "spring", stiffness: 420, damping: 28, mass: 0.8 } as const;

export function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function canHover() {
  return typeof window !== "undefined" && window.matchMedia("(hover: hover)").matches;
}
