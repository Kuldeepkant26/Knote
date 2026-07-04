const tones = {
  accent: "bg-accent-500",
  mauve: "bg-mauve-400",
  success: "bg-success-500",
};

export default function ProgressBar({ value = 0, tone = "accent", className = "" }) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={`h-2 w-full overflow-hidden rounded-full bg-mauve-50 ${className}`}>
      <div
        className={`h-full rounded-full transition-[width] ${tones[tone]}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
