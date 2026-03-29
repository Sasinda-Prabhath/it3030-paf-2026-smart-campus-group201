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
  createdAt: ticket.createdAt || '',
  updatedAt: ticket.updatedAt || '',
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
      },
    };
  },

  async addComment(ticketId, comment) {
    const response = await apiClient.post(`/api/tickets/my/${ticketId}/comments`, { comment });
    return {
      ...response,
      data: normalizeComment(response.data),
    };
  },
};
