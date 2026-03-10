import { Navigate, Outlet } from 'react-router';
import { isAuthenticated } from '../utils/auth';

export default function GuestRoute() {
  if (isAuthenticated()) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}

