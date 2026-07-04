/* eslint-disable react-refresh/only-export-components -- a TipTap node definition and its React view intentionally live together */
import { Node, mergeAttributes } from "@tiptap/core";
import { ReactNodeViewRenderer, NodeViewWrapper } from "@tiptap/react";
import { useEffect, useRef, useState } from "react";
import { Pencil, PenTool } from "lucide-react";
import ExcalidrawModal from "./ExcalidrawModal";

// React view for the diagram block: static SVG preview + "Edit diagram".
function ExcalidrawView({ node, updateAttributes, editor }) {
  const scene = node.attrs.scene;
  const previewRef = useRef(null);
  const [editing, setEditing] = useState(false);
  const [hasSvg, setHasSvg] = useState(false);

  const editable = editor.isEditable;

  useEffect(() => {
    let cancelled = false;
    async function render() {
      const host = previewRef.current;
      if (!host) return;
      host.innerHTML = "";
      if (!scene?.elements?.length) {
        setHasSvg(false);
        return;
      }
      try {
        const { exportToSvg } = await import("@excalidraw/excalidraw");
        const svg = await exportToSvg({
          elements: scene.elements,
          appState: { ...(scene.appState || {}), exportBackground: false, viewBackgroundColor: "transparent" },
          files: scene.files || {},
        });
        if (cancelled) return;
        svg.setAttribute("style", "max-width:100%;height:auto;");
        host.appendChild(svg);
        setHasSvg(true);
      } catch {
        setHasSvg(false);
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [scene]);

  return (
    <NodeViewWrapper className="excalidraw-node" contentEditable={false}>
      <div className="group relative overflow-hidden rounded-2xl border border-mauve-100 bg-surface/70">
        <div ref={previewRef} className="flex min-h-[120px] items-center justify-center p-4" />
        {!hasSvg && (
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center gap-1 text-mauve-400">
            <PenTool size={22} />
            <span className="text-sm">Empty diagram</span>
          </div>
        )}
        {editable && (
          <button
            onClick={() => setEditing(true)}
            className="absolute right-3 top-3 flex items-center gap-1.5 rounded-lg bg-surface/90 px-2.5 py-1.5 text-sm font-medium text-mauve-600 shadow-soft transition hover:text-accent-600 group-hover:opacity-100 md:opacity-0"
          >
            <Pencil size={14} /> Edit diagram
          </button>
        )}
      </div>

      {editing && (
        <ExcalidrawModal
          open={editing}
          initialScene={scene}
          onSave={(newScene) => {
            updateAttributes({ scene: newScene });
            setEditing(false);
          }}
          onClose={() => setEditing(false)}
        />
      )}
    </NodeViewWrapper>
  );
}

export const ExcalidrawBlock = Node.create({
  name: "excalidraw",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      scene: {
        default: null,
        parseHTML: (el) => {
          const raw = el.getAttribute("data-scene");
          return raw ? JSON.parse(raw) : null;
        },
        renderHTML: (attrs) => ({
          "data-scene": attrs.scene ? JSON.stringify(attrs.scene) : "",
        }),
      },
    };
  },

  parseHTML() {
    return [{ tag: 'div[data-type="excalidraw"]' }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", mergeAttributes(HTMLAttributes, { "data-type": "excalidraw" })];
  },

  addNodeView() {
    return ReactNodeViewRenderer(ExcalidrawView);
  },

  addCommands() {
    return {
      insertExcalidraw:
        (scene = null) =>
        ({ commands }) =>
          commands.insertContent({ type: this.name, attrs: { scene } }),
    };
  },
});
