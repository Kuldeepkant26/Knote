import {
  LayoutDashboard,
  NotebookPen,
  Wallet,
  ListChecks,
  CalendarDays,
  Bookmark,
  Settings,
} from "lucide-react";

// Sidebar navigation config. Add/remove a tab by editing this array only.
// `end` marks routes that should only match exactly (so /dashboard doesn't stay
// active when a child route like /dashboard/notebooks is open).
export const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/dashboard/notebooks", label: "Notebooks", icon: NotebookPen },
  { to: "/dashboard/finance", label: "Finance", icon: Wallet },
  { to: "/dashboard/tasks", label: "Tasks", icon: ListChecks },
  { to: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { to: "/dashboard/bookmarks", label: "Bookmarks", icon: Bookmark },
  { to: "/dashboard/settings", label: "Settings", icon: Settings },
];
