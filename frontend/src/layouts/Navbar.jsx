import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useState } from 'react';
import NotificationBell from '../components/NotificationBell';
import NotificationPanel from '../components/NotificationPanel';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold hover:text-gray-300 transition-colors">
            Smart Campus
          </Link>
          <div className="flex items-center space-x-6">
            {user ? (
              <>
                <Link to="/dashboard" className="hover:text-gray-300 transition-colors">Dashboard</Link>
                <Link to="/profile" className="hover:text-gray-300 transition-colors">Profile</Link>
                <div className="relative">
                  <NotificationBell onClick={() => setShowNotifications(!showNotifications)} />
                  <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
                </div>
                {user.role === 'ADMIN' && (
                  <>
                    <Link to="/admin" className="hover:text-gray-300 transition-colors font-medium">Admin</Link>
                    <Link to="/admin/users" className="hover:text-gray-300 transition-colors text-sm">Users</Link>
                  </>
                )}
                <span className="text-sm text-gray-300">Hello, {user.fullName}</span>
                <button
                  onClick={logout}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;