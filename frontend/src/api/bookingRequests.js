import apiClient from '../utils/apiClient';

const normalizeBookingRequest = (request) => ({
  ...request,
  id: request.id,
  attendees: request.attendees ?? null,
  expectedAmount: request.expectedAmount ?? null,
  timeRange: request.timeRange || '',
  adminReason: request.adminReason || '',
  requestedAt: request.requestedAt || '',
  reviewedAt: request.reviewedAt || '',
  reviewedBy: request.reviewedBy || '',
});

export const bookingRequestsApi = {
  async getAll() {
    const response = await apiClient.get('/api/bookings');
    return {
      ...response,
      data: Array.isArray(response.data) ? response.data.map(normalizeBookingRequest) : [],
    };
  },

  async create(payload) {
    const response = await apiClient.post('/api/bookings', {
      ...payload,
      attendees: payload.attendees ? Number(payload.attendees) : null,
      expectedAmount: payload.expectedAmount ? Number(payload.expectedAmount) : null,
      timeRange: payload.timeRange || '',
    });

    return {
      ...response,
      data: normalizeBookingRequest(response.data),
    };
  },

  async update(requestId, payload) {
    const response = await apiClient.patch(`/api/bookings/${requestId}`, {
      bookingDate: payload.bookingDate,
      timeRange: payload.timeRange || '',
      purpose: payload.purpose,
      attendees: payload.attendees ? Number(payload.attendees) : null,
      expectedAmount: payload.expectedAmount ? Number(payload.expectedAmount) : null,
    });

    return {
      ...response,
      data: normalizeBookingRequest(response.data),
    };
  },

  async delete(requestId) {
    return apiClient.delete(`/api/bookings/${requestId}`);
  },

  async review(requestId, { status, reason }) {
    const response = await apiClient.patch(`/api/admin/bookings/${requestId}/review`, {
      status,
      reason,
    });

    return {
      ...response,
      data: normalizeBookingRequest(response.data),
    };
  },
};
