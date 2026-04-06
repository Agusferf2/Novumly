import { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '../lib/apiClient.js';

const AUTH_USER_KEY = 'auth_user';
const AuthContext = createContext(null);

function getCachedUser() {
  try { return JSON.parse(localStorage.getItem(AUTH_USER_KEY)); } catch { return null; }
}

export function AuthProvider({ children }) {
  const hasToken   = !!localStorage.getItem('token');
  const cachedUser = hasToken ? getCachedUser() : null;

  // Si hay token + caché → usuario disponible de inmediato, sin spinner
  const [user, setUser]       = useState(cachedUser);
  // Solo bloquear render si hay token pero no hay caché aún (primera carga post-login)
  const [loading, setLoading] = useState(hasToken && !cachedUser);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Validar en segundo plano (no bloquea la UI si ya teníamos caché)
    apiFetch('/api/me')
      .then(data => {
        setUser(data);
        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
      })
      .catch(err => {
        if (err.status === 401 || err.status === 403) {
          localStorage.removeItem('token');
          localStorage.removeItem(AUTH_USER_KEY);
          setUser(null);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function login(token) {
    localStorage.setItem('token', token);
    return apiFetch('/api/me').then(data => {
      setUser(data);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
    });
  }

  function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem(AUTH_USER_KEY);
    setUser(null);
  }

  async function refreshUser() {
    const data = await apiFetch('/api/me');
    setUser(data);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data));
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
