import api from './axiosInstance'

export const getMe = () => api.get('/api/auth/me')
export const logout = () => api.post('/api/auth/logout')

/** Redirect browser to Google OAuth2 login (doesn't return – full page redirect) */
export const loginWithGoogle = () => {
  window.location.href = '/oauth2/authorization/google'
}
