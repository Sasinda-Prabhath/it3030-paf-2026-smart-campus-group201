import apiClient from '../utils/apiClient';

export const notificationApi = {
  getNotifications: () => apiClient.get('/api/notifications/me'),
  getUnreadCount: () => apiClient.get('/api/notifications/me/unread-count'),
  markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => apiClient.patch('/api/notifications/me/read-all'),
  deleteNotification: (id) => apiClient.delete(`/api/notifications/${id}`),
};