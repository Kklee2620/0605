
import React, { createContext, useState, useCallback, ReactNode, useMemo, useEffect } from 'react';
import { User, AuthContextType } from '../types';
import { loginUserApi, registerUserApi, fetchUserProfileApi } from '../services/authApiService';
import { JWT_LOCAL_STORAGE_KEY } from '../config';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(JWT_LOCAL_STORAGE_KEY));
  const [loading, setLoading] = useState(true); // Initial loading for token verification

  useEffect(() => {
    const verifyTokenAndFetchUser = async () => {
      if (token) {
        try {
          setLoading(true); // Ensure loading is true when fetching profile
          const userProfile = await fetchUserProfileApi(token);
          setCurrentUser(userProfile);
        } catch (error) {
          console.error("Token validation/user fetch failed:", error);
          localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
          setToken(null);
          setCurrentUser(null);
        }
      }
      setLoading(false);
    };
    verifyTokenAndFetchUser();
  }, [token]);

  const login = useCallback(async (email: string, password?: string): Promise<void> => {
    setLoading(true);
    try {
      const response = await loginUserApi({ email, password: password || '' });
      localStorage.setItem(JWT_LOCAL_STORAGE_KEY, response.accessToken);
      setToken(response.accessToken); // This will trigger the useEffect to fetch the user profile
      // setLoading(false) will be handled by the useEffect after user is fetched or if token set fails.
    } catch (error) {
      setLoading(false); // Ensure loading is false on login error
      throw error; 
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password?: string): Promise<void> => {
    setLoading(true);
    try {
      // Backend register API might or might not return the user or a token directly.
      // Assuming it registers and then we log in.
      await registerUserApi({ name, email, password: password || '' });
      // After successful registration, automatically log the user in to get a token
      await login(email, password); // login will set token and trigger profile fetch
    } catch (error) {
      setLoading(false); // Ensure loading is false on register error
      throw error;
    }
  }, [login]);

  const logout = useCallback(() => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem(JWT_LOCAL_STORAGE_KEY);
  }, []);

  const contextValue = useMemo(() => ({
    currentUser,
    token,
    login,
    register,
    logout,
    loading
  }), [currentUser, token, login, register, logout, loading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
