import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../features/auth/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Navigation items based on role
  const getNavItems = () => {
    const commonItems = [
      { path: '/dashboard', label: 'Dashboard', icon: '📊' },
      { path: '/profile', label: 'Profile', icon: '👤' },
      { path: '/notifications', label: 'Notifications', icon: '🔔' },
    ];

    const moduleItems = [
      { path: '/resources', label: 'Resources', icon: '📦' },
      { path: '/bookings', label: 'Bookings', icon: '📅' },
      { path: '/tickets', label: 'Tickets', icon: '🎫' },
    ];

    const adminItems = user?.role === 'ADMIN' ? [
      { path: '/admin', label: 'Admin Dashboard', icon: '⚙️' },
      { path: '/admin/users', label: 'User Management', icon: '👥' },
    ] : [];

    return [...commonItems, { divider: true }, ...moduleItems, ...(adminItems.length > 0 ? [{ divider: true }, ...adminItems] : [])];
  };

  return (
    <aside className={`bg-gray-900 text-white transition-all duration-300 flex flex-col h-full ${collapsed ? 'w-20' : 'w-64'}`}>
      {/* Logo Section */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">SC</span>
            </div>
            <span className="font-bold">Smart Campus</span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-1 hover:bg-gray-700 rounded transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '→' : '←'}
        </button>
      </div>

      {/* User Info Section */}
      {!collapsed && (
        <div className="p-4 bg-gray-800 border-b border-gray-700">
          <p className="text-xs text-gray-400 mb-1">Logged in as</p>
          <p className="font-semibold text-sm truncate">{user?.fullName}</p>
          <p className="text-xs text-gray-400">{user?.role}</p>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {getNavItems().map((item, index) => {
          if (item.divider) {
            return <div key={index} className="my-4 border-t border-gray-700"></div>;
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800'
              }`}
              title={collapsed ? item.label : ''}
            >
              <span className="text-xl">{item.icon}</span>
              {!collapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      {!collapsed && (
        <div className="p-4 border-t border-gray-700 text-xs text-gray-400">
          <p>© 2026 Smart Campus</p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
