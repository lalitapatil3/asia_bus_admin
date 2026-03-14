import { useAuthStore } from "../../store/authStore";

interface PermissionGateProps {
  resource: string;
  action: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function PermissionGate({ resource, action, children, fallback = null }: PermissionGateProps) {
  const user = useAuthStore((s) => s.user);
  const hasPermission = (user?.permissions ?? []).some(
    (p) => p.resource === resource && p.action === action
  );
  return hasPermission ? <>{children}</> : <>{fallback}</>;
}
