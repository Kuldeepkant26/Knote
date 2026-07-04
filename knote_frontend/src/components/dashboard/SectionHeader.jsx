export default function SectionHeader({ title, subtitle, action, className = "" }) {
  return (
    <div className={`mb-4 flex items-end justify-between gap-4 ${className}`}>
      <div>
        <h2 className="font-display text-lg font-semibold text-mauve-800">{title}</h2>
        {subtitle && <p className="mt-0.5 text-sm text-mauve-500">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
