import { Navigate, Outlet, useLocation } from "react-router";
import { useAuthStore } from "../../store/authStore";

interface ProtectedRouteProps {
  requiredPermission?: { resource: string; action: string };
}

export default function ProtectedRoute({ requiredPermission }: ProtectedRouteProps) {
  const location = useLocation();
  const { isAuthenticated, user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/" replace state={{ from: location }} />;
  }

  if (requiredPermission && user?.permissions) {
    const hasPermission = user.permissions.some(
      (p) => p.resource === requiredPermission.resource && p.action === requiredPermission.action
    );
    if (!hasPermission) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
}
