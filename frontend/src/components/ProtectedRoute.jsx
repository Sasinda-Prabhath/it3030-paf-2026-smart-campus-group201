import { useAuth } from '../features/auth/AuthContext';
import { Navigate } from 'react-router-dom';
import PendingApprovalPage from '../pages/PendingApprovalPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.accountStatus === 'PENDING_APPROVAL') {
    return <PendingApprovalPage />;
  }

  return children;
};

export default ProtectedRoute;