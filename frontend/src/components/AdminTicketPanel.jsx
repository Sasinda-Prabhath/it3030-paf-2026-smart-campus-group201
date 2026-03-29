import { useEffect, useState } from 'react';
import { ticketsApi } from '../api/tickets';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const STATUS_BADGE_CLASS = {
  OPEN: 'bg-amber-100 text-amber-800 border border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border border-blue-200',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  CLOSED: 'bg-gray-200 text-gray-800 border border-gray-300',
};

const AdminTicketPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusValue, setStatusValue] = useState('OPEN');
  const [assignEmail, setAssignEmail] = useState('');
  const [comment, setComment] = useState('');
  const [savingStatus, setSavingStatus] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketsApi.getAdminTickets();
      const nextTickets = response.data || [];
      setTickets(nextTickets);

      if (selectedTicket?.id) {
        const exists = nextTickets.some((ticket) => ticket.id === selectedTicket.id);
        if (!exists) {
          setSelectedTicket(null);
          setAssignEmail('');
          setComment('');
        }
      }
    } catch (error) {
      console.error('Failed to load all tickets', error);
      window.alert(error?.response?.data?.message || 'Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openTicket = async (ticketId) => {
    try {
      const response = await ticketsApi.getAdminTicket(ticketId);
      const detail = response.data;
      setSelectedTicket(detail);
      setStatusValue(detail?.status || 'OPEN');
      setAssignEmail(detail?.assignedToEmail || '');
      setComment('');
    } catch (error) {
      console.error('Failed to open ticket detail', error);
      window.alert(error?.response?.data?.message || 'Failed to open ticket');
    }
  };

  const assignTicket = async () => {
    if (!selectedTicket?.id || !assignEmail.trim()) {
      return;
    }

    setAssigning(true);
    try {
      await ticketsApi.assignTicket(selectedTicket.id, assignEmail.trim());
      await loadTickets();
      await openTicket(selectedTicket.id);
    } catch (error) {
      console.error('Failed to assign ticket', error);
      window.alert(error?.response?.data?.message || 'Failed to assign ticket');
    } finally {
      setAssigning(false);
    }
  };

  const updateStatus = async () => {
    if (!selectedTicket?.id) {
      return;
    }

    setSavingStatus(true);
    try {
      await ticketsApi.updateAdminStatus(selectedTicket.id, statusValue);
      await loadTickets();
      await openTicket(selectedTicket.id);
    } catch (error) {
      console.error('Failed to update status', error);
      window.alert(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setSavingStatus(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();
    if (!selectedTicket?.id || !comment.trim()) {
      return;
    }

    setCommenting(true);
    try {
      await ticketsApi.addAdminComment(selectedTicket.id, comment.trim());
      setComment('');
      await openTicket(selectedTicket.id);
      await loadTickets();
    } catch (error) {
      console.error('Failed to add comment', error);
      window.alert(error?.response?.data?.message || 'Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const onUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!selectedTicket?.id || !file) {
      return;
    }

    setUploading(true);
    try {
      await ticketsApi.uploadAdminAttachment(selectedTicket.id, file);
      await openTicket(selectedTicket.id);
      await loadTickets();
    } catch (error) {
      console.error('Failed to upload attachment', error);
      window.alert(error?.response?.data?.message || 'Failed to upload attachment');
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const deleteTicket = async () => {
    const ticketId = Number(selectedTicket?.id ?? selectedTicket?.ticketId);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      window.alert('Cannot delete this ticket right now. Please re-open the ticket and try again.');
      return;
    }

    const shouldDelete = window.confirm('Delete this ticket? This action cannot be undone.');
    if (!shouldDelete) {
      return;
    }

    setDeleting(true);
    try {
      await ticketsApi.deleteAdminTicket(ticketId);
      setSelectedTicket(null);
      setAssignEmail('');
      setComment('');
      await loadTickets();
    } catch (error) {
      console.error('Failed to delete ticket', error);
      window.alert(error?.response?.data?.message || 'Failed to delete ticket');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 bg-white rounded-lg shadow border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">All Tickets</h3>
          <button type="button" onClick={loadTickets} className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200">Refresh</button>
        </div>

        <div className="max-h-[620px] overflow-auto divide-y divide-gray-100">
          {loading && <p className="p-4 text-sm text-gray-600">Loading...</p>}
          {!loading && tickets.length === 0 && <p className="p-4 text-sm text-gray-600">No tickets found.</p>}

          {!loading && tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => openTicket(ticket.id)}
              className={`w-full text-left p-4 hover:bg-blue-50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-blue-50' : ''}`}
            >
              <p className="font-semibold text-gray-900">#{ticket.id} {ticket.title}</p>
              <p className="text-xs mt-1">
                <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE_CLASS[ticket.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                  {ticket.status}
                </span>
              </p>
              <p className="text-xs text-gray-600">Assigned: {ticket.assignedToName || ticket.assignedToEmail || 'Unassigned'}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="xl:col-span-2 bg-white rounded-lg shadow border border-gray-100 p-6">
        {!selectedTicket && <p className="text-gray-600">Select a ticket to assign or update.</p>}

        {selectedTicket && (
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-gray-900">#{selectedTicket.id} {selectedTicket.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_CLASS[selectedTicket.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                {selectedTicket.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{selectedTicket.description}</p>
            <p className="text-sm text-gray-600">Requester: {selectedTicket.createdByName || selectedTicket.createdByEmail}</p>
            <p className="text-sm text-gray-600">Location: {selectedTicket.location}</p>
            <div className="mt-3">
              <button
                type="button"
                onClick={deleteTicket}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Delete Ticket'}
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign To (technician email)</label>
                <div className="flex gap-2">
                  <input
                    value={assignEmail}
                    onChange={(event) => setAssignEmail(event.target.value)}
                    type="email"
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                    placeholder="technician@example.com"
                  />
                  <button
                    type="button"
                    onClick={assignTicket}
                    disabled={assigning}
                    className="px-4 py-2 text-sm rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                  >
                    {assigning ? 'Assigning...' : 'Assign'}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-2">
                  <select
                    value={statusValue}
                    onChange={(event) => setStatusValue(event.target.value)}
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={updateStatus}
                    disabled={savingStatus}
                    className="px-4 py-2 text-sm rounded bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                  >
                    {savingStatus ? 'Saving...' : 'Update'}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Upload Attachment</label>
              <input
                type="file"
                onChange={onUpload}
                disabled={uploading}
                className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
              />
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Comments</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-1">
                {(selectedTicket.comments || []).length === 0 && <p className="text-sm text-gray-600">No comments yet.</p>}
                {(selectedTicket.comments || []).map((item) => (
                  <div key={item.id} className="border border-gray-200 rounded p-3">
                    <p className="text-sm text-gray-900">{item.comment}</p>
                    <p className="text-xs text-gray-600 mt-1">{item.authorName || item.authorEmail}</p>
                  </div>
                ))}
              </div>

              <form onSubmit={submitComment} className="mt-3">
                <textarea
                  value={comment}
                  onChange={(event) => setComment(event.target.value)}
                  placeholder="Add admin update comment"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px]"
                />
                <button
                  type="submit"
                  disabled={commenting}
                  className="mt-2 px-4 py-2 text-sm rounded bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                >
                  {commenting ? 'Saving...' : 'Add Comment'}
                </button>
              </form>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Attachments</h4>
              <div className="space-y-2">
                {(selectedTicket.attachments || []).length === 0 && <p className="text-sm text-gray-600">No attachments yet.</p>}
                {(selectedTicket.attachments || []).map((item) => (
                  <a
                    key={item.id}
                    href={ticketsApi.getAdminAttachmentDownloadUrl(selectedTicket.id, item.id)}
                    target="_blank"
                    rel="noreferrer"
                    className="block border border-gray-200 rounded px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    {item.originalFileName} ({Math.ceil((item.fileSizeBytes || 0) / 1024)} KB)
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminTicketPanel;
