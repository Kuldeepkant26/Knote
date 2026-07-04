import { useRef, useState } from "react";
import { Plus, MoreVertical, Trash2, Loader2, FileText } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import PageCard from "./PageCard";

// A Section rendered as a column; its Pages are the cards inside it.
export default function SectionColumn({
  section,
  pages = [],
  notebookId,
  creatingPage,
  onNewPage,
  onDeleteSection,
  onDeletePage,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  return (
    <div className="flex w-80 shrink-0 flex-col rounded-2xl bg-cream-100/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-mauve-800">{section.title}</h3>
          <span className="rounded-full bg-mauve-100 px-2 py-0.5 text-xs font-medium text-mauve-500">
            {pages.length}
          </span>
        </div>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-mauve-400 transition hover:bg-mauve-100 hover:text-mauve-700"
            aria-label="Section options"
          >
            <MoreVertical size={16} />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 z-30 w-36 overflow-hidden rounded-xl border border-mauve-100 bg-surface py-1 shadow-pop">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  onDeleteSection?.();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-danger-600 transition hover:bg-danger-50"
              >
                <Trash2 size={15} /> Delete
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {pages.map((page) => (
          <PageCard key={page._id} page={page} notebookId={notebookId} onDelete={onDeletePage} />
        ))}

        {pages.length === 0 && (
          <div className="flex flex-col items-center gap-1 rounded-xl border border-dashed border-mauve-200 py-6 text-mauve-300">
            <FileText size={18} />
            <span className="text-xs">No pages yet</span>
          </div>
        )}

        <button
          onClick={onNewPage}
          disabled={creatingPage}
          className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-dashed border-mauve-200 py-2.5 text-sm font-medium text-mauve-400 transition hover:border-accent-200 hover:text-accent-600 disabled:opacity-60"
        >
          {creatingPage ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          New page
        </button>
      </div>
    </div>
  );
}
