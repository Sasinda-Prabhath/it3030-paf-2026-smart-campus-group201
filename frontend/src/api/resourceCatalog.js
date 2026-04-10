import apiClient from '../utils/apiClient';

const normalizePayload = (payload) => ({
  ...payload,
  capacity: Number(payload.capacity) || 0,
});

export const resourceCatalogApi = {
  getCatalog: () => apiClient.get('/api/resources/catalog'),

  addFacility: (payload) => apiClient.post('/api/resources/facilities', normalizePayload(payload)),

  addAsset: (payload) => apiClient.post('/api/resources/assets', normalizePayload(payload)),

  updateFacility: (id, payload) => apiClient.put(`/api/resources/facilities/${id}`, normalizePayload(payload)),

  updateAsset: (id, payload) => apiClient.put(`/api/resources/assets/${id}`, normalizePayload(payload)),

  deleteFacility: (id) => apiClient.delete(`/api/resources/facilities/${id}`),

  deleteAsset: (id) => apiClient.delete(`/api/resources/assets/${id}`),
};
