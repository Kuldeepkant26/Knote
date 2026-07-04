import { Outlet } from "react-router-dom";
import { NotebookPen } from "lucide-react";

export default function AuthLayout() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream-50 px-4 py-12">
      {/* Soft lavender glow behind the card */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/3 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent-200/40 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-[15%] top-[20%] h-64 w-64 rounded-full bg-mauve-200/40 blur-[100px]"
      />

      <div className="relative w-full max-w-md">
        {/* Brand */}
        <div className="mb-8 flex items-center justify-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500 text-white shadow-soft">
            <NotebookPen size={22} />
          </div>
          <span className="font-display text-2xl font-semibold text-mauve-800">
            KNOTE
          </span>
        </div>

        <div className="card p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
