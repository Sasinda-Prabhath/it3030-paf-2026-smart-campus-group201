import apiClient from '../utils/apiClient';

export const adminApi = {
  getUsers: () => apiClient.get('/api/admin/users'),
  updateUserRole: (id, role) => apiClient.patch(`/api/admin/users/${id}/role`, { role }),
  updateUserClassification: (id, data) => apiClient.patch(`/api/admin/users/${id}/classification`, data),
  updateUserStatus: (id, accountStatus) => apiClient.patch(`/api/admin/users/${id}/status`, { accountStatus }),
  deleteUser: (id) => apiClient.delete(`/api/admin/users/${id}`),
};