import { useState, useEffect } from 'react';
import { DEMO_USER } from '../../constants/demo';
import { AuthContext } from './AuthContext.js';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('demo_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('demo_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('demo_user');
    }
  }, [user]);

  const login = (email) => {
    setUser({ email, id: DEMO_USER.id });
  };

  const logout = () => {
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: Boolean(user),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
