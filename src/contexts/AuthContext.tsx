
import React, { createContext, useContext, useState, useImperativeHandle } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  user: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useLocalStorage<string | null>('user', null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!user);

  const login = (username: string, password: string) => {
    // Credenciais de teste
    if (username === 'Leozin' && password === 'sejamax') {
      setUser(username);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};
