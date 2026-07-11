import Skeleton from "@/components/ui/Skeleton";

// Shimmer layouts that mirror each page's real structure so loading
// doesn't jump when the content arrives.

export function NotebookCardSkeleton() {
  return (
    <div className="card overflow-hidden p-0 ring-1 ring-mauve-100">
      <Skeleton className="h-28 w-full rounded-none" />
      <div className="p-5 pb-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="mt-2 h-5 w-3/4" />
        <div className="mt-3 flex gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
      </div>
      <div className="border-t border-mauve-100/70 px-5 py-2.5">
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  );
}

export function NotebooksGridSkeleton({ count = 6 }) {
  return (
    <div
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
      role="status"
      aria-label="Loading notebooks"
    >
      {Array.from({ length: count }, (_, i) => (
        <NotebookCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function NotebookDetailSkeleton() {
  return (
    <div role="status" aria-label="Loading notebook">
      <Skeleton className="mb-2 h-4 w-48" />
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="mt-2 h-4 w-40" />
        </div>
        <Skeleton className="h-11 w-36 rounded-xl" />
      </div>
      <Skeleton className="mb-6 h-10 w-full rounded-xl" />
      <div className="flex gap-5 overflow-hidden pb-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="w-80 shrink-0 space-y-3">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-24 w-full rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function FinanceSkeleton() {
  return (
    <div role="status" aria-label="Loading finance data">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="card p-5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="mt-3 h-7 w-24" />
            <Skeleton className="mt-2 h-3 w-14" />
          </div>
        ))}
      </div>
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-3">
          <Skeleton className="h-4 w-40" />
          <div className="card space-y-3 p-5">
            {Array.from({ length: 5 }, (_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        </div>
        <div className="space-y-3">
          <Skeleton className="h-4 w-40" />
          <div className="card space-y-5 p-5">
            {Array.from({ length: 4 }, (_, i) => (
              <Skeleton key={i} className="h-6 w-full" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function TasksSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3" role="status" aria-label="Loading tasks">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="card space-y-3 p-6">
          <Skeleton className="h-4 w-24" />
          {Array.from({ length: 3 }, (_, j) => (
            <Skeleton key={j} className="h-10 w-full rounded-xl" />
          ))}
        </div>
      ))}
    </div>
  );
}

export function CalendarSkeleton() {
  return (
    <div className="card overflow-hidden p-5" role="status" aria-label="Loading calendar">
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 35 }, (_, i) => (
          <Skeleton key={i} className="h-21 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export function PageEditorSkeleton() {
  return (
    <div className="flex h-full flex-col" role="status" aria-label="Loading page">
      <div className="mb-3 flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-56" />
        <Skeleton className="h-6 w-32" />
      </div>
      <div className="mb-3 flex items-center gap-3">
        <Skeleton className="h-9 w-9" />
        <Skeleton className="h-8 w-72" />
      </div>
      <Skeleton className="mb-4 h-11 w-full rounded-xl" />
      <div className="flex-1 pb-10">
        <div className="card mx-auto min-h-[70vh] w-full max-w-3xl p-10">
          <div className="space-y-4">
            <Skeleton className="h-4 w-11/12" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-10/12" />
            <Skeleton className="h-4 w-3/5" />
            <Skeleton className="h-4 w-9/12" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}
