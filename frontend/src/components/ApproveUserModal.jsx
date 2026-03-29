import { useState } from 'react';
import { adminApi } from '../api/admin';

const ApproveUserModal = ({ user, isOpen, onClose, onSuccess }) => {
  const [selectedRole, setSelectedRole] = useState('USER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen || !user) return null;

  const handleApprove = async () => {
    setLoading(true);
    setError(null);
    try {
      // First update status to ACTIVE
      await adminApi.updateUserStatus(user.id, 'ACTIVE');
      // Then assign role
      await adminApi.updateUserRole(user.id, selectedRole);
      onSuccess();
      resetForm();
    } catch (err) {
      const backendMessage = err?.response?.data?.message;
      setError(backendMessage || 'Failed to approve user. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeny = async () => {
    setLoading(true);
    setError(null);
    try {
      await adminApi.updateUserStatus(user.id, 'SUSPENDED');
      onSuccess();
      resetForm();
    } catch (err) {
      setError('Failed to deny user. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSelectedRole('USER');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Review Account</h2>
        </div>

        <div className="px-6 py-4">
          {/* User Details */}
          <div className="mb-6 pb-6 border-b border-gray-200">
            <div className="mb-4">
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-lg font-semibold text-gray-900">{user.fullName}</p>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-lg font-semibold text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">User Type</p>
              <p className="text-lg font-semibold text-gray-900">{user.userType || 'Not Set'}</p>
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign Role
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            >
              <option value="USER">USER</option>
              <option value="TECHNICIAN">TECHNICIAN</option>
              <option value="MANAGER">MANAGER</option>
            </select>
            <p className="mt-2 text-xs text-gray-600">
              Select the role to assign after approval
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleApprove}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
            >
              {loading ? 'Processing...' : 'Approve & Assign'}
            </button>
            <button
              onClick={handleDeny}
              disabled={loading}
              className="flex-1 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
            >
              {loading ? 'Processing...' : 'Deny'}
            </button>
            <button
              onClick={resetForm}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-900 py-2 px-4 rounded-md hover:bg-gray-400 disabled:cursor-not-allowed transition duration-150"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApproveUserModal;
