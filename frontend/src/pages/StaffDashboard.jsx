import React from 'react';
import { Link } from 'react-router-dom';

export default function StaffDashboard({ user }) {
  return (
    <div className="p-8">
      <div className="max-w-6xl">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.fullName}! 👋</h1>
          <p className="text-gray-600 mt-1">Staff Operations Dashboard</p>
        </div>

        {/* Staff Info Card */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Position</p>
            <p className="text-2xl font-bold text-gray-900">{user?.staffType || 'Staff'}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Role</p>
            <p className="text-2xl font-bold text-gray-900">{user?.role}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Department</p>
            <p className="text-2xl font-bold text-gray-900">{user?.userType}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <p className="text-gray-600 text-sm font-medium mb-1">Status</p>
            <p className="text-2xl font-bold text-gray-900">{user?.accountStatus}</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Staff Info Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">👔 Staff Information</h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Name</p>
                <p className="text-sm text-gray-900 font-medium">{user?.fullName}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500 uppercase">Email</p>
                <p className="text-sm text-gray-900 font-medium">{user?.email}</p>
              </div>
              <hr className="my-3" />
              <Link to="/profile" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold">
                View Profile →
              </Link>
            </div>
          </div>

          {/* Notifications Card */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">🔔 Notifications</h2>
            <div className="flex flex-col items-center justify-center py-8">
              <p className="text-4xl mb-2">📬</p>
              <p className="text-gray-600 text-sm text-center">No pending notifications</p>
              <Link to="/notifications" className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700 font-semibold mt-4">
                Check All →
              </Link>
            </div>
          </div>

          {/* Operations Menu */}
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg shadow p-6 text-white">
            <h2 className="text-xl font-bold mb-4">⚙️ Operations</h2>
            <div className="space-y-2">
              <Link to="/tickets" className="block p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-sm font-medium">
                🎫 Manage Tickets
              </Link>
              <Link to="/resources" className="block p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-sm font-medium">
                📦 Resources
              </Link>
              <Link to="/bookings" className="block p-3 bg-white bg-opacity-20 hover:bg-opacity-30 rounded transition-all text-sm font-medium">
                📅 View Bookings
              </Link>
            </div>
          </div>
        </div>

        {/* Operational Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Resource Operations */}
          <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300 hover:border-green-300 transition-colors">
            <div className="flex items-start">
              <div className="text-4xl mr-4">📦</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Resource Management</h3>
                <p className="text-gray-600 text-sm mb-3">Manage campus resources and inventory allocation.</p>
                <p className="text-xs text-gray-500 bg-green-50 px-3 py-1 rounded inline-block">Module A - Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Ticket Handling */}
          <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300 hover:border-purple-300 transition-colors">
            <div className="flex items-start">
              <div className="text-4xl mr-4">🎫</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Ticket Management</h3>
                <p className="text-gray-600 text-sm mb-3">Handle maintenance requests and support tickets.</p>
                <p className="text-xs text-gray-500 bg-purple-50 px-3 py-1 rounded inline-block">Module C - Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300 hover:border-blue-300 transition-colors">
            <div className="flex items-start">
              <div className="text-4xl mr-4">📅</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Booking System</h3>
                <p className="text-gray-600 text-sm mb-3">Manage facility reservations and bookings.</p>
                <p className="text-xs text-gray-500 bg-blue-50 px-3 py-1 rounded inline-block">Module B - Coming Soon</p>
              </div>
            </div>
          </div>

          {/* Comments */}
          <div className="bg-white rounded-lg shadow p-6 border-2 border-dashed border-gray-300 hover:border-orange-300 transition-colors">
            <div className="flex items-start">
              <div className="text-4xl mr-4">💬</div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 mb-2">Team Communication</h3>
                <p className="text-gray-600 text-sm mb-3">Collaborate and leave feedback on operations.</p>
                <p className="text-xs text-gray-500 bg-orange-50 px-3 py-1 rounded inline-block">Module D - Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
