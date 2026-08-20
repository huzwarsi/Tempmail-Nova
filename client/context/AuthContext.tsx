'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../lib/api';

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (credentials: any) => Promise<any>;
  registerUser: (data: any) => Promise<any>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => {},
  registerUser: async () => {},
  logout: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('tempmail_token') : null;
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await API.get('/auth/me');
        setUser(data.user);
      } catch (err) {
        if (typeof window !== 'undefined') localStorage.removeItem('tempmail_token');
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: any) => {
    const { data } = await API.post('/auth/login', credentials);
    if (typeof window !== 'undefined') localStorage.setItem('tempmail_token', data.token);
    setUser(data.user);
    return data;
  };

  const registerUser = async (data: any) => {
    const res = await API.post('/auth/register', data);
    if (typeof window !== 'undefined') localStorage.setItem('tempmail_token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    if (typeof window !== 'undefined') localStorage.removeItem('tempmail_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, registerUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
