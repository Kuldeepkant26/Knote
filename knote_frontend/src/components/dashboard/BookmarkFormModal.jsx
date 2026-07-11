import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

export default function BookmarkFormModal({ open, onClose, onSubmit, bookmark }) {
  const isEdit = !!bookmark;
  const [title, setTitle] = useState(bookmark?.title || "");
  const [url, setUrl] = useState(bookmark?.url || "");
  const [subject, setSubject] = useState(bookmark?.subject || "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title is required");
      return;
    }
    if (!url.trim()) {
      setError("URL is required");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ title: title.trim(), url: url.trim(), subject: subject.trim() });
      onClose();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit bookmark" : "Add bookmark"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="bm-title"
          label="Title"
          placeholder="e.g. React docs — Hooks"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          autoFocus
        />
        <TextField
          id="bm-url"
          label="URL"
          placeholder="e.g. react.dev/reference/react"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <TextField
          id="bm-subject"
          label="Subject (optional)"
          placeholder="e.g. React Mastery"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" loading={busy}>
            {isEdit ? "Save" : "Add"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
