import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Link } from 'react-router-dom';
import { adminApi } from '../api/admin';
import { bookingRequestsApi } from '../api/bookingRequests';

const FACILITY_TYPES = ['LECTURE_HALL', 'MEETING_ROOM', 'LAB'];

const BOOKING_STATUS_BADGE = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [bookingReasons, setBookingReasons] = useState({});
  const [bookingFilter, setBookingFilter] = useState('PENDING');

  const loadBookingRequests = async () => {
    const response = await bookingRequestsApi.getAll();
    setBookingRequests(response.data || []);
  };

  const reviewBooking = async (requestId, nextStatus) => {
    const reason = (bookingReasons[requestId] || '').trim();
    if (!reason) {
      window.alert('A reason is required before approving or rejecting.');
      return;
    }
    await bookingRequestsApi.review(requestId, {
      status: nextStatus,
      reason,
      reviewedBy: user?.fullName || 'Admin',
    });
    await loadBookingRequests();
  };

  const filteredBookings = useMemo(() => {
    if (bookingFilter === 'ALL') return bookingRequests;
    return bookingRequests.filter((r) => r.status === bookingFilter);
  }, [bookingRequests, bookingFilter]);

  const pendingBookingCount = useMemo(
    () => bookingRequests.filter((r) => r.status === 'PENDING').length,
    [bookingRequests]
  );

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
    loadBookingRequests();
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
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
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
          <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-lg shadow p-6">
            <p className="text-indigo-100 text-sm font-medium mb-1">Pending Bookings</p>
            <p className="text-4xl font-bold">{pendingBookingCount}</p>
            <p className="text-xs text-indigo-200 mt-2">Awaiting review</p>
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

        {/* Booking Request Review Section */}
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="border-b border-gray-200 px-6 py-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">✅ Booking Request Review</h2>
              <p className="text-gray-600 text-sm mt-1">Approve or reject student booking requests with a reason</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-700">Filter:</span>
              <select
                value={bookingFilter}
                onChange={(e) => setBookingFilter(e.target.value)}
                className="px-3 py-2 text-sm border border-gray-300 rounded-md"
              >
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="ALL">All</option>
              </select>
            </div>
          </div>

          <div className="p-6 space-y-4">
            {filteredBookings.length === 0 && (
              <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                No booking requests found.
              </div>
            )}

            {filteredBookings.map((request) => {
              const isFacility = FACILITY_TYPES.includes(request.resourceType);
              return (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4 shadow-sm">
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{request.resourceName}</h3>
                      <p className="text-sm text-gray-500">{request.resourceType.replaceAll('_', ' ')} &bull; {request.location}</p>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold ${BOOKING_STATUS_BADGE[request.status] || 'bg-gray-100 text-gray-700'}`}>
                      {request.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
                    <p><span className="font-medium text-gray-900">Requester:</span> {request.requesterName} ({request.requesterEmail})</p>
                    <p><span className="font-medium text-gray-900">Date:</span> {request.bookingDate}</p>
                    {isFacility && request.timeRange && <p><span className="font-medium text-gray-900">Time:</span> {request.timeRange}</p>}
                    {isFacility && request.attendees != null && <p><span className="font-medium text-gray-900">Expected Attendees:</span> {request.attendees}</p>}
                    {!isFacility && request.expectedAmount != null && <p><span className="font-medium text-gray-900">Expected Amount:</span> {request.expectedAmount}</p>}
                    {request.purpose && <p className="md:col-span-2"><span className="font-medium text-gray-900">Purpose:</span> {request.purpose}</p>}
                    {request.reviewedBy && <p className="md:col-span-2"><span className="font-medium text-gray-900">Reviewed By:</span> {request.reviewedBy}</p>}
                    {request.adminReason && request.status !== 'PENDING' && (
                      <p className="md:col-span-2"><span className="font-medium text-gray-900">Admin Reason:</span> {request.adminReason}</p>
                    )}
                  </div>

                  {request.status === 'PENDING' && (
                    <div className="border-t border-gray-200 pt-3">
                      <label className="block text-sm text-gray-700 mb-2">Reason <span className="text-red-500">*</span></label>
                      <textarea
                        value={bookingReasons[request.id] ?? ''}
                        onChange={(e) => setBookingReasons((prev) => ({ ...prev, [request.id]: e.target.value }))}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md min-h-[70px]"
                        placeholder="Provide a reason for approval or rejection"
                      />
                      <div className="mt-2 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => reviewBooking(request.id, 'APPROVED')}
                          className="px-4 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                        >
                          Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => reviewBooking(request.id, 'REJECTED')}
                          className="px-4 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
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