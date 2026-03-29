import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { bookingRequestsApi } from '../api/bookingRequests';

const FACILITY_TYPES = ['LECTURE_HALL', 'MEETING_ROOM', 'LAB'];

const STATUS_BADGE = {
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
};

const AdminBookingRequestsPage = () => {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [reasons, setReasons] = useState({});
  const [statusFilter, setStatusFilter] = useState('PENDING');

  const loadRequests = async () => {
    const response = await bookingRequestsApi.getAll();
    setRequests(response.data || []);
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const filteredRequests = useMemo(() => {
    if (statusFilter === 'ALL') {
      return requests;
    }
    return requests.filter((request) => request.status === statusFilter);
  }, [requests, statusFilter]);

  const reviewRequest = async (requestId, nextStatus) => {
    const reason = (reasons[requestId] || '').trim();
    if (!reason) {
      window.alert('Reason is required for approval or rejection.');
      return;
    }

    await bookingRequestsApi.review(requestId, {
      status: nextStatus,
      reason,
      reviewedBy: user?.fullName || 'Admin',
    });

    await loadRequests();
  };

  return (
    <div className="min-h-full bg-slate-50 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Booking Request Review</h1>
        <p className="text-slate-600 mb-6">Review, approve, or reject booking requests with a reason.</p>

        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-5 flex flex-wrap items-center gap-3">
          <span className="text-sm text-slate-700">Filter:</span>
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="px-3 py-2 text-sm border border-slate-300 rounded-md"
          >
            <option value="PENDING">Pending</option>
            <option value="APPROVED">Approved</option>
            <option value="REJECTED">Rejected</option>
            <option value="ALL">All</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredRequests.map((request) => {
            const isFacilityRequest = FACILITY_TYPES.includes(request.resourceType);

            return (
              <article key={request.id} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4">
                <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">{request.resourceName}</h2>
                    <p className="text-sm text-slate-600">
                      {request.resourceType.replaceAll('_', ' ')} | {request.location}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full font-semibold ${STATUS_BADGE[request.status] || 'bg-slate-100 text-slate-700'}`}>
                    {request.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-700 mb-3">
                  <p><span className="font-medium text-slate-900">Requester:</span> {request.requesterName} ({request.requesterEmail})</p>
                  <p><span className="font-medium text-slate-900">Date:</span> {request.bookingDate}</p>
                  {isFacilityRequest && <p><span className="font-medium text-slate-900">Time:</span> {request.timeRange}</p>}
                  {isFacilityRequest && <p><span className="font-medium text-slate-900">Expected Attendees:</span> {request.attendees}</p>}
                  {!isFacilityRequest && <p><span className="font-medium text-slate-900">Expected Amount:</span> {request.expectedAmount}</p>}
                  <p className="md:col-span-2"><span className="font-medium text-slate-900">Purpose:</span> {request.purpose}</p>
                  {request.reviewedBy && (
                    <p className="md:col-span-2"><span className="font-medium text-slate-900">Reviewed By:</span> {request.reviewedBy}</p>
                  )}
                </div>

                <div className="border-t border-slate-200 pt-3">
                  <label className="block text-sm text-slate-700 mb-2">Reason</label>
                  <textarea
                    value={reasons[request.id] ?? request.adminReason ?? ''}
                    onChange={(event) => setReasons((prev) => ({ ...prev, [request.id]: event.target.value }))}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md min-h-[74px]"
                    placeholder="Add reason for approval or rejection"
                  />

                  {request.status === 'PENDING' && (
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => reviewRequest(request.id, 'APPROVED')}
                        className="px-3 py-1.5 text-sm rounded-md bg-green-600 text-white hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() => reviewRequest(request.id, 'REJECTED')}
                        className="px-3 py-1.5 text-sm rounded-md bg-red-600 text-white hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </article>
            );
          })}

          {filteredRequests.length === 0 && (
            <div className="bg-white border border-dashed border-slate-300 rounded-xl p-8 text-center text-slate-600">
              No booking requests found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingRequestsPage;
