import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';

export const RoleGuard = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || (!allowedRoles.includes(user.role) && !allowedRoles.includes('ALL'))) {
    return <Navigate to="/" replace />; // Redirect home if not allowed
  }

  return <Outlet />;
};
