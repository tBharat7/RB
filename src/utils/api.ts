import axios, { InternalAxiosRequestConfig } from 'axios';
import { ResumeData, StyleOptions } from '../types';

// Base URL for API
// In development, use the local server URL
// In production, use relative URL (assuming backend and frontend are deployed together)
const API_URL = import.meta.env.DEV ? 'http://localhost:5000/api' : '/api';

// Create Axios instance
const api = axios.create({
  baseURL: API_URL,
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
export const loginUser = async (username: string, password: string) => {
  try {
    const { data } = await api.post('/users/login', { username, password });
    localStorage.setItem('current_user', JSON.stringify(data));
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const registerUser = async (
  username: string,
  email: string,
  password: string
) => {
  try {
    const { data } = await api.post('/users', { username, email, password });
    localStorage.setItem('current_user', JSON.stringify(data));
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const loginWithGoogle = async (googleData: any) => {
  try {
    const { data } = await api.post('/users/google', googleData);
    localStorage.setItem('current_user', JSON.stringify(data));
    return data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Google login failed');
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