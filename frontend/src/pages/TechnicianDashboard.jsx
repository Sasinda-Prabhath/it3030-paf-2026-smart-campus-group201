import { useAuth } from '../features/auth/AuthContext';
import { useState } from 'react';

const TechnicianDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tickets', label: 'Support Tickets', icon: '🎫' },
    { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
    { id: 'resources', label: 'Resource Reports', icon: '📋' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}! 👋</h1>
          <p className="text-gray-600 mt-2">Technician Account</p>
        </div>

        {/* Technician Info Card */}
        <div className="bg-gradient-to-r from-orange-600 to-red-600 rounded-lg shadow-lg p-6 text-white mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-orange-100 text-sm">Role</p>
              <p className="text-lg font-semibold">{user?.role}</p>
            </div>
            <div>
              <p className="text-orange-100 text-sm">Access Level</p>
              <p className="text-lg font-semibold">Technical Support</p>
            </div>
            <div>
              <p className="text-orange-100 text-sm">Email</p>
              <p className="text-lg font-semibold truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-orange-100 text-sm">Status</p>
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
                    ? 'border-orange-600 text-orange-600'
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
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎫 Open Tickets</h3>
                <p className="text-gray-600">Review and resolve support tickets assigned to you.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-red-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🔧 Maintenance Tasks</h3>
                <p className="text-gray-600">Track and manage maintenance activities on campus facilities.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📋 Resource Reports</h3>
                <p className="text-gray-600">View reports on resource usage and availability.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">✅ Completed Work</h3>
                <p className="text-gray-600">Track completed tickets and maintenance tasks.</p>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎫 Support Tickets</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Ticket management feature - coming soon</p>
                <p className="text-sm mt-2">View and resolve support tickets</p>
              </div>
            </div>
          )}

          {activeTab === 'maintenance' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🔧 Maintenance</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Maintenance management feature - coming soon</p>
                <p className="text-sm mt-2">Track and manage facility maintenance</p>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📋 Resource Reports</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Resource reporting feature - coming soon</p>
                <p className="text-sm mt-2">View resource usage and availability reports</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TechnicianDashboard;
