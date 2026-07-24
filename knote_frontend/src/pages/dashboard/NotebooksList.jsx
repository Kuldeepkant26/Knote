import { useEffect, useState } from "react";
import { Plus, NotebookPen, Pencil } from "lucide-react";
import { useNotebooksStore } from "@/stores/notebooksStore";
import SectionHeader from "@/components/dashboard/SectionHeader";
import NotebookCard from "@/components/dashboard/NotebookCard";
import EmptyState from "@/components/dashboard/EmptyState";
import { NotebooksGridSkeleton } from "@/components/dashboard/PageSkeletons";
import Button from "@/components/ui/Button";
import NotebookFormModal from "@/components/dashboard/NotebookFormModal";

export default function NotebooksList() {
  const { notebooks, listLoaded, listLoading, fetchNotebooks, createNotebook, updateNotebook } =
    useNotebooksStore();

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null); // notebook being renamed, or null for create
  const [menuFor, setMenuFor] = useState(null);

  // Cached list renders instantly; this revalidates it in the background.
  useEffect(() => {
    fetchNotebooks();
  }, [fetchNotebooks]);

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };
  const openEdit = (nb) => {
    setEditing(nb);
    setFormOpen(true);
    setMenuFor(null);
  };

  const handleSubmit = async (values) => {
    if (editing) await updateNotebook(editing._id, values);
    else await createNotebook(values);
  };

  if (listLoading && !listLoaded) {
    return (
      <div>
        <SectionHeader title="Your notebooks" subtitle="Organize notes by skill or subject" />
        <NotebooksGridSkeleton />
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Your notebooks"
        subtitle="Organize notes by skill or subject"
        action={
          notebooks.length > 0 && (
            <Button onClick={openCreate}>
              <Plus size={18} /> New notebook
            </Button>
          )
        }
      />

      {notebooks.length === 0 ? (
        <EmptyState
          icon={NotebookPen}
          title="No notebooks yet"
          description="Create your first notebook to start taking notes on any skill or subject."
          action={
            <Button onClick={openCreate}>
              <Plus size={18} /> New notebook
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {notebooks.map((nb) => (
            <div key={nb._id} className="relative">
              <NotebookCard notebook={nb} onMenu={(e, n) => setMenuFor(menuFor === n._id ? null : n._id)} />
              {menuFor === nb._id && (
                <>
                  <div className="fixed inset-0 z-20" onClick={() => setMenuFor(null)} />
                  <div className="absolute right-3 top-12 z-30 w-40 overflow-hidden rounded-xl border border-mauve-100 bg-surface py-1 shadow-pop">
                    <button
                      onClick={() => openEdit(nb)}
                      className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-mauve-700 transition hover:bg-mauve-50"
                    >
                      <Pencil size={15} /> Rename
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}

          {/* New notebook ghost card */}
          <button
            onClick={openCreate}
            className="flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-mauve-200 text-mauve-400 transition hover:border-accent-300 hover:text-accent-600"
          >
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-mauve-50">
              <Plus size={24} />
            </span>
            <span className="font-medium">New notebook</span>
          </button>
        </div>
      )}

      <NotebookFormModal
        key={`${formOpen ? "open" : "closed"}-${editing?._id || "new"}`}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        notebook={editing}
      />
    </div>
  );
}
