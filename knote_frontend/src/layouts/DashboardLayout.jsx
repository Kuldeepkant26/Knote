import { Outlet, useLocation, matchPath } from "react-router-dom";
import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

// Maps a route to the title shown in the topbar.
// Order matters: more specific patterns first, since the first match wins.
const TITLES = [
  { pattern: "/dashboard", title: "Dashboard", end: true },
  { pattern: "/dashboard/notebooks", title: "Notebooks", end: true },
  { pattern: "/dashboard/notebooks/:notebookId/pages/:pageId", title: "Editor" },
  { pattern: "/dashboard/notebooks/:id", title: "Notebook" },
  { pattern: "/dashboard/finance", title: "Finance" },
  { pattern: "/dashboard/tasks", title: "Tasks" },
  { pattern: "/dashboard/calendar", title: "Calendar" },
  { pattern: "/dashboard/bookmarks", title: "Bookmarks" },
  { pattern: "/dashboard/settings", title: "Settings" },
];

function usePageTitle(pathname) {
  const match = TITLES.find((t) =>
    matchPath({ path: t.pattern, end: t.end ?? false }, pathname)
  );
  return match?.title ?? "Dashboard";
}

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const title = usePageTitle(pathname);

  return (
    <div className="flex h-screen bg-cream-50">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar title={title} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-6 py-6 md:px-8 md:py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
