import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/auth';
import { localStorageService } from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorageService.getToken());
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorageService.getToken();
      
      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        console.log('🔄 Initializing auth with token...');
        const userData = await authService.getCurrentUser();
        console.log('✅ Auth init successful:', userData);
        
        // Enhanced user data handling
        const finalUserData = userData?.user || userData;
        
        if (finalUserData && finalUserData.id) {
          setUser(finalUserData);
          setToken(storedToken);
          setError(null);
        } else {
          console.warn('⚠️ Invalid user data structure:', userData);
          throw new Error('Invalid user data received');
        }
      } catch (error) {
        console.error('❌ Auth initialization failed:', error);
        setError(error.response?.data?.message || 'Authentication failed');
        handleAuthFailure();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const handleAuthFailure = () => {
    localStorageService.removeToken();
    setToken(null);
    setUser(null);
  };

  const clearError = () => setError(null);

  const login = async (email, password) => {
    try {
      clearError();
      console.log('🔄 Attempting login...');
      
      const response = await authService.login(email, password);
      console.log('✅ Login response:', response);
      
      const { token: newToken, user: userData } = response;
      
      if (!newToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      localStorageService.setToken(newToken);
      setToken(newToken);
      
      // Enhanced user data extraction
      const finalUserData = userData?.user || userData;
      setUser(finalUserData);
      
      console.log('✅ Login successful');
      return { success: true, user: finalUserData };
    } catch (error) {
      console.error('❌ Login error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Login failed';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      clearError();
      console.log('🔄 Attempting registration...');
      
      const response = await authService.register(name, email, password);
      console.log('✅ Register response:', response);
      
      const { token: newToken, user: userData } = response;
      
      if (!newToken || !userData) {
        throw new Error('Invalid response from server');
      }
      
      localStorageService.setToken(newToken);
      setToken(newToken);
      
      // Enhanced user data extraction
      const finalUserData = userData?.user || userData;
      setUser(finalUserData);
      
      console.log('✅ Registration successful');
      return { success: true, user: finalUserData };
    } catch (error) {
      console.error('❌ Register error:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage 
      };
    }
  };

  const logout = () => {
    console.log('🔄 Logging out...');
    localStorageService.removeToken();
    setToken(null);
    setUser(null);
    setError(null);
    console.log('✅ Logout successful');
  };

  const updateUser = (updatedUser) => {
    setUser(prevUser => ({
      ...prevUser,
      ...updatedUser
    }));
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      const finalUserData = userData?.user || userData;
      
      if (finalUserData && finalUserData.id) {
        setUser(finalUserData);
        return { success: true, user: finalUserData };
      }
    } catch (error) {
      console.error('❌ Refresh user failed:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    loading,
    error,
    clearError,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};