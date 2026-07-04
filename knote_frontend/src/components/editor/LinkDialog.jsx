import { useState } from "react";
import { Link2 } from "lucide-react";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import TextField from "@/components/ui/TextField";

function normalizeUrl(value) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (/^https?:\/\//i.test(trimmed) || /^mailto:/i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

export default function LinkDialog({ open, onClose, onSubmit, initialText, initialHref }) {
  const [text, setText] = useState(initialText || "");
  const [href, setHref] = useState(initialHref || "");
  const [error, setError] = useState("");

  // Re-seed the fields fresh each time the dialog opens.
  const [lastOpen, setLastOpen] = useState(open);
  if (open !== lastOpen) {
    setLastOpen(open);
    if (open) {
      setText(initialText || "");
      setHref(initialHref || "");
      setError("");
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = normalizeUrl(href);
    if (!url) {
      setError("Enter a URL");
      return;
    }
    const label = text.trim() || url;
    onSubmit({ text: label, href: url });
  };

  return (
    <Modal open={open} onClose={onClose} title="Add link" className="max-w-sm">
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <TextField
          id="link-text"
          label="Text to display"
          placeholder="e.g. React documentation"
          value={text}
          onChange={(e) => setText(e.target.value)}
          autoFocus
        />
        <TextField
          id="link-href"
          label="Link to"
          placeholder="www.example.com"
          value={href}
          onChange={(e) => {
            setHref(e.target.value);
            setError("");
          }}
          error={error}
        />

        {/* Live preview so it feels like a real "insert link" experience */}
        <div className="flex items-center gap-2 rounded-xl bg-accent-50/60 px-3 py-2.5 text-sm">
          <Link2 size={15} className="shrink-0 text-accent-500" />
          <span className="truncate text-accent-700 underline underline-offset-2">
            {text.trim() || href.trim() || "Your link preview"}
          </span>
        </div>

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Insert link</Button>
        </div>
      </form>
    </Modal>
  );
}
