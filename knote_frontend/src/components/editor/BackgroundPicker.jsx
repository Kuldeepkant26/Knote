import { useRef, useState } from "react";
import { LayoutGrid, Check } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";
import { BACKGROUNDS } from "./editorConstants";

export default function BackgroundPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => setOpen((o) => !o)}
        aria-label="Page background"
        data-tip="Page background"
        className="tt tt-end flex h-9 w-9 items-center justify-center rounded-lg text-mauve-600 transition hover:bg-mauve-50 hover:text-mauve-800"
      >
        <LayoutGrid size={17} />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-30 mt-1 w-64 rounded-xl border border-mauve-100 bg-surface p-3 shadow-pop">
          <div className="grid grid-cols-3 gap-2">
            {BACKGROUNDS.map((bg) => (
              <button
                key={bg.key}
                onClick={() => {
                  onChange(bg.key);
                  setOpen(false);
                }}
                className={`relative flex flex-col items-center gap-1.5 rounded-lg p-1.5 transition hover:bg-mauve-50 ${
                  value === bg.key ? "ring-2 ring-accent-300" : ""
                }`}
              >
                <span className={`h-12 w-full rounded-md border border-mauve-100 ${bg.className}`} />
                <span className="text-[11px] text-mauve-500">{bg.label}</span>
                {value === bg.key && (
                  <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent-500 text-white">
                    <Check size={11} />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
