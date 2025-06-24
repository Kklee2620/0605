import React, { createContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { MOCK_USERS } from '../constants'; // Assuming MOCK_USERS for demo

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // To simulate async loading

  useEffect(() => {
    // Simulate checking for a logged-in user (e.g., from localStorage)
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password?: string): Promise<void> => {
    setLoading(true);
    // Mock API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = MOCK_USERS.find(u => u.email === email); // Simplified: no password check
        if (user) {
          setCurrentUser(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          setLoading(false);
          resolve();
        } else {
          setLoading(false);
          reject(new Error('Invalid credentials'));
        }
      }, 500);
    });
  }, []);

  const register = useCallback(async (name: string, email: string, password?: string): Promise<void> => {
    setLoading(true);
    // Mock API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (MOCK_USERS.find(u => u.email === email)) {
          setLoading(false);
          reject(new Error('User already exists'));
          return;
        }
        const newUser: User = { id: `user-${Date.now()}`, email, name };
        MOCK_USERS.push(newUser); // Note: this mutates constants for demo, not ideal for real app
        setCurrentUser(newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        setLoading(false);
        resolve();
      }, 500);
    });
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    login,
    register,
    logout,
    loading
  }), [currentUser, login, register, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};