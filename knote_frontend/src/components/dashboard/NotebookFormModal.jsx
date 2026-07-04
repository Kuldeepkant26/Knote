import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

const TINTS = [
  { key: "accent", className: "bg-accent-500" },
  { key: "mauve", className: "bg-mauve-500" },
  { key: "success", className: "bg-success-500" },
];

export default function NotebookFormModal({ open, onClose, onSubmit, notebook }) {
  const isEdit = !!notebook;
  // Initialized from props; the parent remounts this via `key` so a fresh
  // open always starts from the right values (no sync-in-effect needed).
  const [title, setTitle] = useState(notebook?.title || "");
  const [subject, setSubject] = useState(notebook?.subject || "");
  const [tint, setTint] = useState(notebook?.tint || "accent");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), subject: subject.trim(), tint });
      onClose();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Rename notebook" : "New notebook"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="nb-title"
          label="Title"
          placeholder="e.g. System Design"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          autoFocus
        />
        <TextField
          id="nb-subject"
          label="Subject (optional)"
          placeholder="e.g. Architecture"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />
        <div>
          <span className="field-label">Cover color</span>
          <div className="flex gap-2">
            {TINTS.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTint(t.key)}
                className={`h-9 w-9 rounded-full ${t.className} transition ${
                  tint === t.key ? "ring-2 ring-offset-2 ring-mauve-300" : ""
                }`}
                aria-label={t.key}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" loading={busy}>
            {isEdit ? "Save" : "Create"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
