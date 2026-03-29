import { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../api/auth';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const response = await authApi.getCurrentUser();
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const login = () => {
    const baseUrl = import.meta.env.VITE_API_BASE_URL;

    if (!baseUrl) {
      console.error('VITE_API_BASE_URL is not defined in .env');
      return;
    }

    window.location.href = `${baseUrl}/oauth2/authorization/google`;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, loadUser }}>
      {children}
    </AuthContext.Provider>
  );
};