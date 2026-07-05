import { useEffect } from "react";
import { Link } from "react-router-dom";
import { NotebookPen, FileText, ListChecks, Flame, ArrowRight, FileClock, Plus } from "lucide-react";
import StatCard from "@/components/dashboard/StatCard";
import SectionHeader from "@/components/dashboard/SectionHeader";
import NotebookCard from "@/components/dashboard/NotebookCard";
import { NotebookCardSkeleton } from "@/components/dashboard/PageSkeletons";
import Card from "@/components/dashboard/Card";
import EmptyState from "@/components/dashboard/EmptyState";
import { useNotebooksStore } from "@/stores/notebooksStore";
import { recentPages, activity } from "@/lib/mockData";

const stats = [
  { label: "Notebooks", value: "4", delta: "+1 this week", trend: "up", icon: NotebookPen },
  { label: "Pages", value: "14", delta: "+3 this week", trend: "up", icon: FileText },
  { label: "Tasks due", value: "5", delta: "2 today", trend: "down", icon: ListChecks },
  { label: "Study streak", value: "7 days", delta: "+1", trend: "up", icon: Flame },
];

export default function DashboardHome() {
  const { notebooks, listLoaded, fetchNotebooks } = useNotebooksStore();

  useEffect(() => {
    if (!listLoaded) fetchNotebooks();
  }, [listLoaded, fetchNotebooks]);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="font-display text-2xl font-semibold text-mauve-800">
          Good to see you again
        </h1>
        <p className="mt-1 text-mauve-500">Here&apos;s what&apos;s happening across your notes.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <StatCard key={s.label} {...s} />
        ))}
      </div>

      {/* Two-column region */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SectionHeader
            title="Recent notebooks"
            action={
              <Link
                to="/dashboard/notebooks"
                className="flex items-center gap-1 text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                View all <ArrowRight size={16} />
              </Link>
            }
          />
          {!listLoaded ? (
            <div
              className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              role="status"
              aria-label="Loading notebooks"
            >
              {Array.from({ length: 4 }, (_, i) => (
                <NotebookCardSkeleton key={i} />
              ))}
            </div>
          ) : notebooks.length === 0 ? (
            <EmptyState
              icon={NotebookPen}
              title="No notebooks yet"
              description="Create your first notebook to start taking notes."
              action={
                <Link to="/dashboard/notebooks" className="btn-primary">
                  <Plus size={18} /> New notebook
                </Link>
              }
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {notebooks.slice(0, 4).map((nb) => (
                <NotebookCard key={nb._id} notebook={nb} />
              ))}
            </div>
          )}
        </div>

        {/* Right rail */}
        <div className="space-y-8">
          <div>
            <SectionHeader title="Recent pages" />
            <Card padding={false} className="divide-y divide-mauve-100">
              {recentPages.map((p) => (
                <div
                  key={p.id}
                  className="flex items-start gap-3 px-5 py-3.5 transition hover:bg-mauve-50/50"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600">
                    <FileText size={16} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-mauve-800">{p.title}</p>
                    <p className="truncate text-xs text-mauve-400">
                      {p.notebook} · {p.updatedAt}
                    </p>
                  </div>
                </div>
              ))}
            </Card>
          </div>

          <div>
            <SectionHeader title="Activity" />
            <Card padding={false} className="p-5">
              <ol className="space-y-4">
                {activity.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-mauve-50 text-mauve-400">
                      <FileClock size={14} />
                    </span>
                    <div>
                      <p className="text-sm text-mauve-700">{a.text}</p>
                      <p className="text-xs text-mauve-400">{a.time}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
