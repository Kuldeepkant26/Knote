import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
} from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { finance } from "@/lib/mockData";

const statIcons = [Wallet, ArrowDownLeft, ArrowUpRight, PiggyBank];

const categoryTone = {
  Income: "success",
  Food: "accent",
  Utilities: "mauve",
  Entertainment: "accent",
  Education: "mauve",
};

export default function Finance() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {finance.stats.map((s, i) => (
          <StatCard key={s.label} {...s} icon={statIcons[i]} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Transactions */}
        <div className="lg:col-span-2">
          <SectionHeader title="Recent transactions" />
          <Card padding={false}>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-mauve-100 text-left text-xs uppercase tracking-wide text-mauve-400">
                    <th className="px-5 py-3 font-medium">Date</th>
                    <th className="px-5 py-3 font-medium">Description</th>
                    <th className="px-5 py-3 font-medium">Category</th>
                    <th className="px-5 py-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-mauve-100">
                  {finance.transactions.map((t) => (
                    <tr key={t.id} className="transition hover:bg-mauve-50/50">
                      <td className="whitespace-nowrap px-5 py-3.5 text-mauve-500">{t.date}</td>
                      <td className="px-5 py-3.5 font-medium text-mauve-800">{t.desc}</td>
                      <td className="px-5 py-3.5">
                        <Badge tone={categoryTone[t.category] || "mauve"}>{t.category}</Badge>
                      </td>
                      <td
                        className={`whitespace-nowrap px-5 py-3.5 text-right font-semibold ${
                          t.amount >= 0 ? "text-success-600" : "text-mauve-800"
                        }`}
                      >
                        {t.amount >= 0 ? "+" : "−"}${Math.abs(t.amount).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Category breakdown */}
        <div>
          <SectionHeader title="Spending by category" />
          <Card className="space-y-5">
            {finance.breakdown.map((c) => (
              <div key={c.category}>
                <div className="mb-1.5 flex items-center justify-between text-sm">
                  <span className="font-medium text-mauve-700">{c.category}</span>
                  <span className="text-mauve-400">{c.amount}</span>
                </div>
                <ProgressBar value={c.pct} tone="accent" />
              </div>
            ))}
          </Card>
        </div>
      </div>
    </div>
  );
}
