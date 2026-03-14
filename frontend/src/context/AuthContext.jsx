import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../lib/apiClient.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setLoading(false);
      return;
    }
    apiFetch('/api/me')
      .then(data => setUser(data))
      .catch(err => {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('token');
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function login(token) {
    localStorage.setItem('token', token);
    return apiFetch('/api/me').then(data => setUser(data));
  }

  function logout() {
    localStorage.removeItem('token');
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
