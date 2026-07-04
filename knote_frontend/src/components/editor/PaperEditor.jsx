import { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyleKit } from "@tiptap/extension-text-style";
import Highlight from "@tiptap/extension-highlight";
import TextAlign from "@tiptap/extension-text-align";
import { TaskList, TaskItem } from "@tiptap/extension-list";
import { Placeholder } from "@tiptap/extensions";
import { TableKit } from "@tiptap/extension-table";
import { backgroundClass } from "./editorConstants";
import { ExcalidrawBlock } from "./ExcalidrawNode";

const extensions = [
  StarterKit.configure({
    link: { openOnClick: false, autolink: true, HTMLAttributes: { rel: "noopener noreferrer nofollow" } },
  }),
  TextStyleKit,
  Highlight.configure({ multicolor: true }),
  TextAlign.configure({ types: ["heading", "paragraph"] }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Placeholder.configure({ placeholder: "Start writing your notes…" }),
  TableKit.configure({ table: { resizable: true } }),
  ExcalidrawBlock,
];

// Autosave debounce window.
const AUTOSAVE_MS = 800;

export default function PaperEditor({ initialContent, background, font, onSave, onEditorReady }) {
  const timerRef = useRef(null);
  const latestJsonRef = useRef(null);
  const onSaveRef = useRef(onSave);

  // Keep the latest onSave without re-creating the editor.
  useEffect(() => {
    onSaveRef.current = onSave;
  }, [onSave]);

  const editor = useEditor({
    extensions,
    content: initialContent || { type: "doc", content: [{ type: "paragraph" }] },
    immediatelyRender: false, // React 19 / avoid hydration warning
    editorProps: {
      attributes: { class: "tiptap" },
    },
    onUpdate: ({ editor }) => {
      latestJsonRef.current = editor.getJSON();
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        onSaveRef.current?.(latestJsonRef.current);
      }, AUTOSAVE_MS);
    },
  });

  // Hand the editor instance up to the parent (for the Toolbar) once it exists.
  useEffect(() => {
    if (editor) onEditorReady?.(editor);
  }, [editor, onEditorReady]);

  // Flush any pending save on unmount (StrictMode-safe: only fires if a debounce is pending).
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
        if (latestJsonRef.current) onSaveRef.current?.(latestJsonRef.current);
      }
    };
  }, []);

  return (
    <div
      className={`paper mx-auto min-h-[70vh] w-full max-w-3xl rounded-2xl shadow-card ${backgroundClass(background)}`}
      style={{ ["--font-hand"]: `"${font || "Kalam"}", cursive` }}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
