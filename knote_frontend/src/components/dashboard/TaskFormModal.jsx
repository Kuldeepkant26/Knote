import { useState } from "react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function TaskFormModal({ open, onClose, onSubmit }) {
  const [text, setText] = useState("");
  const [dueDate, setDueDate] = useState(todayISO());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) {
      setError("Task text is required");
      return;
    }
    setBusy(true);
    try {
      await onSubmit({ text: text.trim(), dueDate });
      onClose();
    } catch (err) {
      setError(err?.message || "Something went wrong");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title="New task">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="task-text"
          label="Task"
          placeholder="e.g. Review React hooks notes"
          value={text}
          onChange={(e) => setText(e.target.value)}
          error={error}
          autoFocus
        />
        <TextField
          id="task-due-date"
          label="Due date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" loading={busy}>
            Add task
          </Button>
        </div>
      </form>
    </Modal>
  );
}
