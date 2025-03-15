import { ResumeData, StyleOptions } from '../types';

// Types
export interface UserData {
  username: string;
  email: string;
  password?: string; // Make password optional for OAuth users
  displayName?: string;
  photoURL?: string;
  googleId?: string; // Store Google's unique ID
  resumeData?: ResumeData;
  styleOptions?: StyleOptions;
}

export interface UserSession {
  username: string;
  isAuthenticated: boolean;
  displayName?: string;
  photoURL?: string;
}

export interface GoogleUserData {
  email: string;
  displayName?: string;
  photoURL?: string;
  uid: string;
}

// Helper functions
const USERS_KEY = 'resume_builder_users';

// Get all users
export const getUsers = (): Record<string, UserData> => {
  const usersJson = localStorage.getItem(USERS_KEY);
  return usersJson ? JSON.parse(usersJson) : {};
};

// Save all users
const saveUsers = (users: Record<string, UserData>): void => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// User Authentication
export const authenticateUser = (username: string, password: string): boolean => {
  const users = getUsers();
  return users[username] && users[username].password === password;
};

export const registerUser = (username: string, password: string, email: string): boolean => {
  const users = getUsers();
  
  // Check if user already exists
  if (users[username]) {
    return false;
  }
  
  // Create new user
  users[username] = { username, password, email };
  saveUsers(users);
  
  return true;
};

// Login with Google 
export const loginWithGoogle = (userData: GoogleUserData): { success: boolean; username?: string } => {
  const users = getUsers();
  
  // Check if a user with this email exists
  for (const username in users) {
    if (users[username].email === userData.email) {
      // Update the existing user with the latest Google data
      users[username] = {
        ...users[username],
        displayName: userData.displayName,
        photoURL: userData.photoURL,
        googleId: userData.uid
      };
      saveUsers(users);
      return { success: true, username };
    }
  }
  
  // Create a new user from the Google account
  // Use the email as the basis for username, but ensure it's unique
  let username = userData.email.split('@')[0];
  username = username.replace(/[^a-zA-Z0-9]/g, ''); // Remove any special chars
  
  // If username already exists, add a unique suffix
  if (users[username]) {
    username = `${username}${Date.now().toString().slice(-4)}`;
  }
  
  // Create the new user
  users[username] = {
    username,
    email: userData.email,
    displayName: userData.displayName,
    photoURL: userData.photoURL,
    googleId: userData.uid
  };
  
  saveUsers(users);
  return { success: true, username };
};

// Save user resume data
export const saveUserData = (
  username: string, 
  resumeData: ResumeData, 
  styleOptions: StyleOptions
): void => {
  const users = getUsers();
  
  if (users[username]) {
    users[username] = {
      ...users[username],
      resumeData,
      styleOptions
    };
    
    saveUsers(users);
  }
};

// Get user resume data
export const getUserData = (username: string): { 
  resumeData?: ResumeData, 
  styleOptions?: StyleOptions,
  displayName?: string,
  photoURL?: string, 
  email?: string
} => {
  const users = getUsers();
  
  if (users[username]) {
    return {
      resumeData: users[username].resumeData,
      styleOptions: users[username].styleOptions,
      displayName: users[username].displayName,
      photoURL: users[username].photoURL,
      email: users[username].email
    };
  }
  
  return {};
}; 