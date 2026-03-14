import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../store/authStore";

export default function GuestRoute() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Outlet />;
}
