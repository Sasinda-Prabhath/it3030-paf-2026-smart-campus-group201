import { useAuth } from '../features/auth/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingRequestsApi } from '../api/bookingRequests';
import BookingRequestModal from '../components/BookingRequestModal';
import UserTicketPanel from '../components/UserTicketPanel';

const FACILITY_TYPES = ['LECTURE_HALL', 'MEETING_ROOM', 'LAB'];

const UserDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [myBookings, setMyBookings] = useState([]);
  const [bookingModalState, setBookingModalState] = useState({ isOpen: false, request: null, resource: null });

  const loadMyBookings = async () => {
    if (!user?.email) {
      setMyBookings([]);
      return;
    }

    const response = await bookingRequestsApi.getAll();
    const all = response.data || [];
    setMyBookings(all.filter((r) => r.requesterEmail === user.email));
  };

  useEffect(() => {
    if (activeTab === 'bookings') {
      loadMyBookings();
    }
  }, [activeTab, user?.email]);

  const openEditBooking = (request) => {
    if (request.status !== 'PENDING') {
      return;
    }

    setBookingModalState({
      isOpen: true,
      request,
      resource: {
        id: request.resourceId,
        name: request.resourceName,
        type: request.resourceType,
      },
    });
  };

  const closeEditBooking = () => {
    setBookingModalState({ isOpen: false, request: null, resource: null });
  };

  const submitBookingUpdate = async (formData) => {
    if (!bookingModalState.request?.id) {
      return;
    }

    try {
      await bookingRequestsApi.update(bookingModalState.request.id, formData);
      await loadMyBookings();
      window.alert('Booking request updated successfully.');
    } catch (err) {
      window.alert(err.response?.data?.message || 'Failed to update booking request due to a scheduling conflict or server error.');
    }
  };

  const deleteBookingRequest = async (requestId) => {
    if (!window.confirm('Delete this booking request?')) {
      return;
    }

    await bookingRequestsApi.delete(requestId);
    await loadMyBookings();
    window.alert('Booking request deleted successfully.');
  };

  const cancelBookingRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to cancel this approved booking?')) {
      return;
    }

    try {
      await bookingRequestsApi.cancel(requestId);
      await loadMyBookings();
      window.alert('Booking request cancelled successfully.');
    } catch (err) {
      window.alert('Failed to cancel booking request. ' + (err.response?.data?.message || ''));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'resources', label: 'Resources', icon: '📦' },
    { id: 'bookings', label: 'Bookings', icon: '📅' },
    { id: 'tickets', label: 'Support Tickets', icon: '🎫' },
  ];

  return (
    <div className="p-8">
      <div className="max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user?.fullName}! 👋</h1>
          <p className="text-gray-600 mt-2">
            {user?.userType === 'STUDENT' ? 'Student' : 'Lecturer'} Account
          </p>
        </div>

        {/* User Info Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg p-6 text-white mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm">Role</p>
              <p className="text-lg font-semibold">{user?.role}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">User Type</p>
              <p className="text-lg font-semibold">{user?.userType}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Email</p>
              <p className="text-lg font-semibold truncate">{user?.email}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm">Status</p>
              <p className="text-lg font-semibold">{user?.accountStatus || 'ACTIVE'}</p>
            </div>
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <div className="flex gap-4 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors border-b-2 ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📚 Available Resources</h3>
                <p className="text-gray-600">View and manage campus resources available for your use.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📅 Manage Bookings</h3>
                <p className="text-gray-600">Book and manage campus facilities and resources.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">🎫 Support & Issues</h3>
                <p className="text-gray-600">Create and track support tickets for technical issues.</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-600">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">📢 Announcements</h3>
                <p className="text-gray-600">Stay updated with latest campus announcements.</p>
              </div>
            </div>
          )}

          {activeTab === 'resources' && (
            <div className="bg-white rounded-lg shadow p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">📦 Resources</h2>
              <div className="bg-gray-50 rounded-lg p-6 text-center text-gray-600">
                <p className="text-lg mb-3">View Facility and Asset catalogues</p>
                <p className="text-sm mb-4">Students can only view resources and submit booking requests.</p>
                <Link
                  to="/resources"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                >
                  Open Resource Catalogue
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="bg-white rounded-lg shadow p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">📅 My Booking Requests</h2>
                  <p className="text-gray-600 text-sm mt-1">Track admin decisions on your submitted requests</p>
                </div>
                <Link
                  to="/resources"
                  className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm"
                >
                  + New Booking
                </Link>
              </div>

              {myBookings.length === 0 ? (
                <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center text-gray-500">
                  <p>No booking requests yet.</p>
                  <Link to="/resources" className="mt-3 inline-block text-blue-600 hover:underline text-sm">
                    Browse resources to make a booking
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {myBookings.map((request) => (
                    <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">{request.resourceName}</p>
                          <p className="text-xs text-gray-500">{request.resourceType.replaceAll('_', ' ')} &bull; {request.location}</p>
                        </div>
                        <span className={`px-2 py-0.5 text-xs rounded-full font-semibold ${
                          request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                          request.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                          request.status === 'CANCELLED' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {request.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-700 space-y-1">
                        <p><span className="font-medium">Date:</span> {request.bookingDate}</p>
                        {request.timeRange && <p><span className="font-medium">Time:</span> {request.timeRange}</p>}
                        {request.attendees != null && <p><span className="font-medium">Expected Attendees:</span> {request.attendees}</p>}
                        {request.expectedAmount != null && <p><span className="font-medium">Expected Amount:</span> {request.expectedAmount}</p>}
                        <p><span className="font-medium">Purpose:</span> {request.purpose}</p>
                        {request.adminReason && (
                          <p className={`mt-1 font-medium ${request.status === 'REJECTED' ? 'text-red-700' : 'text-green-700'}`}>
                            Admin note: {request.adminReason}
                          </p>
                        )}
                        {request.status === 'PENDING' && (
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => openEditBooking(request)}
                              className="px-3 py-1 text-xs rounded-md bg-blue-600 text-white hover:bg-blue-700"
                            >
                              Edit Request
                            </button>
                            <button
                              type="button"
                              onClick={() => deleteBookingRequest(request.id)}
                              className="px-3 py-1 text-xs rounded-md bg-red-600 text-white hover:bg-red-700"
                            >
                              Delete Request
                            </button>
                          </div>
                        )}
                        {request.status === 'APPROVED' && (
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => cancelBookingRequest(request.id)}
                              className="px-3 py-1 text-xs rounded-md bg-orange-600 text-white hover:bg-orange-700"
                            >
                              Cancel Booking
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'tickets' && (
            <UserTicketPanel />
          )}
        </div>
      </div>

      <BookingRequestModal
        isOpen={bookingModalState.isOpen}
        resource={bookingModalState.resource}
        initialValues={bookingModalState.request}
        title={bookingModalState.request ? `Update ${bookingModalState.request.resourceName}` : 'Update Booking'}
        submitLabel="Update Request"
        onClose={closeEditBooking}
        onSubmit={submitBookingUpdate}
      />
    </div>
  );
};

export default UserDashboard;
