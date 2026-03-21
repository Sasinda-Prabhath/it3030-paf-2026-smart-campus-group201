import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe, logout as authLogout } from '../api/authApi';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const res = await getMe();
      if (res.data.success) {
        setUser(res.data.data);
      }
    } catch (err) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout failed', err);
    }
  };

  const value = {
    user,
    setUser,
    loading,
    logout,
    checkAuth: fetchUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
