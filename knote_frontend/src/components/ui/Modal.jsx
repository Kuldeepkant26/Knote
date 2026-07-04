import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

export default function Modal({ open, onClose, title, children, className = "" }) {
  const panelRef = useRef(null);
  useClickOutside(panelRef, onClose, open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-900/30 backdrop-blur-sm" aria-hidden />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        className={`card relative z-10 w-full max-w-md p-6 shadow-pop ${className}`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-mauve-800">{title}</h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-mauve-400 transition hover:bg-mauve-50 hover:text-mauve-700"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
