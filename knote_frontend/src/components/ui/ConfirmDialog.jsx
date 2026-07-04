import { useState } from "react";
import Modal from "./Modal";
import Button from "./Button";

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message,
  confirmLabel = "Delete",
  destructive = true,
}) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    setBusy(true);
    try {
      await onConfirm();
      onClose();
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title}>
      {message && <p className="text-sm text-mauve-600">{message}</p>}
      <div className="mt-6 flex justify-end gap-3">
        <Button variant="ghost" onClick={onClose} disabled={busy}>
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          loading={busy}
          className={destructive ? "bg-danger-500 hover:bg-danger-600 focus-visible:ring-danger-500/30" : ""}
        >
          {confirmLabel}
        </Button>
      </div>
    </Modal>
  );
}
