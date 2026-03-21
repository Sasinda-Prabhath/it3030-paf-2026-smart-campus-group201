import axios from 'axios'

/**
 * Axios instance configured to:
 * - Use the backend API base URL from environment
 * - Send cookies (withCredentials) so the HttpOnly JWT cookie is included
 * - Redirect to login on 401 Unauthorized responses
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  withCredentials: true, // Required for HttpOnly cookie auth
  headers: { 'Content-Type': 'application/json' },
})

// Response interceptor: redirect to login on 401
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
