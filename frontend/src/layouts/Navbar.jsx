import { Link } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useState } from 'react';
import NotificationBell from '../components/NotificationBell';
import NotificationPanel from '../components/NotificationPanel';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Smart Campus</Link>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <Link to="/profile" className="hover:text-gray-300">Profile</Link>
              <div className="relative">
                <NotificationBell onClick={() => setShowNotifications(!showNotifications)} />
                <NotificationPanel isOpen={showNotifications} onClose={() => setShowNotifications(false)} />
              </div>
              <span className="mr-4">Hello, {user.fullName}</span>
              <button
                onClick={logout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;