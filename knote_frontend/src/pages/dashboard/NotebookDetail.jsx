import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, Plus, Info, NotebookPen } from "lucide-react";
import { useNotebooksStore } from "@/stores/notebooksStore";
import SectionColumn from "@/components/dashboard/SectionColumn";
import EmptyState from "@/components/dashboard/EmptyState";
import { NotebookDetailSkeleton } from "@/components/dashboard/PageSkeletons";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";
import TextField from "@/components/ui/TextField";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import { BACKGROUNDS } from "@/components/editor/editorConstants";

export default function NotebookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    current,
    currentLoading,
    fetchNotebook,
    clearCurrent,
    addSection,
    deleteSection,
    createPage,
    deletePage,
  } = useNotebooksStore();

  const [notFound, setNotFound] = useState(false);
  const [sectionModalOpen, setSectionModalOpen] = useState(false);
  const [sectionTitle, setSectionTitle] = useState("");
  const [savingSection, setSavingSection] = useState(false);
  const [deletingSection, setDeletingSection] = useState(null);
  const [creatingPageFor, setCreatingPageFor] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setNotFound(false);
      try {
        await fetchNotebook(id);
      } catch {
        if (!cancelled) setNotFound(true);
      }
    }
    load();
    return () => {
      cancelled = true;
      clearCurrent();
    };
  }, [id, fetchNotebook, clearCurrent]);

  const handleAddSection = async (e) => {
    e.preventDefault();
    if (!sectionTitle.trim()) return;
    setSavingSection(true);
    try {
      await addSection(id, sectionTitle.trim());
      setSectionTitle("");
      setSectionModalOpen(false);
    } finally {
      setSavingSection(false);
    }
  };

  const handleNewPage = async (sectionId) => {
    setCreatingPageFor(sectionId);
    try {
      // New pages start with the user's last-picked background.
      const lastBg = localStorage.getItem("knote-default-bg");
      const background = BACKGROUNDS.some((b) => b.key === lastBg) ? lastBg : undefined;
      const page = await createPage({ notebook: id, sectionId, title: "Untitled page", background });
      navigate(`/dashboard/notebooks/${id}/pages/${page._id}`);
    } finally {
      setCreatingPageFor(null);
    }
  };

  if (notFound) {
    return (
      <EmptyState
        icon={NotebookPen}
        title="Notebook not found"
        description="This notebook doesn't exist or may have been removed."
        action={
          <Link to="/dashboard/notebooks" className="btn-primary">
            Back to notebooks
          </Link>
        }
      />
    );
  }

  if (currentLoading && !current) return <NotebookDetailSkeleton />;
  if (!current) return null;

  const pageCount = current.pages?.length || 0;

  return (
    <div>
      {/* Breadcrumb */}
      <nav className="mb-2 flex items-center gap-1.5 text-sm text-mauve-400">
        <Link to="/dashboard/notebooks" className="transition hover:text-accent-600">
          Notebooks
        </Link>
        <ChevronRight size={14} />
        <span className="font-medium text-mauve-600">{current.title}</span>
      </nav>

      {/* Header */}
      <div className="mb-4 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-semibold text-mauve-800">{current.title}</h1>
          <p className="mt-1 text-sm text-mauve-500">
            {current.subject ? `${current.subject} · ` : ""}
            {current.sections.length} sections · {pageCount} pages
          </p>
        </div>
        <Button onClick={() => setSectionModalOpen(true)}>
          <Plus size={18} /> New section
        </Button>
      </div>

      {/* Hierarchy hint */}
      <div className="mb-6 flex items-center gap-2 rounded-xl bg-accent-50/60 px-4 py-2.5 text-sm text-mauve-600">
        <Info size={16} className="shrink-0 text-accent-500" />
        Each <strong className="font-semibold text-mauve-800">section</strong> below is a column; the
        cards inside are its <strong className="font-semibold text-mauve-800">pages</strong>.
      </div>

      {/* Sections as columns */}
      <div className="flex gap-5 overflow-x-auto pb-4">
        {current.sections.map((section) => (
          <SectionColumn
            key={section._id}
            section={section}
            pages={current.pages.filter((p) => String(p.sectionId) === String(section._id))}
            notebookId={id}
            creatingPage={creatingPageFor === section._id}
            onNewPage={() => handleNewPage(section._id)}
            onDeleteSection={() => setDeletingSection(section)}
            onDeletePage={(pageId) => deletePage(pageId, id)}
          />
        ))}

        {/* Add section column */}
        <button
          onClick={() => setSectionModalOpen(true)}
          className="flex h-fit w-80 shrink-0 items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed border-mauve-200 py-4 text-sm font-medium text-mauve-400 transition hover:border-accent-300 hover:text-accent-600"
        >
          <Plus size={16} /> Add section
        </button>
      </div>

      {/* New section modal */}
      <Modal open={sectionModalOpen} onClose={() => setSectionModalOpen(false)} title="New section">
        <form onSubmit={handleAddSection} className="space-y-4">
          <TextField
            id="section-title"
            label="Section title"
            placeholder="e.g. Hooks"
            value={sectionTitle}
            onChange={(e) => setSectionTitle(e.target.value)}
            autoFocus
          />
          <div className="flex justify-end gap-3">
            <Button variant="ghost" type="button" onClick={() => setSectionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" loading={savingSection}>
              Add section
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete section confirm */}
      <ConfirmDialog
        open={!!deletingSection}
        onClose={() => setDeletingSection(null)}
        onConfirm={() => deleteSection(id, deletingSection._id)}
        title="Delete section?"
        message={`"${deletingSection?.title}" and all its pages will be permanently deleted.`}
        confirmLabel="Delete section"
      />
    </div>
  );
}
