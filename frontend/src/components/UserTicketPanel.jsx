import { useEffect, useState } from 'react';
import { ticketsApi } from '../api/tickets';

const UserTicketPanel = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [commenting, setCommenting] = useState(false);
  const [uploadingAttachment, setUploadingAttachment] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', location: '' });
  const [newComment, setNewComment] = useState('');

  const loadTickets = async () => {
    setLoading(true);
    try {
      const response = await ticketsApi.getMine();
      setTickets(response.data || []);

      if (selectedTicket?.id) {
        const refreshed = (response.data || []).find((t) => t.id === selectedTicket.id);
        if (!refreshed) {
          setSelectedTicket(null);
        }
      }
    } catch (error) {
      console.error('Failed to load tickets', error);
      window.alert('Failed to load tickets');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const openTicket = async (ticketId) => {
    try {
      const response = await ticketsApi.getMyTicket(ticketId);
      setSelectedTicket(response.data);
      setNewComment('');
    } catch (error) {
      console.error('Failed to load ticket detail', error);
      window.alert('Failed to load ticket detail');
    }
  };

  const submitNewTicket = async (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.description.trim() || !form.location.trim()) {
      window.alert('Please fill all ticket fields.');
      return;
    }

    setSaving(true);
    try {
      const response = await ticketsApi.create({
        title: form.title,
        description: form.description,
        location: form.location,
      });

      setForm({ title: '', description: '', location: '' });
      await loadTickets();
      await openTicket(response.data.id);
    } catch (error) {
      console.error('Failed to create ticket', error);
      window.alert('Failed to create ticket');
    } finally {
      setSaving(false);
    }
  };

  const submitComment = async (event) => {
    event.preventDefault();

    if (!selectedTicket?.id) {
      return;
    }

    if (!newComment.trim()) {
      window.alert('Comment cannot be empty.');
      return;
    }

    setCommenting(true);
    try {
      await ticketsApi.addComment(selectedTicket.id, newComment);
      await openTicket(selectedTicket.id);
    } catch (error) {
      console.error('Failed to add comment', error);
      window.alert('Failed to add comment');
    } finally {
      setCommenting(false);
    }
  };

  const handleAttachmentUpload = async (event) => {
    if (!selectedTicket?.id) {
      return;
    }

    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploadingAttachment(true);
    try {
      await ticketsApi.uploadAttachment(selectedTicket.id, file);
      await openTicket(selectedTicket.id);
    } catch (error) {
      console.error('Failed to upload attachment', error);
      window.alert(error?.response?.data?.message || 'Failed to upload attachment');
    } finally {
      event.target.value = '';
      setUploadingAttachment(false);
    }
  };

  const formatFileSize = (sizeInBytes) => {
    if (!sizeInBytes) {
      return '0 B';
    }

    if (sizeInBytes < 1024) {
      return `${sizeInBytes} B`;
    }

    if (sizeInBytes < 1024 * 1024) {
      return `${(sizeInBytes / 1024).toFixed(1)} KB`;
    }

    return `${(sizeInBytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">🎫 Support Tickets</h2>

      <form onSubmit={submitNewTicket} className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-4 rounded-lg">
        <input
          type="text"
          placeholder="Ticket title"
          value={form.title}
          onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          placeholder="Location (e.g. Lab 2)"
          value={form.location}
          onChange={(e) => setForm((prev) => ({ ...prev, location: e.target.value }))}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-blue-600 text-white px-4 py-2 text-sm hover:bg-blue-700 disabled:opacity-60"
        >
          {saving ? 'Creating...' : 'Create Ticket'}
        </button>
        <textarea
          placeholder="Describe the issue"
          value={form.description}
          onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
          className="md:col-span-3 rounded-md border border-gray-300 px-3 py-2 text-sm min-h-[90px]"
        />
      </form>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-900">My Tickets</h3>
            <button
              type="button"
              onClick={loadTickets}
              className="text-sm text-blue-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-sm text-gray-500">Loading tickets...</p>
          ) : tickets.length === 0 ? (
            <p className="text-sm text-gray-500">No tickets yet.</p>
          ) : (
            <div className="space-y-2">
              {tickets.map((ticket) => (
                <button
                  type="button"
                  key={ticket.id}
                  onClick={() => openTicket(ticket.id)}
                  className={`w-full text-left border rounded-md p-3 hover:border-blue-400 ${
                    selectedTicket?.id === ticket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <p className="font-medium text-gray-900">{ticket.title}</p>
                  <p className="text-xs text-gray-500 mt-1">{ticket.location}</p>
                  <p className="text-xs mt-1">
                    <span className="px-2 py-0.5 rounded-full bg-yellow-100 text-yellow-800">
                      {ticket.status}
                    </span>
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border border-gray-200 rounded-lg p-4">
          {!selectedTicket ? (
            <p className="text-sm text-gray-500">Select a ticket to view details and comments.</p>
          ) : (
            <>
              <h3 className="font-semibold text-gray-900">{selectedTicket.title}</h3>
              <p className="text-sm text-gray-600 mt-1">{selectedTicket.location}</p>
              <p className="text-sm text-gray-700 mt-3">{selectedTicket.description}</p>

              <div className="mt-4 space-y-2 max-h-64 overflow-y-auto pr-1">
                {(selectedTicket.comments || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No comments yet.</p>
                ) : (
                  selectedTicket.comments.map((comment) => (
                    <div key={comment.id} className="bg-gray-50 border border-gray-200 rounded-md p-2">
                      <p className="text-xs text-gray-500">{comment.authorName}</p>
                      <p className="text-sm text-gray-800">{comment.comment}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h4 className="text-sm font-semibold text-gray-900">Attachments</h4>
                  <label className="text-sm text-blue-600 hover:underline cursor-pointer">
                    {uploadingAttachment ? 'Uploading...' : 'Upload file'}
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleAttachmentUpload}
                      disabled={uploadingAttachment}
                    />
                  </label>
                </div>

                {(selectedTicket.attachments || []).length === 0 ? (
                  <p className="text-sm text-gray-500">No attachments yet.</p>
                ) : (
                  <div className="space-y-1">
                    {(selectedTicket.attachments || []).map((attachment) => (
                      <a
                        key={attachment.id}
                        href={ticketsApi.getAttachmentDownloadUrl(selectedTicket.id, attachment.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-md px-2 py-1 text-sm text-blue-700 hover:bg-blue-50"
                      >
                        <span className="truncate pr-2">{attachment.originalFileName}</span>
                        <span className="text-xs text-gray-500 whitespace-nowrap">{formatFileSize(attachment.fileSizeBytes)}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              <form onSubmit={submitComment} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Add a comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <button
                  type="submit"
                  disabled={commenting}
                  className="rounded-md bg-blue-600 text-white px-3 py-2 text-sm hover:bg-blue-700 disabled:opacity-60"
                >
                  {commenting ? 'Sending...' : 'Comment'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTicketPanel;
