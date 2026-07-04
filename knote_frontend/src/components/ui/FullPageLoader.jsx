import { Loader2 } from "lucide-react";

// Shown while auth bootstrap is in flight, to avoid a login-page flash on reload.
export default function FullPageLoader() {
  return (
    <div className="flex h-full min-h-screen items-center justify-center bg-cream-50">
      <div className="flex flex-col items-center gap-3 text-mauve-400">
        <Loader2 size={28} className="animate-spin text-accent-500" />
        <span className="font-display text-lg text-mauve-600">KNOTE</span>
      </div>
    </div>
  );
}
