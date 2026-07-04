import { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { pageApi } from "@/services/pageApi";
import { notebookApi } from "@/services/notebookApi";
import PaperEditor from "@/components/editor/PaperEditor";
import Toolbar from "@/components/editor/Toolbar";
import SaveIndicator from "@/components/editor/SaveIndicator";
import FullPageLoader from "@/components/ui/FullPageLoader";
import EmptyState from "@/components/dashboard/EmptyState";
import { FileX } from "lucide-react";

export default function PageEditor() {
  const { notebookId, pageId } = useParams();
  const navigate = useNavigate();

  const [editor, setEditor] = useState(null);
  const [page, setPage] = useState(null);
  const [notebook, setNotebook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [saveStatus, setSaveStatus] = useState("saved"); // saved | saving | error
  const [title, setTitle] = useState("");

  // Fetch page + notebook (for the breadcrumb) whenever the route changes.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setNotFound(false);
      try {
        const [{ page }, { notebook }] = await Promise.all([
          pageApi.get(pageId),
          notebookApi.get(notebookId),
        ]);
        if (cancelled) return;
        setPage(page);
        setTitle(page.title);
        setNotebook(notebook);
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [pageId, notebookId]);

  const persist = useCallback(
    async (patch) => {
      setSaveStatus("saving");
      try {
        await pageApi.update(pageId, patch);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    },
    [pageId]
  );

  const handleSaveContent = useCallback((content) => persist({ content }), [persist]);

  const handleBackgroundChange = (background) => {
    setPage((p) => ({ ...p, background }));
    persist({ background });
  };

  const handleTitleBlur = () => {
    const trimmed = title.trim() || "Untitled page";
    if (trimmed !== page.title) {
      setPage((p) => ({ ...p, title: trimmed }));
      persist({ title: trimmed });
    }
    setTitle(trimmed);
  };

  if (loading) return <FullPageLoader />;
  if (notFound) {
    return (
      <EmptyState
        icon={FileX}
        title="Page not found"
        description="This page may have been deleted."
        action={
          <Link to={`/dashboard/notebooks/${notebookId}`} className="btn-primary">
            Back to notebook
          </Link>
        }
      />
    );
  }

  const section = notebook?.sections?.find((s) => String(s._id) === String(page.sectionId));

  return (
    <div className="flex h-full flex-col">
      {/* Breadcrumb + save status */}
      <div className="mb-3 flex items-center justify-between gap-4">
        <nav className="flex min-w-0 items-center gap-1.5 text-sm text-mauve-400">
          <Link to="/dashboard/notebooks" className="transition hover:text-accent-600">
            Notebooks
          </Link>
          <ChevronRight size={14} />
          <Link to={`/dashboard/notebooks/${notebookId}`} className="truncate transition hover:text-accent-600">
            {notebook?.title}
          </Link>
          {section && (
            <>
              <ChevronRight size={14} />
              <span className="truncate text-mauve-500">{section.title}</span>
            </>
          )}
        </nav>
        <SaveIndicator status={saveStatus} />
      </div>

      {/* Title */}
      <div className="mb-3 flex items-center gap-3">
        <button
          onClick={() => navigate(`/dashboard/notebooks/${notebookId}`)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-mauve-500 transition hover:bg-mauve-50 hover:text-mauve-800"
          title="Back to notebook"
        >
          <ChevronLeft size={20} />
        </button>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onBlur={handleTitleBlur}
          className="w-full bg-transparent font-display text-2xl font-semibold text-mauve-800 outline-none placeholder:text-mauve-300"
          placeholder="Page title"
        />
      </div>

      {/* Toolbar (background picker lives inside it, always on the same row) */}
      <div className="sticky top-0 z-20 mb-4 bg-cream-50/80 py-1 backdrop-blur">
        <Toolbar editor={editor} background={page.background} onBackgroundChange={handleBackgroundChange} />
      </div>

      {/* Paper */}
      <div className="flex-1 pb-10">
        <PaperEditor
          key={page._id}
          initialContent={page.content}
          background={page.background}
          font={page.defaultFont}
          onSave={handleSaveContent}
          onEditorReady={setEditor}
        />
      </div>
    </div>
  );
}
