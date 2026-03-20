import api from './axiosInstance'

export const getNotifications = () => api.get('/api/notifications/me')
export const getUnreadCount = () => api.get('/api/notifications/me/unread-count')
export const markAsRead = (id) => api.patch(`/api/notifications/${id}/read`)
export const markAllAsRead = () => api.patch('/api/notifications/me/read-all')
export const deleteNotification = (id) => api.delete(`/api/notifications/${id}`)
