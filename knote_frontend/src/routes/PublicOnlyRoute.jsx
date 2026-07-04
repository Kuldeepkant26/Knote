import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import FullPageLoader from "@/components/ui/FullPageLoader";

// Keeps already-authenticated users off the auth pages (login/signup/etc.).
export default function PublicOnlyRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <FullPageLoader />;

  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}
