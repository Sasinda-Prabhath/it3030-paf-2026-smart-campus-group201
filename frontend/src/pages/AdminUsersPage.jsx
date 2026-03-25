import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import { useAuth } from '../features/auth/AuthContext';
import ApproveUserModal from '../components/ApproveUserModal';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [editingRoleUserId, setEditingRoleUserId] = useState(null);
  const [editingRoleValue, setEditingRoleValue] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await adminApi.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to load users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReviewPending = (pendingUser) => {
    setSelectedUser(pendingUser);
    setShowApproveModal(true);
  };

  const handleApprovalSuccess = () => {
    loadUsers();
    setShowApproveModal(false);
    setSelectedUser(null);
  };

  const handleStartEditRole = (userId, currentRole) => {
    setEditingRoleUserId(userId);
    setEditingRoleValue(currentRole);
  };

  const handleSaveRole = async (userId) => {
    try {
      await adminApi.updateUserRole(userId, editingRoleValue);
      setUsers(prev =>
        prev.map(u => u.id === userId ? { ...u, role: editingRoleValue } : u)
      );
      setEditingRoleUserId(null);
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const handleCancelEditRole = () => {
    setEditingRoleUserId(null);
    setEditingRoleValue('');
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      try {
        await adminApi.deleteUser(userId);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } catch (error) {
        console.error('Failed to delete user', error);
        alert('Failed to delete user. Please try again.');
      }
    }
  };

  // Filter users based on tab
  const filteredUsers = users
    .filter(u => {
      if (activeTab === 'pending') {
        return u.accountStatus === 'PENDING_APPROVAL';
      }
      if (activeTab === 'managers') {
        return u.role === 'MANAGER';
      }
      if (activeTab === 'technicians') {
        return u.role === 'TECHNICIAN';
      }
      return true; // Show all users
    })
    .filter(u => {
      const fullName = u.fullName || '';
      const email = u.email || '';
      return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
             email.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const pendingCount = users.filter(u => u.accountStatus === 'PENDING_APPROVAL').length;

  if (loading)
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading users...</p>
        </div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
        <p className="text-gray-600 mt-2">Manage user roles and account approvals</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            All Users ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap relative ${
              activeTab === 'pending'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Pending Approval
            {pendingCount > 0 && (
              <span className="ml-2 inline-block bg-red-600 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
                {pendingCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('managers')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'managers'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Managers ({users.filter(u => u.role === 'MANAGER').length})
          </button>
          <button
            onClick={() => setActiveTab('technicians')}
            className={`py-4 px-2 font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'technicians'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            Technicians ({users.filter(u => u.role === 'TECHNICIAN').length})
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      {filteredUsers.length === 0 ? (
        <div className="bg-white p-12 rounded-lg shadow text-center">
          <p className="text-gray-500 text-lg">
            {searchTerm
              ? 'No users match your search'
              : activeTab === 'pending'
              ? 'No pending approvals'
              : activeTab === 'managers'
              ? 'No managers found'
              : activeTab === 'technicians'
              ? 'No technicians found'
              : 'No users found'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    User Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50 transition duration-150">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{user.fullName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-gray-900">{user.userType || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingRoleUserId === user.id ? (
                        <div className="flex gap-2">
                          <select
                            value={editingRoleValue}
                            onChange={(e) => setEditingRoleValue(e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="USER">USER</option>
                            <option value="TECHNICIAN">TECHNICIAN</option>
                            <option value="MANAGER">MANAGER</option>
                            <option value="ADMIN">ADMIN</option>
                          </select>
                          <button
                            onClick={() => handleSaveRole(user.id)}
                            className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={handleCancelEditRole}
                            className="px-2 py-1 bg-gray-300 text-gray-900 text-xs rounded hover:bg-gray-400"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm font-medium text-gray-900">{user.role}</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          user.accountStatus === 'ACTIVE'
                            ? 'bg-green-100 text-green-800'
                            : user.accountStatus === 'PENDING_APPROVAL'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.accountStatus === 'PENDING_APPROVAL'
                          ? 'Pending'
                          : user.accountStatus === 'ACTIVE'
                          ? 'Active'
                          : 'Suspended'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex gap-3 items-center">
                        {user.accountStatus === 'PENDING_APPROVAL' ? (
                          <button
                            onClick={() => handleReviewPending(user)}
                            className="text-indigo-600 hover:text-indigo-900 font-semibold"
                          >
                            Review
                          </button>
                        ) : (
                          <button
                            onClick={() => handleStartEditRole(user.id, user.role)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Edit Role
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteUser(user.id, user.fullName || user.email)}
                          className="text-red-600 hover:text-red-900 text-lg"
                          title="Delete user"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold">{filteredUsers.length}</span> of{' '}
              <span className="font-semibold">{users.length}</span> users
            </p>
          </div>
        </div>
      )}

      {/* Approve User Modal */}
      <ApproveUserModal
        user={selectedUser}
        isOpen={showApproveModal}
        onClose={() => {
          setShowApproveModal(false);
          setSelectedUser(null);
        }}
        onSuccess={handleApprovalSuccess}
      />
    </div>
  );
};

export default AdminUsersPage;