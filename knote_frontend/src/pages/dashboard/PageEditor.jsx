import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ChevronRight, ChevronLeft, Pencil, Lock } from "lucide-react";
import { pageApi } from "@/services/pageApi";
import { useNotebooksStore } from "@/stores/notebooksStore";
import PaperEditor from "@/components/editor/PaperEditor";
import Toolbar from "@/components/editor/Toolbar";
import SaveIndicator from "@/components/editor/SaveIndicator";
import ZoomControls, { clampZoom, ZOOM_STEP } from "@/components/editor/ZoomControls";
import { PageEditorSkeleton } from "@/components/dashboard/PageSkeletons";
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
  const [zoom, setZoom] = useState(1); // session-only, resets per page
  const [editable, setEditable] = useState(true);

  // Cmd/Ctrl +/-/0 zoom the page instead of the browser while editing.
  useEffect(() => {
    const onKey = (e) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      if (e.key === "=" || e.key === "+") {
        e.preventDefault();
        setZoom((z) => clampZoom(z + ZOOM_STEP));
      } else if (e.key === "-") {
        e.preventDefault();
        setZoom((z) => clampZoom(z - ZOOM_STEP));
      } else if (e.key === "0") {
        e.preventDefault();
        setZoom(1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setZoom(1);
  }, [pageId]);

  // Set once the user edits this page; blocks background revalidation from
  // replacing the editor content underneath them.
  const dirtyRef = useRef(false);

  // Load page + notebook (for the breadcrumb) whenever the route changes.
  // Cached copies render instantly; fresh data is fetched in the background.
  useEffect(() => {
    let cancelled = false;
    dirtyRef.current = false;

    const { pageCache, notebookCache, fetchPage, loadNotebook } = useNotebooksStore.getState();
    const cachedPage = pageCache[pageId];
    const cachedNotebook = notebookCache[notebookId];
    const hasCache = !!(cachedPage && cachedNotebook);

    async function load() {
      setNotFound(false);
      if (hasCache) {
        setPage(cachedPage);
        setTitle(cachedPage.title);
        setNotebook(cachedNotebook);
        setLoading(false);
      } else {
        setLoading(true);
      }

      try {
        const [freshPage, freshNotebook] = await Promise.all([
          fetchPage(pageId),
          loadNotebook(notebookId),
        ]);
        if (cancelled) return;
        setNotebook(freshNotebook);
        if (!dirtyRef.current) {
          setPage(freshPage);
          setTitle(freshPage.title);
        }
        setLoading(false);
      } catch {
        if (!cancelled && !hasCache) setNotFound(true);
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
        useNotebooksStore.getState().updatePageCache(pageId, patch);
        setSaveStatus("saved");
      } catch {
        setSaveStatus("error");
      }
    },
    [pageId]
  );

  const handleSaveContent = useCallback((content) => persist({ content }), [persist]);

  // Fires on the first real keystroke (before the autosave debounce), so
  // background revalidation can't replace content the user is editing.
  const handleDirty = useCallback(() => {
    dirtyRef.current = true;
  }, []);

  const handleBackgroundChange = (background) => {
    dirtyRef.current = true;
    setPage((p) => ({ ...p, background }));
    persist({ background });
    // Remember the choice so new pages start with the last-used background.
    localStorage.setItem("knote-default-bg", background);
  };

  const handleTitleBlur = () => {
    const trimmed = title.trim() || "Untitled page";
    if (trimmed !== page.title) {
      dirtyRef.current = true;
      setPage((p) => ({ ...p, title: trimmed }));
      persist({ title: trimmed });
    }
    setTitle(trimmed);
  };

  if (loading) return <PageEditorSkeleton />;
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
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setEditable((e) => !e)}
            aria-label={editable ? "Lock editing" : "Enable editing"}
            data-tip={editable ? "Lock editing" : "Enable editing"}
            className={`tt flex h-8 items-center gap-1.5 rounded-lg border px-2.5 text-xs font-medium transition ${
              editable
                ? "border-mauve-100 bg-surface text-mauve-500 hover:text-mauve-800"
                : "border-accent-300 bg-accent-50 text-accent-600"
            }`}
          >
            {editable ? <Pencil size={14} /> : <Lock size={14} />}
            {editable ? "Editing" : "Read-only"}
          </button>
          <ZoomControls zoom={zoom} onChange={setZoom} />
          <SaveIndicator status={saveStatus} />
        </div>
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
      <div
        className={`sticky top-0 z-20 mb-4 bg-cream-50/80 py-1 backdrop-blur ${
          editable ? "" : "pointer-events-none opacity-50"
        }`}
      >
        <Toolbar editor={editor} background={page.background} onBackgroundChange={handleBackgroundChange} />
      </div>

      {/* Paper (CSS zoom participates in layout, unlike transform: scale) */}
      <div className="flex-1 pb-10" style={{ zoom }}>
        <PaperEditor
          key={`${page._id}:${page.updatedAt}`}
          initialContent={page.content}
          background={page.background}
          font={page.defaultFont}
          editable={editable}
          onSave={handleSaveContent}
          onDirty={handleDirty}
          onEditorReady={setEditor}
        />
      </div>
    </div>
  );
}
