import api from './axiosInstance'

export const getAllUsers = () => api.get('/api/admin/users')
export const updateUserRole = (id, role) => api.patch(`/api/admin/users/${id}/role`, { role })
