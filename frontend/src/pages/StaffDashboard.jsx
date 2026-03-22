import React from 'react';
import { Link } from 'react-router-dom';

export default function StaffDashboard({ user }) {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.fullName}!</h1>
          <p className="text-gray-600 mt-2">Staff Dashboard</p>
        </div>

        {/* Role & Classification Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Staff Information</h2>
            <div className="space-y-3">
              <p><span className="text-gray-600">Email:</span> <span className="font-medium">{user?.email}</span></p>
              <p><span className="text-gray-600">Role:</span> <span className="font-medium text-blue-600">{user?.role}</span></p>
              <p><span className="text-gray-600">Type:</span> <span className="font-medium">{user?.userType}</span></p>
              <p><span className="text-gray-600">Staff Type:</span> <span className="font-medium">{user?.staffType || 'N/A'}</span></p>
              <p><span className="text-gray-600">Status:</span> <span className="font-medium text-green-600">{user?.accountStatus}</span></p>
            </div>
          </div>

          {/* Notifications Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Notifications</h2>
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Your notification summary appears here</p>
              <Link to="/notifications" className="text-blue-600 hover:text-blue-800 font-medium">View All Notifications →</Link>
            </div>
          </div>
        </div>

        {/* Placeholder Operational Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resource Operations Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Resource Operations</h3>
            <p className="text-gray-600 mb-4">This feature is part of Module A and is being developed by another team member.</p>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>

          {/* Ticket Handling Placeholder */}
          <div className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">Ticket Handling</h3>
            <p className="text-gray-600 mb-4">This feature is part of Module C and is being developed by another team member.</p>
            <p className="text-sm text-gray-500">Coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
