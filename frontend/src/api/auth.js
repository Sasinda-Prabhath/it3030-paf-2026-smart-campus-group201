import apiClient from '../utils/apiClient';

export const authApi = {
  getCurrentUser: () => apiClient.get('/api/auth/me'),
  logout: () => apiClient.post('/api/auth/logout'),
};