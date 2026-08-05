import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ecometrics_token');
    const storedUser = localStorage.getItem('ecometrics_user');

    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Verify token in background
      api.get('/auth/profile')
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('ecometrics_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          logout();
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    const { token, user: userData } = res.data;
    localStorage.setItem('ecometrics_token', token);
    localStorage.setItem('ecometrics_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const register = async (name, email, password, role, organization) => {
    const res = await api.post('/auth/register', { name, email, password, role, organization });
    const { token, user: userData } = res.data;
    localStorage.setItem('ecometrics_token', token);
    localStorage.setItem('ecometrics_user', JSON.stringify(userData));
    setUser(userData);
    return userData;
  };

  const logout = () => {
    localStorage.removeItem('ecometrics_token');
    localStorage.removeItem('ecometrics_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
