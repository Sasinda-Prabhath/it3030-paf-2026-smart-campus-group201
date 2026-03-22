import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../features/auth/AuthContext';
import ProtectedRoute from '../components/ProtectedRoute';
import RoleGuard from '../components/RoleGuard';
import Navbar from '../layouts/Navbar';
import HomePage from '../pages/HomePage';
import LoginPage from '../pages/LoginPage';

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
            {/* Future admin routes */}
            <Route path="/admin" element={<RoleGuard allowedRoles={['ADMIN']}><div className="p-4">Admin Dashboard</div></RoleGuard>} />
            {/* Future staff routes can be added easily */}
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;