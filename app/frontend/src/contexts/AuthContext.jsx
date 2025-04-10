import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import config from '../config';

// Create axios instance with default config
const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints
const API_ENDPOINTS = {
  login: '/api/auth/login',
  register: '/api/auth/register',
  profile: '/api/users/profile',
  updateProfile: '/api/users/profile',
  users: '/api/users'
};

const AuthContext = createContext(null);

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
  const [error, setError] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('accessToken');
    
    if (!token) {
      console.log('No token found, skipping profile check');
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      // Verify if token is valid by checking its format
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.log('Invalid token format, removing token');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
        setLoading(false);
        return;
      }

      // Only try to get profile if token exists and is valid format
      const response = await api.get(API_ENDPOINTS.profile);
      if (response.data && response.data.data) {
        setUser(response.data.data);
      } else {
        // If no user data, clear token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      // Clear invalid tokens
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post(API_ENDPOINTS.login, { email, password });
      
      if (response.data && response.data.status === 'success' && response.data.data) {
        const { accessToken, refreshToken, ...userData } = response.data.data;
        
        if (accessToken) {
          localStorage.setItem('accessToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          setUser(userData);
          return userData;
        } else {
          throw new Error('No access token received from server');
        }
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post(API_ENDPOINTS.register, userData);
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
      setError(errorMessage);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await api.put(API_ENDPOINTS.updateProfile, profileData);
      if (response.data && response.data.data) {
        setUser(response.data.data);
      }
      return response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Profile update failed. Please try again.';
      setError(errorMessage);
      throw error;
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    register,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin: user?.role_id === 'admin',
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
 