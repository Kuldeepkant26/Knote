import { useEffect, useState } from "react";
import { ExternalLink, Plus, Bookmark, Pencil, Trash2 } from "lucide-react";
import { useBookmarksStore } from "@/stores/bookmarksStore";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/dashboard/EmptyState";
import BookmarkFormModal from "@/components/dashboard/BookmarkFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

function normalizeUrl(url) {
  return url.includes("://") ? url : `https://${url}`;
}

export default function Bookmarks() {
  const { bookmarks, listLoaded, listLoading, fetchBookmarks, createBookmark, updateBookmark, deleteBookmark } =
    useBookmarksStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!listLoaded) fetchBookmarks();
  }, [listLoaded, fetchBookmarks]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (bm) => {
    setEditing(bm);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    if (editing) await updateBookmark(editing._id, values);
    else await createBookmark(values);
  };

  if (listLoading && !listLoaded) {
    return (
      <div>
        <SectionHeader title="Bookmarks" subtitle="Saved links and resources per subject" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2" role="status" aria-label="Loading bookmarks">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="card h-24 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Bookmarks"
        subtitle="Saved links and resources per subject"
        action={
          bookmarks.length > 0 && (
            <Button onClick={openCreate}>
              <Plus size={18} /> Add bookmark
            </Button>
          )
        }
      />

      {bookmarks.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title="No bookmarks yet"
          description="Save links and resources you want to come back to."
          action={
            <Button onClick={openCreate}>
              <Plus size={18} /> Add bookmark
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {bookmarks.map((bm) => (
            <Card key={bm._id} className="group flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
                <Bookmark size={18} />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-medium text-mauve-800">{bm.title}</h3>
                  <div className="flex shrink-0 items-center gap-1">
                    <a
                      href={normalizeUrl(bm.url)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg p-1 text-mauve-300 transition hover:bg-mauve-50 hover:text-mauve-600"
                      aria-label="Open link"
                    >
                      <ExternalLink size={15} />
                    </a>
                    <button
                      onClick={() => openEdit(bm)}
                      className="rounded-lg p-1 text-mauve-300 opacity-0 transition hover:bg-mauve-50 hover:text-mauve-600 group-hover:opacity-100"
                      aria-label="Edit bookmark"
                    >
                      <Pencil size={15} />
                    </button>
                    <button
                      onClick={() => setDeleting(bm)}
                      className="rounded-lg p-1 text-mauve-300 opacity-0 transition hover:bg-danger-50 hover:text-danger-600 group-hover:opacity-100"
                      aria-label="Delete bookmark"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
                <p className="mt-0.5 truncate text-sm text-mauve-400">{bm.url}</p>
                {bm.subject && (
                  <div className="mt-2">
                    <Badge tone="mauve">{bm.subject}</Badge>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      <BookmarkFormModal
        key={`${formOpen ? "open" : "closed"}-${editing?._id || "new"}`}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        bookmark={editing}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteBookmark(deleting._id)}
        title="Delete bookmark?"
        message={`"${deleting?.title}" will be permanently deleted.`}
        confirmLabel="Delete bookmark"
      />
    </div>
  );
}
