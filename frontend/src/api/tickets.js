import apiClient from '../utils/apiClient';

const normalizeTicket = (ticket) => ({
  ...ticket,
  id: ticket.id,
  title: ticket.title || '',
  description: ticket.description || '',
  location: ticket.location || '',
  status: ticket.status || 'OPEN',
  createdByEmail: ticket.createdByEmail || '',
  createdByName: ticket.createdByName || '',
  assignedToEmail: ticket.assignedToEmail || '',
  assignedToName: ticket.assignedToName || '',
  createdAt: ticket.createdAt || '',
  updatedAt: ticket.updatedAt || '',
  firstResponseAt: ticket.firstResponseAt || '',
  resolvedAt: ticket.resolvedAt || '',
  timeToFirstResponseMinutes: Number.isFinite(ticket.timeToFirstResponseMinutes)
    ? ticket.timeToFirstResponseMinutes
    : null,
  timeToResolutionMinutes: Number.isFinite(ticket.timeToResolutionMinutes)
    ? ticket.timeToResolutionMinutes
    : null,
});

const normalizeComment = (comment) => ({
  ...comment,
  id: comment.id,
  ticketId: comment.ticketId,
  authorEmail: comment.authorEmail || '',
  authorName: comment.authorName || '',
  comment: comment.comment || '',
  createdAt: comment.createdAt || '',
});

const normalizeAttachment = (attachment) => ({
  ...attachment,
  id: attachment.id,
  ticketId: attachment.ticketId,
  originalFileName: attachment.originalFileName || '',
  contentType: attachment.contentType || 'application/octet-stream',
  fileSizeBytes: attachment.fileSizeBytes || 0,
  uploadedByEmail: attachment.uploadedByEmail || '',
  uploadedByName: attachment.uploadedByName || '',
  uploadedAt: attachment.uploadedAt || '',
});

const resolveTicketId = (ticketId) => {
  const parsed = Number(ticketId);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error('Invalid ticket id');
  }
  return parsed;
};

export const ticketsApi = {
  async create(payload) {
    const response = await apiClient.post('/api/tickets', payload);
    return {
      ...response,
      data: normalizeTicket(response.data),
    };
  },

  async getMine() {
    const response = await apiClient.get('/api/tickets/my');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(normalizeTicket) : [],
    };
  },

  async getMyTicket(ticketId) {
    const response = await apiClient.get(`/api/tickets/my/${ticketId}`);
    return {
      ...response,
      data: {
        ...normalizeTicket(response.data || {}),
        comments: Array.isArray(response.data?.comments)
          ? response.data.comments.map(normalizeComment)
          : [],
        attachments: Array.isArray(response.data?.attachments)
          ? response.data.attachments.map(normalizeAttachment)
          : [],
      },
    };
  },

  async updateMyTicket(ticketId, payload) {
    const id = resolveTicketId(ticketId);
    const response = await apiClient.put(`/api/tickets/my/${id}`, payload);
    return {
      ...response,
      data: normalizeTicket(response.data),
    };
  },

  async deleteMyTicket(ticketId) {
    const id = resolveTicketId(ticketId);
    return apiClient.delete(`/api/tickets/my/${id}`);
  },

  async addComment(ticketId, comment) {
    const response = await apiClient.post(`/api/tickets/my/${ticketId}/comments`, { comment });
    return {
      ...response,
      data: normalizeComment(response.data),
    };
  },

  async uploadAttachment(ticketId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/api/tickets/my/${ticketId}/attachments`, formData);

    return {
      ...response,
      data: normalizeAttachment(response.data),
    };
  },

  async getAssigned() {
    const response = await apiClient.get('/api/tickets/assigned');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(normalizeTicket) : [],
    };
  },

  async getAssignedTicket(ticketId) {
    const response = await apiClient.get(`/api/tickets/assigned/${ticketId}`);
    return {
      ...response,
      data: {
        ...normalizeTicket(response.data || {}),
        comments: Array.isArray(response.data?.comments)
          ? response.data.comments.map(normalizeComment)
          : [],
        attachments: Array.isArray(response.data?.attachments)
          ? response.data.attachments.map(normalizeAttachment)
          : [],
      },
    };
  },

  async updateAssignedStatus(ticketId, status) {
    const response = await apiClient.patch(`/api/tickets/assigned/${ticketId}/status`, { status });
    return {
      ...response,
      data: normalizeTicket(response.data),
    };
  },

  async resolveAssignedTicket(ticketId) {
    const id = resolveTicketId(ticketId);
    const response = await apiClient.patch(`/api/tickets/assigned/${id}/status`, { status: 'RESOLVED' });
    return {
      ...response,
      data: normalizeTicket(response.data),
    };
  },

  async addAssignedComment(ticketId, comment) {
    const response = await apiClient.post(`/api/tickets/assigned/${ticketId}/comments`, { comment });
    return {
      ...response,
      data: normalizeComment(response.data),
    };
  },

  async uploadAssignedAttachment(ticketId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/api/tickets/assigned/${ticketId}/attachments`, formData);
    return {
      ...response,
      data: normalizeAttachment(response.data),
    };
  },

  async getAdminTickets() {
    const response = await apiClient.get('/api/tickets/admin');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(normalizeTicket) : [],
    };
  },

  async getAdminTicket(ticketId) {
    const response = await apiClient.get(`/api/tickets/admin/${ticketId}`);
    return {
      ...response,
      data: {
        ...normalizeTicket(response.data || {}),
        comments: Array.isArray(response.data?.comments)
          ? response.data.comments.map(normalizeComment)
          : [],
        attachments: Array.isArray(response.data?.attachments)
          ? response.data.attachments.map(normalizeAttachment)
          : [],
      },
    };
  },

  async assignTicket(ticketId, assignedToEmail) {
    const response = await apiClient.patch(`/api/tickets/admin/${ticketId}/assign`, { assignedToEmail });
    return {
      ...response,
      data: normalizeTicket(response.data),
    };
  },

  async deleteAdminTicket(ticketId) {
    const id = resolveTicketId(ticketId);
    return apiClient.delete(`/api/tickets/admin/${id}`);
  },

  async updateAdminStatus(ticketId, status) {
    const response = await apiClient.patch(`/api/tickets/admin/${ticketId}/status`, { status });
    return {
      ...response,
      data: normalizeTicket(response.data),
    };
  },

  async addAdminComment(ticketId, comment) {
    const response = await apiClient.post(`/api/tickets/admin/${ticketId}/comments`, { comment });
    return {
      ...response,
      data: normalizeComment(response.data),
    };
  },

  async uploadAdminAttachment(ticketId, file) {
    const formData = new FormData();
    formData.append('file', file);

    const response = await apiClient.post(`/api/tickets/admin/${ticketId}/attachments`, formData);
    return {
      ...response,
      data: normalizeAttachment(response.data),
    };
  },

  getAttachmentDownloadUrl(ticketId, attachmentId) {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
    return `${baseUrl}/api/tickets/my/${ticketId}/attachments/${attachmentId}`;
  },

  getAssignedAttachmentDownloadUrl(ticketId, attachmentId) {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
    return `${baseUrl}/api/tickets/assigned/${ticketId}/attachments/${attachmentId}`;
  },

  getAdminAttachmentDownloadUrl(ticketId, attachmentId) {
    const baseUrl = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080').replace(/\/$/, '');
    return `${baseUrl}/api/tickets/admin/${ticketId}/attachments/${attachmentId}`;
  },
};
