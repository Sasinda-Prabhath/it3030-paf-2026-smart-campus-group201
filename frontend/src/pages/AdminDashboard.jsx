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
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">System Administration & User Management</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 font-medium mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{users.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 font-medium mb-2">Active</h3>
            <p className="text-3xl font-bold text-green-600">{activeCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 font-medium mb-2">Pending Approval</h3>
            <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 font-medium mb-2">Suspended</h3>
            <p className="text-3xl font-bold text-red-600">{suspendedCount}</p>
          </div>
        </div>

        {/* User Management Section */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">User Management</h2>
            <Link to="/admin/users" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-medium">
              Manage All Users →
            </Link>
          </div>
          
          {loading ? (
            <p className="text-gray-600">Loading users...</p>
          ) : error ? (
            <p className="text-red-600">{error}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="text-left p-3 font-medium">Email</th>
                    <th className="text-left p-3 font-medium">Name</th>
                    <th className="text-left p-3 font-medium">Role</th>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Created</th>
                  </tr>
                </thead>
                <tbody>
                  {users.slice(0, 5).map(u => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="p-3 text-blue-600">{u.email}</td>
                      <td className="p-3">{u.fullName}</td>
                      <td className="p-3">{u.role}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          u.accountStatus === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                          u.accountStatus === 'SUSPENDED' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {u.accountStatus}
                        </span>
                      </td>
                      <td className="p-3 text-gray-600 text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Placeholder System Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Resources</h3>
            <p className="text-gray-600 mb-4">System overview for Resource Management</p>
            <p className="text-sm text-gray-500">Module A - Coming soon...</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Bookings</h3>
            <p className="text-gray-600 mb-4">System overview for Booking Management</p>
            <p className="text-sm text-gray-500">Module B - Coming soon...</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Tickets</h3>
            <p className="text-gray-600 mb-4">System overview for Ticket Management</p>
            <p className="text-sm text-gray-500">Module C - Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;