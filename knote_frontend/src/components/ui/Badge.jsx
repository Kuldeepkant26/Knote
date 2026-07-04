const tones = {
  accent: "bg-accent-50 text-accent-700",
  mauve: "bg-mauve-50 text-mauve-600",
  success: "bg-success-50 text-success-600",
  danger: "bg-danger-50 text-danger-600",
};

export default function Badge({ children, tone = "mauve", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
