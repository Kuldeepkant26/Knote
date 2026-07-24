import { Plus, Loader2, FileText } from "lucide-react";
import PageCard from "./PageCard";

// A Section rendered as a column; its Pages are the cards inside it.
export default function SectionColumn({ section, pages = [], notebookId, creatingPage, onNewPage }) {
  return (
    <div className="flex w-80 shrink-0 flex-col rounded-2xl bg-cream-100/70 p-4">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-mauve-800">{section.title}</h3>
          <span className="rounded-full bg-mauve-100 px-2 py-0.5 text-xs font-medium text-mauve-500">
            {pages.length}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {pages.map((page) => (
          <PageCard key={page._id} page={page} notebookId={notebookId} />
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
