import { useEffect, useState } from 'react';
import { ticketsApi } from '../api/tickets';
import ServiceLevelTimer from './ServiceLevelTimer';

const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];
const STATUS_BADGE_CLASS = {
  OPEN: 'bg-amber-100 text-amber-800 border border-amber-200',
  IN_PROGRESS: 'bg-blue-100 text-blue-800 border border-blue-200',
  RESOLVED: 'bg-emerald-100 text-emerald-800 border border-emerald-200',
  CLOSED: 'bg-gray-200 text-gray-800 border border-gray-300',
};

const TechnicianTicketPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [resolving, setResolving] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deletingAttachment, setDeletingAttachment] = useState(null);
  const [statusValue, setStatusValue] = useState('OPEN');
  const [resolutionMessage, setResolutionMessage] = useState('');
  const [comment, setComment] = useState('');

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketsApi.getAssigned();
      const nextTickets = response.data || [];
      setTickets(nextTickets);

      if (selectedTicket?.id) {
        const stillExists = nextTickets.some((ticket) => ticket.id === selectedTicket.id);
        if (!stillExists) {
          setSelectedTicket(null);
          setComment('');
        }
      }
    } catch (error) {
      console.error('Failed to load assigned tickets', error);
      const message = error?.response?.data?.message || 'Failed to load assigned tickets';
      window.alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openTicket = async (ticketId) => {
    try {
      const response = await ticketsApi.getAssignedTicket(ticketId);
      setSelectedTicket(response.data);
      setStatusValue(response.data?.status || 'OPEN');
      setResolutionMessage('');
      setComment('');
    } catch (error) {
      console.error('Failed to open assigned ticket', error);
      window.alert(error?.response?.data?.message || 'Failed to open ticket');
    }
  };

  const updateStatus = async () => {
    if (!selectedTicket?.id) {
      return;
    }

    setStatusUpdating(true);
    try {
      await ticketsApi.updateAssignedStatus(selectedTicket.id, statusValue);
      await loadTickets();
      await openTicket(selectedTicket.id);
    } catch (error) {
      console.error('Failed to update status', error);
      window.alert(error?.response?.data?.message || 'Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const resolveTicket = async () => {
    const ticketId = Number(selectedTicket?.id ?? selectedTicket?.ticketId);
    if (!Number.isFinite(ticketId) || ticketId <= 0) {
      window.alert('Cannot resolve this ticket right now. Please re-open the ticket and try again.');
      return;
    }

    if (!resolutionMessage.trim()) {
      window.alert('Please add a resolution message before resolving.');
      return;
    }

    setResolving(true);
    try {
      await ticketsApi.addAssignedComment(ticketId, `Resolution: ${resolutionMessage.trim()}`);
      await ticketsApi.resolveAssignedTicket(ticketId);
      await loadTickets();
      await openTicket(ticketId);
    } catch (error) {
      console.error('Failed to resolve ticket', error);
      window.alert(error?.response?.data?.message || 'Failed to resolve ticket');
    } finally {
      setResolving(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();

    if (!selectedTicket?.id || !comment.trim()) {
      return;
    }

    setCommenting(true);
    try {
      await ticketsApi.addAssignedComment(selectedTicket.id, comment.trim());
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
      await ticketsApi.uploadAssignedAttachment(selectedTicket.id, file);
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

  const onDeleteAttachment = async (attachmentId) => {
    if (!selectedTicket?.id) {
      return;
    }

    if (!window.confirm('Delete this attachment? This cannot be undone.')) {
      return;
    }

    setDeletingAttachment(attachmentId);
    try {
      await ticketsApi.deleteAssignedAttachment(selectedTicket.id, attachmentId);
      await openTicket(selectedTicket.id);
      await loadTickets();
    } catch (error) {
      console.error('Failed to delete attachment', error);
      window.alert(error?.response?.data?.message || 'Failed to delete attachment');
    } finally {
      setDeletingAttachment(null);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 bg-white rounded-lg shadow border border-gray-100">
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Assigned Tickets</h3>
          <button
            type="button"
            onClick={loadTickets}
            className="text-sm px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
          >
            Refresh
          </button>
        </div>

        <div className="max-h-[560px] overflow-auto divide-y divide-gray-100">
          {loading && <p className="p-4 text-sm text-gray-600">Loading...</p>}
          {!loading && tickets.length === 0 && <p className="p-4 text-sm text-gray-600">No assigned tickets.</p>}

          {!loading && tickets.map((ticket) => (
            <button
              key={ticket.id}
              type="button"
              onClick={() => openTicket(ticket.id)}
              className={`w-full text-left p-4 hover:bg-orange-50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-orange-50' : ''}`}
            >
              <p className="font-semibold text-gray-900">#{ticket.id} {ticket.title}</p>
              <p className="text-xs mt-1">
                <span className={`px-2 py-0.5 rounded-full font-medium ${STATUS_BADGE_CLASS[ticket.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                  {ticket.status}
                </span>
              </p>
              <p className="text-xs text-gray-600">Requester: {ticket.createdByName || ticket.createdByEmail}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-white rounded-lg shadow border border-gray-100 p-6">
        {!selectedTicket && <p className="text-gray-600">Select a ticket to manage status, comments, and attachments.</p>}

        {selectedTicket && (
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-2xl font-bold text-gray-900">#{selectedTicket.id} {selectedTicket.title}</h3>
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_BADGE_CLASS[selectedTicket.status] || 'bg-gray-100 text-gray-700 border border-gray-200'}`}>
                {selectedTicket.status}
              </span>
            </div>
            <p className="text-sm text-gray-600 mt-1">{selectedTicket.description}</p>
            <p className="text-sm text-gray-600">Location: {selectedTicket.location}</p>

            <ServiceLevelTimer ticket={selectedTicket} />

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="flex gap-2">
                  <select
                    value={statusValue}
                    onChange={(event) => setStatusValue(event.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-md text-sm flex-1"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={updateStatus}
                    disabled={statusUpdating}
                    className="px-4 py-2 text-sm rounded bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
                  >
                    {statusUpdating ? 'Updating...' : 'Update'}
                  </button>
                  <button
                    type="button"
                    onClick={resolveTicket}
                    disabled={resolving}
                    className="px-4 py-2 text-sm rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
                  >
                    {resolving ? 'Resolving...' : 'Resolve'}
                  </button>
                </div>
                <textarea
                  value={resolutionMessage}
                  onChange={(event) => setResolutionMessage(event.target.value)}
                  placeholder="Resolution message (required for Resolve button)"
                  className="mt-2 w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[70px]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Attachment</label>
                <input
                  type="file"
                  onChange={onUpload}
                  disabled={uploading}
                  className="w-full text-sm border border-gray-300 rounded-md px-3 py-2"
                />
              </div>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Comments</h4>
              <div className="space-y-2 max-h-48 overflow-auto pr-1">
                {(selectedTicket.comments || []).length === 0 && (
                  <p className="text-sm text-gray-600">No comments yet.</p>
                )}
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
                  placeholder="Add update comment"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm min-h-[80px]"
                />
                <button
                  type="submit"
                  disabled={commenting}
                  className="mt-2 px-4 py-2 text-sm rounded bg-gray-900 text-white hover:bg-black disabled:opacity-60"
                >
                  {commenting ? 'Saving...' : 'Add Comment'}
                </button>
              </form>
            </div>

            <div className="mt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-2">Attachments</h4>
              <div className="space-y-2">
                {(selectedTicket.attachments || []).length === 0 && (
                  <p className="text-sm text-gray-600">No attachments yet.</p>
                )}
                {(selectedTicket.attachments || []).map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border border-gray-200 rounded px-3 py-2"
                  >
                    <a
                      href={ticketsApi.getAssignedAttachmentDownloadUrl(selectedTicket.id, item.id)}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 text-sm text-blue-700 hover:underline truncate"
                    >
                      {item.originalFileName} ({Math.ceil((item.fileSizeBytes || 0) / 1024)} KB)
                    </a>
                    <button
                      type="button"
                      onClick={() => onDeleteAttachment(item.id)}
                      disabled={deletingAttachment === item.id}
                      className="ml-2 text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-60"
                      title="Delete attachment"
                    >
                      {deletingAttachment === item.id ? 'Deleting…' : '✕'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TechnicianTicketPanel;
