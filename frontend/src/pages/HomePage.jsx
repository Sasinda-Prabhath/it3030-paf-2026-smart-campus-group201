import { useAuth } from '../features/auth/AuthContext';

const HomePage = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        {/* Welcome Hero */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Smart Campus 🏢</h1>
          <p className="text-lg text-gray-600">
            Your centralized platform for managing campus resources, bookings, and facilities
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-3xl mb-2">👤</p>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Your Account</h3>
            <p className="text-2xl font-bold text-gray-900">{user?.fullName}</p>
            <p className="text-xs text-gray-500 mt-2">{user?.email}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-3xl mb-2">🔐</p>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Your Role</h3>
            <p className="text-2xl font-bold text-gray-900">{user?.role}</p>
            <p className="text-xs text-gray-500 mt-2">{user?.userType || user?.staffType}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-3xl mb-2">✅</p>
            <h3 className="text-gray-600 text-sm font-medium mb-1">Status</h3>
            <p className="text-2xl font-bold text-green-600">{user?.accountStatus}</p>
            <p className="text-xs text-gray-500 mt-2">Account Active</p>
          </div>
        </div>

        {/* Main Features */}
        <div className="bg-white rounded-lg shadow p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Features Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
              <p className="text-3xl mb-2">📦</p>
              <h3 className="font-semibold text-gray-900 mb-1">Resources</h3>
              <p className="text-xs text-gray-600">Manage campus resources</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
              <p className="text-3xl mb-2">📅</p>
              <h3 className="font-semibold text-gray-900 mb-1">Bookings</h3>
              <p className="text-xs text-gray-600">Schedule facilities</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
              <p className="text-3xl mb-2">🎫</p>
              <h3 className="font-semibold text-gray-900 mb-1">Tickets</h3>
              <p className="text-xs text-gray-600">Track maintenance</p>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg">
              <p className="text-3xl mb-2">🔔</p>
              <h3 className="font-semibold text-gray-900 mb-1">Notifications</h3>
              <p className="text-xs text-gray-600">Stay informed</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow p-8 text-white">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all text-left">
              📝 Create Booking
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all text-left">
              🎫 Report Issue
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all text-left">
              📦 View Resources
            </button>
            <button className="bg-white bg-opacity-20 hover:bg-opacity-30 px-6 py-3 rounded-lg font-medium transition-all text-left">
              👤 Manage Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;