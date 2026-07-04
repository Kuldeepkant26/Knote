import { useEffect, lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

import Index from "@/routes/Index";
import ProtectedRoute from "@/routes/ProtectedRoute";
import PublicOnlyRoute from "@/routes/PublicOnlyRoute";
import FullPageLoader from "@/components/ui/FullPageLoader";

// The page editor (TipTap + Excalidraw) is heavy — load it only when opened.
const PageEditor = lazy(() => import("@/pages/dashboard/PageEditor"));

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import Login from "@/pages/auth/Login";
import Signup from "@/pages/auth/Signup";
import ForgotPassword from "@/pages/auth/ForgotPassword";
import ResetPassword from "@/pages/auth/ResetPassword";

import DashboardHome from "@/pages/dashboard/DashboardHome";
import NotebooksList from "@/pages/dashboard/NotebooksList";
import NotebookDetail from "@/pages/dashboard/NotebookDetail";
import Finance from "@/pages/dashboard/Finance";
import Tasks from "@/pages/dashboard/Tasks";
import Calendar from "@/pages/dashboard/Calendar";
import Bookmarks from "@/pages/dashboard/Bookmarks";
import Settings from "@/pages/dashboard/Settings";
import NotFound from "@/pages/NotFound";

export default function App() {
  const bootstrap = useAuthStore((s) => s.bootstrap);

  useEffect(() => {
    bootstrap();
  }, [bootstrap]);

  return (
    <Routes>
      <Route path="/" element={<Index />} />

      {/* Public — redirects to /dashboard if already authenticated */}
      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>
      </Route>

      {/* Protected — redirects to /login if not authenticated */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="notebooks" element={<NotebooksList />} />
          <Route path="notebooks/:id" element={<NotebookDetail />} />
          <Route
            path="notebooks/:notebookId/pages/:pageId"
            element={
              <Suspense fallback={<FullPageLoader />}>
                <PageEditor />
              </Suspense>
            }
          />
          <Route path="finance" element={<Finance />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="calendar" element={<Calendar />} />
          <Route path="bookmarks" element={<Bookmarks />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
