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
            <Route path="/admin/users" element={<RoleGuard allowedRoles={['ADMIN']}><AdminUsersPage /></RoleGuard>} />
            <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN']}><div className="p-4"><h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1><a href="/admin/users" className="text-blue-500 hover:text-blue-700">Manage Users</a></div></RoleGuard>} />
            {/* Future staff routes can be added easily */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;