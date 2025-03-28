import { ResumeData, StyleOptions } from '../types';
import { 
  GoogleUserData, 
  authenticateUser, 
  registerUser as registerLocalUser, 
  loginWithGoogle as loginWithGoogleLocal, 
  saveUserData as saveLocalUserData, 
  getUserData as getLocalUserData
} from './userStorage';

// User API functions
export const loginUser = async (email: string, password: string) => {
  try {
    // Use local storage for authentication
    const isAuthenticated = authenticateUser(email, password);
    
    if (!isAuthenticated) {
      throw new Error('Authentication failed: Invalid credentials');
    }
    
    // Create a user object similar to what the API would return
    const userData = {
      username: email,
      email: email,
      displayName: email.split('@')[0], // Simple display name from email
      token: `local-storage-token-${Date.now()}` // Dummy token
    };
    
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Login process error:', error);
    throw new Error('Login failed');
  }
};

export const registerUser = async (name: string, email: string, password: string) => {
  try {
    // Use local storage for registration
    const success = registerLocalUser(email, password, email);
    
    if (!success) {
      throw new Error('Registration failed: User may already exist');
    }
    
    // Create a user object similar to what the API would return
    const userData = {
      username: email,
      email: email,
      displayName: name || email.split('@')[0],
      token: `local-storage-token-${Date.now()}` // Dummy token
    };
    
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Registration error:', error);
    throw new Error('Registration failed');
  }
};

export const loginWithGoogle = async (googleData: GoogleUserData) => {
  try {
    // Use local storage for Google authentication
    const result = loginWithGoogleLocal(googleData);
    
    if (!result.success) {
      throw new Error('Google sign-in failed');
    }
    
    // Create a user object similar to what the API would return
    const userData = {
      username: result.username || googleData.email,
      email: googleData.email,
      displayName: googleData.displayName || googleData.email.split('@')[0],
      photoURL: googleData.photoURL,
      token: `local-storage-token-${Date.now()}` // Dummy token
    };
    
    localStorage.setItem('current_user', JSON.stringify(userData));
    
    return userData;
  } catch (error) {
    console.error('Google sign-in error:', error);
    throw new Error('Google sign-in failed');
  }
};

export const getUserProfile = async () => {
  try {
    // Get user profile from local storage
    const userInfo = localStorage.getItem('current_user');
    if (!userInfo) {
      throw new Error('User not found');
    }
    
    return JSON.parse(userInfo);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get user profile');
  }
};

export const updateUserProfile = async (userUpdateData: any) => {
  try {
    // Update user profile in local storage
    const userInfo = localStorage.getItem('current_user');
    if (!userInfo) {
      throw new Error('User not found');
    }
    
    const user = JSON.parse(userInfo);
    const updatedUser = { ...user, ...userUpdateData };
    
    localStorage.setItem('current_user', JSON.stringify(updatedUser));
    
    return updatedUser;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update user profile');
  }
};

// Resume API functions
export const saveUserData = async (
  resumeData: ResumeData,
  styleOptions: StyleOptions
) => {
  try {
    // Get current user
    const userInfo = localStorage.getItem('current_user');
    if (!userInfo) {
      throw new Error('User not authenticated');
    }
    
    const user = JSON.parse(userInfo);
    
    // Save resume data to local storage
    saveLocalUserData(user.username, resumeData, styleOptions);
    
    // Return a response similar to what the API would return
    return {
      resumeData,
      styleOptions,
      lastSaved: new Date().toISOString()
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to save resume data');
  }
};

// Function for updating existing resume (used by auto-save)
export const updateUserData = async (
  resumeData: ResumeData,
  styleOptions: StyleOptions
) => {
  try {
    // This is the same as saveUserData in the local storage implementation
    return await saveUserData(resumeData, styleOptions);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to update resume data');
  }
};

export const getUserData = async () => {
  try {
    // Get current user
    const userInfo = localStorage.getItem('current_user');
    if (!userInfo) {
      throw new Error('User not authenticated');
    }
    
    const user = JSON.parse(userInfo);
    
    // Get resume data from local storage
    const userData = getLocalUserData(user.username);
    
    // Return a response similar to what the API would return
    return {
      resumeData: userData.resumeData || {
        personalInfo: {
          name: '',
          title: '',
          email: '',
          phone: '',
          location: '',
          summary: '',
        },
        experience: [],
        education: [],
        skills: [],
      },
      styleOptions: userData.styleOptions || {
        layout: 'minimal',
        primaryColor: '#0ea5e9',
        fontFamily: 'sans',
        fontSize: 'base',
      },
      lastSaved: new Date().toISOString()
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get resume data');
  }
};

export const logoutUser = () => {
  localStorage.removeItem('current_user');
};
