import { useEffect, useMemo, useState } from "react";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  PiggyBank,
  Plus,
  Trash2,
} from "lucide-react";
import { useTransactionsStore } from "@/stores/transactionsStore";
import StatCard from "@/components/dashboard/StatCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import Badge from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/dashboard/EmptyState";
import { FinanceSkeleton } from "@/components/dashboard/PageSkeletons";
import TransactionFormModal from "@/components/dashboard/TransactionFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const categoryTone = {
  Income: "success",
  Food: "accent",
  Utilities: "mauve",
  Entertainment: "accent",
  Education: "mauve",
  Transport: "mauve",
  Health: "accent",
  Other: "mauve",
};

function isSameMonth(dateStr, ref) {
  const d = new Date(dateStr);
  return d.getFullYear() === ref.getFullYear() && d.getMonth() === ref.getMonth();
}

export default function Finance() {
  const {
    transactions,
    listLoaded,
    listLoading,
    fetchTransactions,
    createTransaction,
    deleteTransaction,
  } = useTransactionsStore();

  const [formOpen, setFormOpen] = useState(false);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!listLoaded) fetchTransactions();
  }, [listLoaded, fetchTransactions]);

  const { stats, breakdown } = useMemo(() => {
    const now = new Date();
    const balance = transactions.reduce((sum, t) => sum + t.amount, 0);
    const monthTxns = transactions.filter((t) => isSameMonth(t.date, now));
    const income = monthTxns.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0);
    const spending = monthTxns.filter((t) => t.amount < 0).reduce((sum, t) => sum + t.amount, 0);
    const savingsRate = income > 0 ? ((income + spending) / income) * 100 : 0;

    const spendingByCategory = new Map();
    let totalSpending = 0;
    for (const t of transactions) {
      if (t.amount >= 0) continue;
      const abs = Math.abs(t.amount);
      totalSpending += abs;
      spendingByCategory.set(t.category, (spendingByCategory.get(t.category) || 0) + abs);
    }
    const breakdown = Array.from(spendingByCategory.entries())
      .map(([category, amount]) => ({
        category,
        amount: `$${amount.toFixed(2)}`,
        pct: totalSpending > 0 ? Math.round((amount / totalSpending) * 100) : 0,
      }))
      .sort((a, b) => b.pct - a.pct);

    return {
      stats: [
        { label: "Balance", value: `$${balance.toFixed(2)}`, icon: Wallet },
        { label: "Income (month)", value: `$${income.toFixed(2)}`, icon: ArrowDownLeft, trend: "up" },
        { label: "Spending (month)", value: `$${Math.abs(spending).toFixed(2)}`, icon: ArrowUpRight, trend: "down" },
        { label: "Savings rate", value: `${savingsRate.toFixed(0)}%`, icon: PiggyBank, trend: savingsRate >= 0 ? "up" : "down" },
      ],
      breakdown,
    };
  }, [transactions]);

  if (listLoading && !listLoaded) {
    return (
      <div>
        <SectionHeader title="Finance" subtitle="Track your income and spending" />
        <FinanceSkeleton />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SectionHeader
        title="Finance"
        subtitle="Track your income and spending"
        action={
          transactions.length > 0 && (
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={18} /> Add transaction
            </Button>
          )
        }
      />

      {transactions.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="No transactions yet"
          description="Add your first income or expense to start tracking your finances."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={18} /> Add transaction
            </Button>
          }
        />
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s) => (
              <StatCard key={s.label} {...s} />
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
                        <th className="px-2 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-mauve-100">
                      {transactions.map((t) => (
                        <tr key={t._id} className="group transition hover:bg-mauve-50/50">
                          <td className="whitespace-nowrap px-5 py-3.5 text-mauve-500">
                            {new Date(t.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                          </td>
                          <td className="px-5 py-3.5 font-medium text-mauve-800">{t.description}</td>
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
                          <td className="px-2 py-3.5 text-right">
                            <button
                              onClick={() => setDeleting(t)}
                              className="rounded-lg p-1.5 text-mauve-300 opacity-0 transition hover:bg-danger-50 hover:text-danger-600 group-hover:opacity-100"
                              aria-label="Delete transaction"
                            >
                              <Trash2 size={15} />
                            </button>
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
                {breakdown.length === 0 ? (
                  <p className="text-sm text-mauve-400">No expenses yet.</p>
                ) : (
                  breakdown.map((c) => (
                    <div key={c.category}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="font-medium text-mauve-700">{c.category}</span>
                        <span className="text-mauve-400">{c.amount}</span>
                      </div>
                      <ProgressBar value={c.pct} tone="accent" />
                    </div>
                  ))
                )}
              </Card>
            </div>
          </div>
        </>
      )}

      <TransactionFormModal
        key={formOpen ? "open" : "closed"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createTransaction}
        transaction={null}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteTransaction(deleting._id)}
        title="Delete transaction?"
        message={`"${deleting?.description}" will be permanently deleted.`}
        confirmLabel="Delete transaction"
      />
    </div>
  );
}
