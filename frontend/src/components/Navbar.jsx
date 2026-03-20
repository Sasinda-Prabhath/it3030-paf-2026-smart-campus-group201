import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { Link } from 'react-router-dom';
import { Bell, User, LogOut, Settings, ShieldCheck } from 'lucide-react';
import NotificationBell from './NotificationBell';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded bg-brand-600 text-white flex items-center justify-center font-bold text-lg group-hover:bg-brand-700 transition-colors">
            SC
          </div>
          <span className="font-semibold text-lg text-gray-800 tracking-tight hidden sm:block">
            Smart Campus
          </span>
        </Link>

        {/* Right Nav */}
        <div className="flex items-center gap-4">
          <NotificationBell />

          {/* Profile Dropdown */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-brand-500 rounded-full p-1 transition bg-gray-50 hover:bg-gray-100 border border-gray-200 shadow-sm"
            >
              <img
                src={user?.profileImageUrl || 'https://via.placeholder.com/40'}
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover"
                referrerPolicy="no-referrer"
              />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-slide-down">
                <div className="px-4 py-2 border-b border-gray-50">
                  <p className="text-sm font-medium text-gray-900 truncate">{user?.fullName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                </div>

                <div className="py-1 border-b border-gray-50">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition"
                  >
                    <User className="w-4 h-4" /> My Profile
                  </Link>

                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin/users"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-brand-600 transition"
                    >
                      <ShieldCheck className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                </div>

                <div className="py-1">
                  <button
                    onClick={() => { setMenuOpen(false); logout(); }}
                    className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="w-4 h-4" /> Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
