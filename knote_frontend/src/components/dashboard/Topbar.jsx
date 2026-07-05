import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Bell, ChevronDown, User, Settings, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";
import { useClickOutside } from "@/hooks/useClickOutside";
import { useTheme } from "@/lib/theme";
import Avatar from "@/components/ui/Avatar";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const THEME_META = {
  light: { icon: Sun, tip: "Theme: Light" },
  dark: { icon: Moon, tip: "Theme: Dark" },
  system: { icon: Monitor, tip: "Theme: System" },
};

export default function Topbar({ title }) {
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const { theme, cycle } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogout, setConfirmLogout] = useState(false);
  const menuRef = useRef(null);
  useClickOutside(menuRef, () => setMenuOpen(false), menuOpen);

  const { icon: ThemeIcon, tip: themeTip } = THEME_META[theme ?? "system"];

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-mauve-100 bg-cream-50/80 px-6 backdrop-blur">
      <h1 className="font-display text-xl font-semibold text-mauve-800">{title}</h1>

      {/* Search (placeholder only) */}
      <div className="relative ml-auto hidden w-72 md:block">
        <Search
          size={18}
          className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-mauve-400"
        />
        <input
          type="text"
          placeholder="Search…"
          className="input h-10 py-0 pl-10 text-sm"
        />
      </div>

      <button
        onClick={cycle}
        className="tt flex h-10 w-10 items-center justify-center rounded-xl text-mauve-500 transition hover:bg-mauve-50 hover:text-mauve-800 md:ml-0"
        aria-label={themeTip}
        data-tip={themeTip}
      >
        <ThemeIcon size={20} />
      </button>

      <button
        className="flex h-10 w-10 items-center justify-center rounded-xl text-mauve-500 transition hover:bg-mauve-50 hover:text-mauve-800"
        aria-label="Notifications"
      >
        <Bell size={20} />
      </button>

      {/* User menu */}
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setMenuOpen((o) => !o)}
          className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-mauve-50"
        >
          <Avatar name={user?.name} size="sm" />
          <ChevronDown size={16} className="text-mauve-400" />
        </button>

        {menuOpen && (
          <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-mauve-100 bg-surface shadow-pop">
            <div className="border-b border-mauve-100 px-4 py-3">
              <p className="truncate text-sm font-medium text-mauve-800">
                {user?.name || "User"}
              </p>
              <p className="truncate text-xs text-mauve-400">{user?.email}</p>
            </div>
            <div className="py-1">
              <MenuItem icon={User} label="Profile" onClick={() => setMenuOpen(false)} />
              <MenuItem
                icon={Settings}
                label="Settings"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/dashboard/settings");
                }}
              />
            </div>
            <div className="border-t border-mauve-100 py-1">
              <button
                onClick={() => {
                  setMenuOpen(false);
                  setConfirmLogout(true);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-danger-600 transition hover:bg-danger-50"
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          </div>
        )}
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
    </header>
  );
}

function MenuItem({ icon: Icon, label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-3 px-4 py-2.5 text-sm font-medium text-mauve-600 transition hover:bg-mauve-50 hover:text-mauve-800"
    >
      <Icon size={18} />
      {label}
    </button>
  );
}
