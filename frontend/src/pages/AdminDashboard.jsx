import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await adminApi.getUsers();
        setUsers(response.data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const activeCount = users.filter(u => u.accountStatus === 'ACTIVE').length;
  const pendingCount = users.filter(u => u.accountStatus === 'PENDING_APPROVAL').length;
  const suspendedCount = users.filter(u => u.accountStatus === 'SUSPENDED').length;

  return (
    <div className="p-8">
      <div className="max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}! 👋</h1>
          <p className="text-gray-600 mt-2">Admin Account</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg shadow p-6">
            <p className="text-blue-100 text-sm font-medium mb-1">Total Users</p>
            <p className="text-4xl font-bold">{users.length}</p>
            <p className="text-xs text-blue-200 mt-2">Registered accounts</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg shadow p-6">
            <p className="text-green-100 text-sm font-medium mb-1">Active</p>
            <p className="text-4xl font-bold">{activeCount}</p>
            <p className="text-xs text-green-200 mt-2">Active users</p>
          </div>
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg shadow p-6">
            <p className="text-yellow-100 text-sm font-medium mb-1">Pending</p>
            <p className="text-4xl font-bold">{pendingCount}</p>
            <p className="text-xs text-yellow-200 mt-2">Awaiting approval</p>
          </div>
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white rounded-lg shadow p-6">
            <p className="text-red-100 text-sm font-medium mb-1">Suspended</p>
            <p className="text-4xl font-bold">{suspendedCount}</p>
            <p className="text-xs text-red-200 mt-2">Suspended accounts</p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 px-6 py-6 flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">👥 User Management</h2>
              <p className="text-gray-600 text-sm mt-1">Manage system users and their roles</p>
            </div>
            <Link to="/admin/users" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-all">
              Manage All Users →
            </Link>
          </div>

          {loading ? (
            <div className="px-6 py-12 text-center">
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : error ? (
            <div className="px-6 py-12 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Email</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Name</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Role</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Status</th>
                    <th className="text-left px-6 py-3 font-semibold text-gray-900 text-sm">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 10).map(u => (
                    <tr key={u.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-blue-600 font-medium text-sm">{u.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-900 text-sm">{u.fullName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          u.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          u.accountStatus === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {u.accountStatus}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-gray-600 text-sm">{new Date(u.createdAt).toLocaleDateString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* System Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-start">
              <div className="text-3xl mr-4">📦</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Resources</h3>
                <p className="text-sm text-gray-600 mb-3">Manage facility resources and inventory</p>
                <p className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded inline-block">Module A</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-start">
              <div className="text-3xl mr-4">📅</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Bookings</h3>
                <p className="text-sm text-gray-600 mb-3">Manage facility reservations and scheduling</p>
                <p className="text-xs bg-green-50 text-green-600 px-2 py-1 rounded inline-block">Module B</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-start">
              <div className="text-3xl mr-4">🎫</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Tickets</h3>
                <p className="text-sm text-gray-600 mb-3">Track and manage maintenance requests</p>
                <p className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded inline-block">Module C</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;