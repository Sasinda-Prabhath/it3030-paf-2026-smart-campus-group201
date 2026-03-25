import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleGuard from '../components/RoleGuard';
import MainLayout from '../layouts/MainLayout';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';
import ProfilePage from '../pages/ProfilePage';
import NotificationsPage from '../pages/NotificationsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminDashboard from '../pages/AdminDashboard';
import UserDashboard from '../pages/UserDashboard';
import TechnicianDashboard from '../pages/TechnicianDashboard';
import ManagerDashboard from '../pages/ManagerDashboard';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          {/* Protected routes with sidebar and navbar */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout><HomePage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <MainLayout><ProfilePage /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <MainLayout><NotificationsPage /></MainLayout>
              </ProtectedRoute>
            }
          />
          
          {/* Role-based dashboards */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <MainLayout><UserDashboard /></MainLayout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/technician/dashboard"
            element={
              <RoleGuard allowedRoles={['TECHNICIAN', 'MANAGER', 'ADMIN']}>
                <MainLayout><TechnicianDashboard /></MainLayout>
              </RoleGuard>
            }
          />
          <Route
            path="/manager/dashboard"
            element={
              <RoleGuard allowedRoles={['MANAGER', 'ADMIN']}>
                <MainLayout><ManagerDashboard /></MainLayout>
              </RoleGuard>
            }
          />
          
          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <MainLayout><AdminDashboard /></MainLayout>
              </RoleGuard>
            }
          />
          <Route
            path="/admin/users"
            element={
              <RoleGuard allowedRoles={['ADMIN']}>
                <MainLayout><AdminUsersPage /></MainLayout>
              </RoleGuard>
            }
          />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;