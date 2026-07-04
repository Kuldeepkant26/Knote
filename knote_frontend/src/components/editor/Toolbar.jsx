import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  ListChecks,
  Quote,
  Code2,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link2,
  Link2Off,
  Undo2,
  Redo2,
  Type,
  Baseline,
  Highlighter,
  PenTool,
  Table2,
  Rows3,
  Columns3,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import ToolbarPopover from "./ToolbarPopover";
import BackgroundPicker from "./BackgroundPicker";
import LinkDialog from "./LinkDialog";
import { FONTS, FONT_SIZES, INK_COLORS, HIGHLIGHT_COLORS } from "./editorConstants";

function Btn({ onClick, active, disabled, title, children }) {
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // keep editor selection
      onClick={onClick}
      disabled={disabled}
      aria-label={title}
      data-tip={title}
      className={`tt flex h-9 w-9 items-center justify-center rounded-lg transition disabled:opacity-40 ${
        active ? "bg-accent-50 text-accent-600" : "text-mauve-600 hover:bg-mauve-50 hover:text-mauve-800"
      }`}
    >
      {children}
    </button>
  );
}

// Buttons cluster into groups that wrap as a unit, so a line break never
// strands a lone button or divider at the start of a row.
function Group({ children }) {
  return <div className="flex shrink-0 items-center gap-0.5">{children}</div>;
}

