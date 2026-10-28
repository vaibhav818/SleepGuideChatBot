import React, { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('somna_token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await authAPI.getMe();
        if (res.success && res.user) {
          setUser(res.user);
        } else {
          logout();
        }
      } catch (err) {
        console.warn('Failed to load user session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, [token]);

  const login = async (email, password) => {
    setError(null);
    try {
      const res = await authAPI.login(email, password);
      if (res.success) {
        localStorage.setItem('somna_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const register = async (name, email, password, sleepProfile) => {
    setError(null);
    try {
      const res = await authAPI.register(name, email, password, sleepProfile);
      if (res.success) {
        localStorage.setItem('somna_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const demoLogin = async () => {
    setError(null);
    try {
      const res = await authAPI.demoLogin();
      if (res.success) {
        localStorage.setItem('somna_token', res.token);
        setToken(res.token);
        setUser(res.user);
        return res;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const res = await authAPI.updateProfile(profileData);
      if (res.success) {
        setUser(res.user);
        return res;
      }
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('somna_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        register,
        demoLogin,
        logout,
        updateProfile,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

