import { useAuth } from '../features/auth/AuthContext';
import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import RoleAssignmentModal from '../components/RoleAssignmentModal';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showRoleModal, setShowRoleModal] = useState(false);

  useEffect(() => {
    if (activeTab === 'technicians') {
      loadUsers();
    }
  }, [activeTab]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await adminApi.getUsers();
      setUsers(response.data || []);
    } catch (err) {
      console.error('Failed to load users', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenRoleModal = (userToEdit) => {
    setSelectedUser(userToEdit);
    setShowRoleModal(true);
  };

  const handleRoleAssignmentSuccess = () => {
    loadUsers();
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'tickets', label: 'Tickets', icon: '🎫' },
    { id: 'technicians', label: 'Technician Management', icon: '👨‍💼' },
    { id: 'resources', label: 'Resource Management', icon: '📦' },
    { id: 'reports', label: 'Reports', icon: '📈' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard 📊</h1>
          <p className="text-gray-600 mt-2">Welcome, {user?.fullName}</p>
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
                <h3 className="text-lg font-semibold text-gray-900 mb-2">👨‍💼 Team Management</h3>
                <p className="text-gray-600">Assign TECHNICIAN roles and manage your team.</p>
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

          {activeTab === 'technicians' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">👨‍💼 Technician Management</h2>
              <p className="text-gray-600 mb-6">Assign and manage TECHNICIAN roles for your team members</p>

              {loading ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">No users found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Name</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Email</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Current Role</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">User Type</th>
                        <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50">
                          <td className="px-6 py-4 text-gray-900 font-medium">{u.fullName}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                              u.role === 'TECHNICIAN' ? 'bg-orange-100 text-orange-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {u.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-600">{u.userType || 'N/A'}</td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleOpenRoleModal(u)}
                              className="text-blue-600 hover:text-blue-700 font-medium text-sm"
                            >
                              Edit Role
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Resource Management</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg">Resource management feature - coming soon</p>
                <p className="text-sm mt-2">Manage and allocate campus resources</p>
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

        {/* Role Assignment Modal */}
        {selectedUser && (
          <RoleAssignmentModal
            user={selectedUser}
            isOpen={showRoleModal}
            onClose={() => {
              setShowRoleModal(false);
              setSelectedUser(null);
            }}
            onSuccess={handleRoleAssignmentSuccess}
          />
        )}
      </div>
    </div>
  );
};

export default ManagerDashboard;
