import { useAuth } from '../features/auth/AuthContext';
import { useState } from 'react';

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'resources', label: 'Resources', icon: '📦' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'tickets', label: 'Support Tickets', icon: '🎫' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}! 👋</h1>
          <p className="text-gray-600 mt-2">
            {user?.userType === 'STUDENT' ? 'Student' : 'Lecturer'} Account
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Role</p>
              <p className="text-lg font-semibold">{user?.role}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">User Type</p>
              <p className="text-lg font-semibold">{user?.userType}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Email</p>
              <p className="text-lg font-semibold truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Status</p>
              <p className="text-lg font-semibold">{user?.accountStatus || 'ACTIVE'}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Available Resources</h3>
                <p className="text-gray-600">View and manage campus resources available for your use.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 Manage Bookings</h3>
                <p className="text-gray-600">Book and manage campus facilities and resources.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎫 Support & Issues</h3>
                <p className="text-gray-600">Create and track support tickets for technical issues.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📢 Announcements</h3>
                <p className="text-gray-600">Stay updated with latest campus announcements.</p>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Resources</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Resource management feature - coming soon</p>
                <p className="text-sm mt-2">Browse and request available campus resources</p>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📅 Bookings</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Booking management feature - coming soon</p>
                <p className="text-sm mt-2">Book facilities and manage your reservations</p>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎫 Support Tickets</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Ticket management feature - coming soon</p>
                <p className="text-sm mt-2">Create and track support tickets</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
