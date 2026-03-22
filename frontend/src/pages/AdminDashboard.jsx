import { useState, useEffect } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <p className="mb-4">Welcome, {user?.fullName}. You have full administrative access.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">User Management</h2>
          <p className="text-gray-600 mb-4">Manage user roles and classifications</p>
          <Link
            to="/admin/users"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Users
          </Link>
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">System Overview</h2>
          <p className="text-gray-600 mb-4">View system statistics and logs</p>
          <button
            className="bg-gray-500 text-white font-bold py-2 px-4 rounded cursor-not-allowed"
            disabled
          >
            Coming Soon
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;