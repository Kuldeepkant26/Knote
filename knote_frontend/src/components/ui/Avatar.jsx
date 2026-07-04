function initials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

const sizes = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

export default function Avatar({ name, size = "md", className = "" }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-accent-50 font-semibold text-accent-600 ${sizes[size]} ${className}`}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
