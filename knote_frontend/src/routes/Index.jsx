import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import FullPageLoader from "@/components/ui/FullPageLoader";

// "/" — send users to the dashboard if authed, otherwise to login.
export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading) return <FullPageLoader />;

  return <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />;
}
