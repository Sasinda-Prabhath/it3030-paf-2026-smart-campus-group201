import { useAuth } from '../features/auth/AuthContext';
import { useState } from 'react';
import { Link } from 'react-router-dom';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'resources', label: 'Resource Management', icon: '📦' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}! 👋</h1>
          <p className="text-gray-600 mt-2">Manager Account</p>
        </div>

        {/* Manager Info Card */}
        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-lg shadow-lg p-6 text-white mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-indigo-100 text-sm">Role</p>
              <p className="text-lg font-semibold">{user?.role}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Access Level</p>
              <p className="text-lg font-semibold">Management</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Email</p>
              <p className="text-lg font-semibold truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-sm">Status</p>
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
                    ? 'border-indigo-600 text-indigo-600'
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
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-indigo-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎫 Ticket Overview</h3>
                <p className="text-gray-600">Monitor all support tickets and their status.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍💼 Team Oversight</h3>
                <p className="text-gray-600">View your team members and technician status.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📦 Resource Oversight</h3>
                <p className="text-gray-600">Oversee campus resources and availability.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-pink-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📈 Performance Reports</h3>
                <p className="text-gray-600">View analytics and performance metrics.</p>
              </div>
            </div>
          )}

          {activeTab === 'tickets' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">🎫 Ticket Management</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Ticket management and assignment feature - coming soon</p>
                <p className="text-sm mt-2">View, assign, and manage all support tickets</p>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Resource Management</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg mb-3">Manage facilities, assets, and booking availability</p>
                <Link
                  to="/resources"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  Open Resource Catalogue
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📈 Reports</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Analytics and reporting feature - coming soon</p>
                <p className="text-sm mt-2">View detailed reports and performance analytics</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;
