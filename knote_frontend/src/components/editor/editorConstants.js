// Shared option lists for the editor toolbar/pickers.

export const FONTS = [
  { label: "Kalam", value: "Kalam" },
  { label: "Patrick Hand", value: "Patrick Hand" },
  { label: "Caveat", value: "Caveat" },
  { label: "Shadows", value: "Shadows Into Light" },
  { label: "Typed", value: "Inter" },
];

export const FONT_SIZES = ["16px", "19px", "22px", "26px", "32px"];

// Ink palette (handwriting colors), incl. the screenshot's ink-blue.
export const INK_COLORS = [
  { label: "Ink blue", value: "#1e3a8a" },
  { label: "Charcoal", value: "#3b2e40" },
  { label: "Plum", value: "#7420b8" },
  { label: "Crimson", value: "#c93a3f" },
  { label: "Forest", value: "#2f9d6e" },
  { label: "Rust", value: "#b45309" },
  { label: "Black", value: "#241b29" },
];

// Highlight colors — warm yellow first (matches the screenshot), then pastels.
export const HIGHLIGHT_COLORS = [
  { label: "Yellow", value: "#fde68a" },
  { label: "Green", value: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe" },
  { label: "Pink", value: "#fbcfe8" },
  { label: "Orange", value: "#fed7aa" },
  { label: "Lilac", value: "#e9d5ff" },
];

export const BACKGROUNDS = [
  { key: "ruled-cream", label: "Ruled Cream", className: "paper-ruled-cream" },
  { key: "ruled-white", label: "Ruled White", className: "paper-ruled-white" },
  { key: "grid", label: "Grid", className: "paper-grid" },
  { key: "dotted", label: "Dotted", className: "paper-dotted" },
  { key: "plain-cream", label: "Plain Cream", className: "paper-plain-cream" },
  { key: "plain-white", label: "Plain White", className: "paper-plain-white" },
];

export function backgroundClass(key) {
  return BACKGROUNDS.find((b) => b.key === key)?.className || "paper-ruled-cream";
}
