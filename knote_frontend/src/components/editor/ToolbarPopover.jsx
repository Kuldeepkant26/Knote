import { useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { useClickOutside } from "@/hooks/useClickOutside";

// A toolbar button that toggles a small popover panel.
export default function ToolbarPopover({ trigger, title, children, width = "w-56" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useClickOutside(ref, () => setOpen(false), open);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onMouseDown={(e) => e.preventDefault()} // don't blur the editor selection
        onClick={() => setOpen((o) => !o)}
        aria-label={title}
        data-tip={title}
        className="tt flex h-9 items-center gap-1 rounded-lg px-2 text-mauve-600 transition hover:bg-mauve-50 hover:text-mauve-800"
      >
        {trigger}
        <ChevronDown size={13} className="text-mauve-400" />
      </button>
      {open && (
        <div
          onMouseDown={(e) => e.preventDefault()} // keep selection while picking an option
          className={`absolute left-0 top-full z-30 mt-1 ${width} rounded-xl border border-mauve-100 bg-surface p-2 shadow-pop`}
        >
          <div onClick={() => setOpen(false)}>{children}</div>
        </div>
      )}
    </div>
  );
}
