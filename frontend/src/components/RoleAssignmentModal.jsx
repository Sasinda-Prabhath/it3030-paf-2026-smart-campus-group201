import { useState } from 'react';
import { adminApi } from '../api/admin';
import { useAuth } from '../features/auth/AuthContext';

const RoleAssignmentModal = ({ user, isOpen, onClose, onSuccess }) => {
  const { user: currentUser } = useAuth();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Determine which roles this user can assign
  const getAssignableRoles = () => {
    if (currentUser?.role === 'ADMIN') {
      return ['USER', 'TECHNICIAN', 'MANAGER'];
    } else if (currentUser?.role === 'MANAGER') {
      return ['USER', 'TECHNICIAN'];
    }
    return [];
  };

  const assignableRoles = getAssignableRoles();

  const handleAssignRole = async () => {
    if (selectedRole === user?.role) {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await adminApi.updateUserRole(user.id, selectedRole);
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to assign role');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h2 className="text-xl font-bold text-gray-900">Assign Role</h2>
          <p className="text-sm text-gray-600 mt-1">{user?.fullName} ({user?.email})</p>
        </div>

        {/* Content */}
        <div className="px-6 py-4 max-h-96 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-900 mb-3">Select Role:</label>
            
            {assignableRoles.map(role => (
              <div key={role} className="flex items-center">
                <input
                  type="radio"
                  id={`role-${role}`}
                  name="role"
                  value={role}
                  checked={selectedRole === role}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <label htmlFor={`role-${role}`} className="ml-3 flex items-center cursor-pointer">
                  <span className="text-sm font-medium text-gray-900">{role}</span>
                  <span className="ml-2 text-xs text-gray-500">
                    {role === 'USER' && '(Regular User)'}
                    {role === 'TECHNICIAN' && '(Technical Support)'}
                    {role === 'MANAGER' && '(Management Access)'}
                  </span>
                </label>
              </div>
            ))}

            {assignableRoles.length === 0 && (
              <p className="text-gray-600 text-sm">You don't have permission to assign roles.</p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleAssignRole}
            disabled={loading || assignableRoles.length === 0}
            className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Assigning...' : 'Assign Role'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssignmentModal;
