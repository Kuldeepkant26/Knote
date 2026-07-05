import { ZoomIn, ZoomOut } from "lucide-react";

export const ZOOM_MIN = 0.5;
export const ZOOM_MAX = 2;
export const ZOOM_STEP = 0.1;

export function clampZoom(z) {
  return Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Math.round(z * 10) / 10));
}

export default function ZoomControls({ zoom, onChange }) {
  return (
    <div className="flex items-center gap-0.5 rounded-lg border border-mauve-100 bg-surface p-0.5">
      <button
        type="button"
        onClick={() => onChange(clampZoom(zoom - ZOOM_STEP))}
        disabled={zoom <= ZOOM_MIN}
        aria-label="Zoom out"
        data-tip="Zoom out"
        className="tt flex h-7 w-7 items-center justify-center rounded-md text-mauve-500 transition hover:bg-mauve-50 hover:text-mauve-800 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ZoomOut size={15} />
      </button>
      <button
        type="button"
        onClick={() => onChange(1)}
        aria-label="Reset zoom"
        data-tip="Reset zoom"
        className="tt h-7 min-w-12 rounded-md px-1 text-center text-xs font-medium tabular-nums text-mauve-600 transition hover:bg-mauve-50 hover:text-mauve-800"
      >
        {Math.round(zoom * 100)}%
      </button>
      <button
        type="button"
        onClick={() => onChange(clampZoom(zoom + ZOOM_STEP))}
        disabled={zoom >= ZOOM_MAX}
        aria-label="Zoom in"
        data-tip="Zoom in"
        className="tt flex h-7 w-7 items-center justify-center rounded-md text-mauve-500 transition hover:bg-mauve-50 hover:text-mauve-800 disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <ZoomIn size={15} />
      </button>
    </div>
  );
}
