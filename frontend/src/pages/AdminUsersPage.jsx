import { useState, useEffect } from 'react';
import { adminApi } from '../api/admin';
import { useAuth } from '../features/auth/AuthContext';

const AdminUsersPage = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

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

  const handleRoleUpdate = async (userId, newRole) => {
    setUpdating(userId);
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (error) {
      console.error('Failed to update role', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleClassificationUpdate = async (userId, userType, staffType) => {
    setUpdating(userId);
    try {
      await adminApi.updateUserClassification(userId, { userType, staffType });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, userType, staffType } : u));
    } catch (error) {
      console.error('Failed to update classification', error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verified</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.fullName}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                    disabled={updating === user.id}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="USER">USER</option>
                    <option value="STAFF">STAFF</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <select
                    value={user.userType || ''}
                    onChange={(e) => {
                      const userType = e.target.value || null;
                      const staffType = user.role === 'STAFF' ? user.staffType : null;
                      handleClassificationUpdate(user.id, userType, staffType);
                    }}
                    disabled={updating === user.id}
                    className="border border-gray-300 rounded px-2 py-1 text-sm"
                  >
                    <option value="">None</option>
                    <option value="STUDENT">STUDENT</option>
                    <option value="LECTURER">LECTURER</option>
                    <option value="UNIVERSITY_STAFF">UNIVERSITY_STAFF</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {user.role === 'STAFF' ? (
                    <select
                      value={user.staffType || ''}
                      onChange={(e) => {
                        const staffType = e.target.value || null;
                        handleClassificationUpdate(user.id, user.userType, staffType);
                      }}
                      disabled={updating === user.id}
                      className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                      <option value="">None</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="TECHNICIAN">TECHNICIAN</option>
                      <option value="FACILITY_OFFICER">FACILITY_OFFICER</option>
                      <option value="SUPPORT_OFFICER">SUPPORT_OFFICER</option>
                    </select>
                  ) : (
                    <span className="text-gray-400">N/A</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {user.emailVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {updating === user.id ? 'Updating...' : 'Updated'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsersPage;