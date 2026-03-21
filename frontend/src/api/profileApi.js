import api from './axiosInstance'

export const getProfile = () => api.get('/api/profile/me')
export const updateProfile = (data) => api.put('/api/profile/me', data)
export const sendVerificationEmail = () => api.post('/api/profile/send-verification')
export const verifyEmailToken = (token) => api.get(`/api/profile/verify?token=${token}`)
