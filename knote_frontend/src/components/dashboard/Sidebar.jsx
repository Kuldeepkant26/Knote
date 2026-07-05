import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { NotebookPen, PanelLeftClose, PanelLeftOpen, LogOut } from "lucide-react";
import { navItems } from "@/lib/navItems";
import { useUiStore } from "@/stores/uiStore";
import { useAuthStore } from "@/stores/authStore";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

export default function Sidebar() {
  const collapsed = useUiStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUiStore((s) => s.toggleSidebar);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [confirmLogout, setConfirmLogout] = useState(false);

  return (
    <aside
      className={`flex h-screen shrink-0 flex-col border-r border-mauve-100 bg-cream-100 transition-[width] duration-300 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Brand + collapse toggle */}
      <div className="flex h-16 items-center justify-between px-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500 text-white">
              <NotebookPen size={20} />
            </div>
            <span className="font-display text-xl font-semibold text-mauve-800">
              KNOTE
            </span>
          </div>
        )}
        <button
          onClick={toggleSidebar}
          className={`flex h-9 w-9 items-center justify-center rounded-lg text-mauve-500 transition hover:bg-mauve-50 hover:text-mauve-800 ${
            collapsed ? "mx-auto" : ""
          }`}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={20} /> : <PanelLeftClose size={20} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={collapsed ? label : undefined}
            className={({ isActive }) =>
              `relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive
                  ? "bg-accent-50 text-accent-700"
                  : "text-mauve-600 hover:bg-mauve-50 hover:text-mauve-800"
              } ${collapsed ? "justify-center" : ""}`
            }
          >
            {({ isActive }) => (
              <>
                {isActive && (
                  <span className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-accent-500" />
                )}
                <Icon size={20} className="shrink-0" />
                {!collapsed && <span>{label}</span>}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User + logout */}
      <div className="border-t border-mauve-100 p-3">
        <div
          className={`flex items-center gap-3 rounded-xl p-2 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <Avatar name={user?.name} size="sm" />
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-mauve-800">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-mauve-400">{user?.email}</p>
            </div>
          )}
        </div>
        <button
          onClick={() => setConfirmLogout(true)}
          title={collapsed ? "Log out" : undefined}
          className={`mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-mauve-600 transition hover:bg-danger-50 hover:text-danger-600 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut size={20} className="shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onClose={() => setConfirmLogout(false)}
        onConfirm={async () => {
          await logout();
          navigate("/login", { replace: true });
        }}
        title="Log out?"
        message="You'll need to sign in again to access your notes."
        confirmLabel="Log out"
      />
    </aside>
  );
}
