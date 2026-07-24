import { Link } from "react-router-dom";
import { timeAgo } from "@/lib/timeAgo";

export default function PageCard({ page, notebookId }) {
  return (
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
  );
}
