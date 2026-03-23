import apiClient from '../utils/apiClient';

export const profileApi = {
  getProfile: () => apiClient.get('/api/profile/me'),
  updateProfile: (data) => apiClient.put('/api/profile/me', data),
};