import { AlertCircle } from "lucide-react";

// Top-of-form banner for non-field errors (401 invalid creds, expired token…).
export default function FormError({ message }) {
  if (!message) return null;
  return (
    <div
      role="alert"
      className="flex items-start gap-2.5 rounded-xl border border-danger-500/30 bg-danger-50 px-4 py-3 text-sm text-danger-600"
    >
      <AlertCircle size={18} className="mt-0.5 shrink-0" />
      <span>{message}</span>
    </div>
  );
}
