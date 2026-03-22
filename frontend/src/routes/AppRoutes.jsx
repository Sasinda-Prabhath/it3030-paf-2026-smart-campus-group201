import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleGuard from '../components/RoleGuard';
import Navbar from '../layouts/Navbar';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import NotificationsPage from '../pages/NotificationsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminDashboard from '../pages/AdminDashboard';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="/notifications" element={<ProtectedRoute><NotificationsPage /></ProtectedRoute>} />
            {/* Admin routes */}
            <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN']}><AdminDashboard /></RoleGuard>} />
            <Route path="/admin/users" element={<RoleGuard allowedRoles={['ADMIN']}><AdminUsersPage /></RoleGuard>} />
            {/* Future staff routes can be added easily */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;