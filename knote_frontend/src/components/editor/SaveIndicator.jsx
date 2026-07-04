import { Check, Loader2, CloudOff } from "lucide-react";

// status: "saved" | "saving" | "error"
export default function SaveIndicator({ status }) {
  if (status === "saving") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-mauve-400">
        <Loader2 size={14} className="animate-spin" /> Saving…
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1.5 text-sm text-danger-600">
        <CloudOff size={14} /> Save failed
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 text-sm text-success-600">
      <Check size={14} /> Saved
    </span>
  );
}
