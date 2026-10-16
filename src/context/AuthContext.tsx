import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import api from '../utils/api';
import { User } from '../types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session on load if a token exists.
  useEffect(() => {
    const token = localStorage.getItem('waracle_token');
    if (!token) {
      setLoading(false);
      return;
    }
    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('waracle_token'))
      .finally(() => setLoading(false));
  }, []);

  const persist = (token: string, u: User) => {
    localStorage.setItem('waracle_token', token);
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    persist(res.data.token, res.data.user);
  };

  const register = async (data: RegisterData) => {
    const res = await api.post('/auth/register', data);
    persist(res.data.token, res.data.user);
  };

  const logout = () => {
    localStorage.removeItem('waracle_token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
