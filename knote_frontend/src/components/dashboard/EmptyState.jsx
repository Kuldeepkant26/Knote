export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-mauve-200 bg-cream-100/50 px-6 py-12 text-center">
      {Icon && (
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-mauve-50 text-mauve-400">
          <Icon size={24} />
        </div>
      )}
      <h3 className="font-medium text-mauve-700">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-mauve-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
