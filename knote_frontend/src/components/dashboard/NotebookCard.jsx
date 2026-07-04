import { Link } from "react-router-dom";
import { NotebookPen, Layers, FileText, MoreVertical } from "lucide-react";
import { timeAgo } from "@/lib/timeAgo";

const tints = {
  accent: "from-accent-400 to-accent-600",
  mauve: "from-mauve-400 to-mauve-600",
  success: "from-success-500 to-success-600",
};

export default function NotebookCard({ notebook, onMenu }) {
  const sections = notebook.sectionCount ?? notebook.sections?.length ?? 0;
  const pages = notebook.pageCount ?? 0;

  return (
    <div className="card group relative block overflow-hidden p-0 transition hover:shadow-pop">
      <Link to={`/dashboard/notebooks/${notebook._id}`} className="block">
        {/* Cover swatch */}
        <div
          className={`flex h-24 items-center justify-center bg-linear-to-br ${
            tints[notebook.tint] || tints.accent
          }`}
        >
          <NotebookPen size={28} className="text-white/90" />
        </div>
        <div className="p-5">
          {notebook.subject && (
            <p className="text-xs font-medium uppercase tracking-wide text-mauve-400">
              {notebook.subject}
            </p>
          )}
          <h3 className="mt-1 font-display text-lg font-semibold text-mauve-800 transition group-hover:text-accent-600">
            {notebook.title}
          </h3>
          <div className="mt-3 flex items-center gap-4 text-xs text-mauve-500">
            <span className="flex items-center gap-1">
              <Layers size={14} /> {sections} {sections === 1 ? "section" : "sections"}
            </span>
            <span className="flex items-center gap-1">
              <FileText size={14} /> {pages} {pages === 1 ? "page" : "pages"}
            </span>
          </div>
          <p className="mt-2 text-xs text-mauve-400">Updated {timeAgo(notebook.updatedAt)}</p>
        </div>
      </Link>

      {onMenu && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onMenu(e, notebook);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg bg-surface/80 text-mauve-500 opacity-0 transition hover:text-mauve-800 group-hover:opacity-100"
          aria-label="Notebook options"
        >
          <MoreVertical size={16} />
        </button>
      )}
    </div>
  );
}