export default function Toolbar({ editor, background, onBackgroundChange }) {
  const [linkDialogOpen, setLinkDialogOpen] = useState(false);

  if (!editor) return null;

  const { from, to, empty } = editor.state.selection;
  const selectedText = empty ? "" : editor.state.doc.textBetween(from, to, " ");
  const existingHref = editor.getAttributes("link").href || "";

  const openLinkDialog = () => setLinkDialogOpen(true);

  // One path for both "new link" and "edit existing link": replace whatever
  // is currently selected (if anything) with a single linked text node. Pads
  // with spaces when it would otherwise glue onto an adjacent word.
  const handleLinkSubmit = ({ text, href }) => {
    const { doc } = editor.state;
    const { from, to } = editor.state.selection;
    const charBefore = doc.textBetween(Math.max(0, from - 1), from);
    const charAfter = doc.textBetween(to, Math.min(doc.content.size, to + 1));
    const needsLeadingSpace = charBefore && !/\s/.test(charBefore);
    const needsTrailingSpace = charAfter && !/\s/.test(charAfter);

    editor
      .chain()
      .focus()
      .insertContentAt(
        { from, to },
        [
          ...(needsLeadingSpace ? [{ type: "text", text: " " }] : []),
          { type: "text", text, marks: [{ type: "link", attrs: { href } }] },
          ...(needsTrailingSpace ? [{ type: "text", text: " " }] : []),
        ]
      )
      .run();
    setLinkDialogOpen(false);
  };

  const removeLink = () => editor.chain().focus().unsetLink().run();

  return (
    <div className="relative flex min-w-0 flex-1 items-center gap-1 rounded-2xl border border-mauve-100 bg-surface/95 p-1.5 shadow-soft backdrop-blur">
      {/* NOTE: this row must NOT be a scroll container (overflow-x-auto) — scroll
          containers clip the absolutely-positioned dropdown panels. Groups wrap. */}
      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-2 gap-y-1">
        {/* Typeface */}
        <Group>
          <ToolbarPopover title="Font" width="w-44" trigger={<span className="flex items-center gap-1 text-sm"><Type size={16} /> Font</span>}>
            <div className="flex flex-col">
              {FONTS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => editor.chain().focus().setFontFamily(f.value).run()}
                  className="rounded-lg px-3 py-1.5 text-left text-sm text-mauve-700 transition hover:bg-mauve-50"
                  style={{ fontFamily: f.value }}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </ToolbarPopover>

          <ToolbarPopover title="Text size" width="w-28" trigger={<span className="text-sm">Size</span>}>
            <div className="flex flex-col">
              {FONT_SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => editor.chain().focus().setFontSize(s).run()}
                  className="rounded-lg px-3 py-1.5 text-left text-sm text-mauve-700 transition hover:bg-mauve-50"
                >
                  {parseInt(s, 10)}
                </button>
              ))}
            </div>
          </ToolbarPopover>
        </Group>

        {/* Inline marks + colors */}
        <Group>
          <Btn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive("bold")} title="Bold">
            <Bold size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive("italic")} title="Italic">
            <Italic size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive("underline")} title="Underline">
            <Underline size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive("strike")} title="Strikethrough">
            <Strikethrough size={17} />
          </Btn>

          <ToolbarPopover title="Text color" width="w-auto" trigger={<Baseline size={17} />}>
            <div className="flex gap-1.5 p-1">
              {INK_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => editor.chain().focus().setColor(c.value).run()}
                  title={c.label}
                  className="h-6 w-6 rounded-full border border-black/10 transition hover:scale-110"
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </ToolbarPopover>

          <ToolbarPopover title="Highlight" width="w-auto" trigger={<Highlighter size={17} />}>
            <div className="flex items-center gap-1.5 p-1">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => editor.chain().focus().toggleHighlight({ color: c.value }).run()}
                  title={c.label}
                  className="h-6 w-6 rounded-md border border-black/10 transition hover:scale-110"
                  style={{ backgroundColor: c.value }}
                />
              ))}
              <button
                onClick={() => editor.chain().focus().unsetHighlight().run()}
                title="Remove highlight"
                className="ml-1 rounded-md px-2 py-1 text-xs text-mauve-500 hover:bg-mauve-50"
              >
                None
              </button>
            </div>
          </ToolbarPopover>
        </Group>

        {/* Blocks */}
        <Group>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} active={editor.isActive("heading", { level: 1 })} title="Heading 1">
            <Heading1 size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} active={editor.isActive("heading", { level: 2 })} title="Heading 2">
            <Heading2 size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive("bulletList")} title="Bullet list">
            <List size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive("orderedList")} title="Numbered list">
            <ListOrdered size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleTaskList().run()} active={editor.isActive("taskList")} title="Task list">
            <ListChecks size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive("blockquote")} title="Quote">
            <Quote size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive("codeBlock")} title="Code block">
            <Code2 size={17} />
          </Btn>
        </Group>

        {/* Alignment */}
        <Group>
          <Btn onClick={() => editor.chain().focus().setTextAlign("left").run()} active={editor.isActive({ textAlign: "left" })} title="Align left">
            <AlignLeft size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign("center").run()} active={editor.isActive({ textAlign: "center" })} title="Align center">
            <AlignCenter size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().setTextAlign("right").run()} active={editor.isActive({ textAlign: "right" })} title="Align right">
            <AlignRight size={17} />
          </Btn>
        </Group>

        {/* Insert */}
        <Group>
          <Btn onClick={openLinkDialog} active={editor.isActive("link")} title="Add link">
            <Link2 size={17} />
          </Btn>
          <Btn onClick={removeLink} disabled={!editor.isActive("link")} title="Remove link">
            <Link2Off size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().insertExcalidraw().run()} title="Diagram / shapes">
            <PenTool size={17} />
          </Btn>

          {editor.isActive("table") ? (
            <ToolbarPopover title="Table options" width="w-48" trigger={<Table2 size={17} />}>
              <div className="flex flex-col">
                <button
                  onClick={() => editor.chain().focus().addRowAfter().run()}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-mauve-700 transition hover:bg-mauve-50"
                >
                  <Rows3 size={15} /> Add row below
                </button>
                <button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-mauve-700 transition hover:bg-mauve-50"
                >
                  <Columns3 size={15} /> Add column right
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteRow().run()}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-mauve-700 transition hover:bg-mauve-50"
                >
                  <Trash2 size={15} /> Delete row
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-mauve-700 transition hover:bg-mauve-50"
                >
                  <Trash2 size={15} /> Delete column
                </button>
                <div className="my-1 h-px bg-mauve-100" />
                <button
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 text-left text-sm text-danger-600 transition hover:bg-danger-50"
                >
                  <Trash2 size={15} /> Delete table
                </button>
              </div>
            </ToolbarPopover>
          ) : (
            <Btn
              onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
              title="Insert table"
            >
              <Table2 size={17} />
            </Btn>
          )}
        </Group>

        {/* History */}
        <Group>
          <Btn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo">
            <Undo2 size={17} />
          </Btn>
          <Btn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo">
            <Redo2 size={17} />
          </Btn>
        </Group>
      </div>

      {onBackgroundChange && (
        <div className="flex shrink-0 items-center gap-1 self-start border-l border-mauve-100 pl-1.5">
          <BackgroundPicker value={background} onChange={onBackgroundChange} />
        </div>
      )}

      <LinkDialog
        open={linkDialogOpen}
        onClose={() => setLinkDialogOpen(false)}
        onSubmit={handleLinkSubmit}
        initialText={selectedText}
        initialHref={existingHref}
      />
    </div>
  );
}
