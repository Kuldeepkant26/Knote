import { Link } from "react-router-dom";
import { NotebookPen, Layers, FileText, MoreVertical } from "lucide-react";
import { timeAgo } from "@/lib/timeAgo";

const tints = {
  accent: "from-accent-400 to-accent-600",
  mauve: "from-mauve-400 to-mauve-600",
  success: "from-success-500 to-success-600",
};

const tintDots = {
  accent: "bg-accent-400",
  mauve: "bg-mauve-400",
  success: "bg-success-500",
};

// Subtle dot texture layered over the cover gradient.
const coverPattern = {
  backgroundImage: "radial-gradient(rgba(255,255,255,0.18) 1px, transparent 1px)",
  backgroundSize: "14px 14px",
};

export default function NotebookCard({ notebook, onMenu }) {
  const sections = notebook.sectionCount ?? notebook.sections?.length ?? 0;
  const pages = notebook.pageCount ?? 0;

  return (
    <div className="card group relative block overflow-hidden p-0 ring-1 ring-mauve-100 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-pop">
      <Link to={`/dashboard/notebooks/${notebook._id}`} className="block">
        {/* Cover */}
        <div
          className={`relative flex h-28 items-center justify-center bg-linear-to-br ${
            tints[notebook.tint] || tints.accent
          }`}
        >
          <div className="absolute inset-0" style={coverPattern} />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
          <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
            <NotebookPen size={24} className="text-white/90" />
          </div>
        </div>

        <div className="p-5 pb-4">
          {notebook.subject && (
            <p className="text-xs font-medium uppercase tracking-wide text-mauve-400">
              {notebook.subject}
            </p>
          )}
          <h3 className="mt-1 font-display text-lg font-semibold text-mauve-800 transition group-hover:text-accent-600">
            {notebook.title}
          </h3>
          <div className="mt-3 flex items-center gap-2 text-xs text-mauve-500">
            <span className="flex items-center gap-1 rounded-full bg-mauve-50 px-2 py-0.5">
              <Layers size={13} /> {sections} {sections === 1 ? "section" : "sections"}
            </span>
            <span className="flex items-center gap-1 rounded-full bg-mauve-50 px-2 py-0.5">
              <FileText size={13} /> {pages} {pages === 1 ? "page" : "pages"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 border-t border-mauve-100/70 px-5 py-2.5">
          <span className={`h-2 w-2 rounded-full ${tintDots[notebook.tint] || tintDots.accent}`} />
          <p className="text-xs text-mauve-400">Updated {timeAgo(notebook.updatedAt)}</p>
        </div>
      </Link>

      {onMenu && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onMenu(e, notebook);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/80 text-mauve-500 opacity-0 backdrop-blur-sm transition hover:text-mauve-800 focus-visible:opacity-100 group-hover:opacity-100"
          aria-label="Notebook options"
        >
          <MoreVertical size={16} />
        </button>
      )}
    </div>
  );
}
