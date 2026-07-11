import { useState } from "react";
import { Trash2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

const TONES = [
  { key: "accent", className: "bg-accent-500" },
  { key: "mauve", className: "bg-mauve-500" },
  { key: "success", className: "bg-success-500" },
];

export default function CalendarEventFormModal({ open, onClose, onSubmit, onRequestDelete, event, defaultDate }) {
  const isEdit = !!event;
  const [title, setTitle] = useState(event?.title || "");
  const [date, setDate] = useState(event ? event.date.slice(0, 10) : defaultDate || "");
  const [tone, setTone] = useState(event?.tone || "accent");
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
      await onSubmit({ title: title.trim(), date, tone });
      onClose();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "Edit event" : "New event"}>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="event-title"
          label="Title"
          placeholder="e.g. React review"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          error={error}
          autoFocus
        />
        <TextField
          id="event-date"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <div>
          <span className="field-label">Color</span>
          <div className="flex gap-2">
            {TONES.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => setTone(t.key)}
                className={`h-9 w-9 rounded-full ${t.className} transition ${
                  tone === t.key ? "ring-2 ring-offset-2 ring-mauve-300" : ""
                }`}
                aria-label={t.key}
              />
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 pt-2">
          {isEdit ? (
            <button
              type="button"
              onClick={() => onRequestDelete(event)}
              className="flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm font-medium text-danger-600 transition hover:bg-danger-50"
            >
              <Trash2 size={15} /> Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-3">
            <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
              Cancel
            </Button>
            <Button type="submit" loading={busy}>
              {isEdit ? "Save" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
