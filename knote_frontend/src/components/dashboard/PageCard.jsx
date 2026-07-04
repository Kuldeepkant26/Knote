import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { timeAgo } from "@/lib/timeAgo";

export default function PageCard({ page, notebookId, onDelete }) {
  return (
    <div className="group relative">
      <Link
        to={`/dashboard/notebooks/${notebookId}/pages/${page._id}`}
        className="card block cursor-pointer p-4 shadow-soft transition hover:shadow-card"
      >
        <h4 className="pr-6 font-medium text-mauve-800">{page.title}</h4>
        {page.preview && (
          <p className="mt-1.5 line-clamp-2 text-sm text-mauve-500">{page.preview}</p>
        )}
        <p className="mt-3 text-xs text-mauve-400">Updated {timeAgo(page.updatedAt)}</p>
      </Link>
      {onDelete && (
        <button
          onClick={(e) => {
            e.preventDefault();
            onDelete(page._id);
          }}
          className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg text-mauve-400 opacity-0 transition hover:bg-danger-50 hover:text-danger-600 group-hover:opacity-100"
          aria-label="Delete page"
        >
          <Trash2 size={15} />
        </button>
      )}
    </div>
  );
}
