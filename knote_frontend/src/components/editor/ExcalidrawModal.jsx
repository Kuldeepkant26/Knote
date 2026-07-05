import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { Loader2, X, Check } from "lucide-react";
import { useTheme } from "@/lib/theme";
import "@excalidraw/excalidraw/index.css";

// Lazy-load the heavy canvas so it's only fetched when a diagram is edited.
const Excalidraw = lazy(() =>
  import("@excalidraw/excalidraw").then((m) => ({ default: m.Excalidraw }))
);

export default function ExcalidrawModal({ open, initialScene, onSave, onClose }) {
  const apiRef = useRef(null);
  const [ready, setReady] = useState(false);
  const { isDark } = useTheme();

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  const initialData = initialScene?.elements
    ? {
        elements: initialScene.elements,
        appState: { ...(initialScene.appState || {}), viewBackgroundColor: "transparent" },
        files: initialScene.files || {},
        scrollToContent: true,
      }
    : { appState: { viewBackgroundColor: "transparent" } };

  const handleSave = () => {
    const api = apiRef.current;
    if (!api) return onClose();
    const scene = {
      type: "excalidraw",
      version: 2,
      source: "knote",
      elements: api.getSceneElements(),
      appState: { viewBackgroundColor: "transparent" },
      files: api.getFiles(),
    };
    onSave(scene);
  };

  return (
    <div className="fixed inset-0 z-[60] flex flex-col bg-ink-900/40 backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-mauve-100 bg-cream-50 px-5 py-3">
        <h2 className="font-display text-lg font-semibold text-mauve-800">Edit diagram</h2>
        <div className="flex items-center gap-2">
          <button onClick={onClose} className="btn-ghost py-2">
            <X size={18} /> Cancel
          </button>
          <button onClick={handleSave} className="btn-primary py-2">
            <Check size={18} /> Save diagram
          </button>
        </div>
      </div>
      <div className="relative flex-1">
        <Suspense
          fallback={
            <div className="flex h-full items-center justify-center text-mauve-400">
              <Loader2 className="animate-spin" />
            </div>
          }
        >
          <Excalidraw
            excalidrawAPI={(api) => {
              apiRef.current = api;
              setReady(true);
            }}
            initialData={initialData}
            theme={isDark ? "dark" : "light"}
          />
        </Suspense>
        {!ready && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-mauve-400">
            <Loader2 className="animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
