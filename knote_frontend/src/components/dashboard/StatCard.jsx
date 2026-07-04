import { TrendingUp, TrendingDown } from "lucide-react";

export default function StatCard({ label, value, delta, trend, icon: Icon }) {
  const up = trend === "up";
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <span className="text-sm text-mauve-500">{label}</span>
        {Icon && (
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
            <Icon size={18} />
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-mauve-800">
        {value}
      </p>
      {delta && (
        <div
          className={`mt-1 flex items-center gap-1 text-xs font-medium ${
            up ? "text-success-600" : "text-danger-600"
          }`}
        >
          {up ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
          {delta}
        </div>
      )}
    </div>
  );
}
