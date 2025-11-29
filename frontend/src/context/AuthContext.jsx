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

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          console.log('🔄 Auth init - User data:', userData);
          
          // Handle nested user object if exists
          if (userData && userData.user) {
            setUser(userData.user); // If backend returns { user: { ... } }
          } else {
            setUser(userData); // If backend returns user directly
          }
        } catch (error) {
          console.error('❌ Auth initialization failed:', error);
          localStorageService.removeToken();
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const response = await authService.login(email, password);
      console.log('🔄 Login response:', response);
      
      const { token: newToken, user: userData } = response;
      
      localStorageService.setToken(newToken);
      setToken(newToken);
      
      // Handle nested user object
      if (userData && userData.user) {
        setUser(userData.user);
      } else {
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed' 
      };
    }
  };

  const register = async (name, email, password) => {
    try {
      const response = await authService.register(name, email, password);
      console.log('🔄 Register response:', response);
      
      const { token: newToken, user: userData } = response;
      
      localStorageService.setToken(newToken);
      setToken(newToken);
      
      // Handle nested user object
      if (userData && userData.user) {
        setUser(userData.user);
      } else {
        setUser(userData);
      }
      
      return { success: true };
    } catch (error) {
      console.error('❌ Register error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const logout = () => {
    console.log('🔄 Logging out...');
    localStorageService.removeToken();
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    updateUser,
    loading,
    isAuthenticated: !!user && !!token
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};