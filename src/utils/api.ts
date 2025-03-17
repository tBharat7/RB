import axios, { InternalAxiosRequestConfig } from 'axios';
import { ResumeData, StyleOptions } from '../types';
import { GoogleUserData } from './userStorage';

// API base URL configuration for different environments
const API_BASE_URL = (() => {
  const hostname = window.location.hostname;
  
  // Local development
  if (hostname === 'localhost') {
    return 'http://localhost:5000/api';
  }
  
  // Koyeb deployment
  if (hostname.includes('koyeb.app')) {
    // If frontend and backend are deployed together (same domain)
    return '/api';
  }
  
  // If backend is on a separate domain/service
  if (hostname.includes('netlify.app') || 
      hostname.includes('vercel.app') || 
      hostname.includes('github.io')) {
    // Replace with your actual Koyeb backend URL
    return 'https://your-app-name.koyeb.app/api';
  }
  
  // Custom domain
  return '/api'; // Fallback to relative path
})();

// Create Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add auth token to requests
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const userInfo = localStorage.getItem('current_user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      if (user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// User API functions
export const loginUser = async (email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    
    if (!response.ok) {
      throw new Error(`Authentication failed: ${response.status}`);
    }
    
    const userData = await response.json();
    
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Login process error:', error);
    throw new Error('Login failed');
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    });
    
    if (!response.ok) {
      throw new Error(`Registration failed: ${response.status}`);
    }
    
    const userData = await response.json();
    
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed');
  }
};

export const loginWithGoogle = async (googleData: GoogleUserData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/social`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(googleData),
    });
    
    if (!response.ok) {
      throw new Error(`Google sign-in failed: ${response.status}`);
    }
    
    const userData = await response.json();
    
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error('Google sign-in failed');
  }
};

export const getUserProfile = async () => {
  try {
    const { data } = await api.get('/users/profile');
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get user profile');
  }
};

export const updateUserProfile = async (userUpdateData: any) => {
  try {
    const { data } = await api.put('/users/profile', userUpdateData);
    
    // Update localStorage with new user data
    const userInfo = localStorage.getItem('current_user');
    if (userInfo) {
      const user = JSON.parse(userInfo);
      localStorage.setItem(
        'current_user',
        JSON.stringify({ ...user, ...data })
      );
    }
    
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user profile');
  }
};

// Resume API functions
export const saveUserData = async (
  resumeData: ResumeData,
  styleOptions: StyleOptions
) => {
  try {
    const { data } = await api.post('/resumes', { resumeData, styleOptions });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save resume data');
  }
};

// New function for updating existing resume (used by auto-save)
export const updateUserData = async (
  resumeData: ResumeData,
  styleOptions: StyleOptions
) => {
  try {
    const { data } = await api.patch('/resumes', { resumeData, styleOptions });
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update resume data');
  }
};

export const getUserData = async () => {
  try {
    const { data } = await api.get('/resumes');
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to get resume data');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('current_user');
}; 