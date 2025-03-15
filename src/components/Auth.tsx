import React, { useState, useEffect } from 'react';
import { authenticateUser } from '../utils/userStorage';
import { AtSign, Lock, User, LogIn } from 'lucide-react';

interface User {
  username: string;
  email: string;
  password: string;
}

interface GoogleAuthResponse {
  email: string;
  displayName?: string;
  photoURL?: string;
  uid: string;
}

interface AuthProps {
  onLogin: (username: string) => void;
  onSignup: (username: string, password: string, email: string) => void;
  onGoogleSignIn: (userData: GoogleAuthResponse) => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin, onSignup, onGoogleSignIn }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const validateEmail = (email: string): boolean => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
    const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return re.test(password);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    
    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);
    
    if (!isLogin && value && !validatePassword(value)) {
      setPasswordError('Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number');
    } else {
      setPasswordError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Login validation
      if (!username || !password) {
        setError('Please fill in all fields');
        return;
      }

      // Validate credentials
      if (authenticateUser(username, password)) {
        onLogin(username);
      } else {
        setError('Invalid username or password');
      }
    } else {
      // Signup validation
      if (!username || !email || !password) {
        setError('Please fill in all fields');
        return;
      }

      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        return;
      }

      if (!validatePassword(password)) {
        setPasswordError('Password must be at least 8 characters with 1 uppercase letter, 1 lowercase letter, and 1 number');
        return;
      }

      // Register new user
      onSignup(username, password, email);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthenticating(true);
      setError('');
      
      // In a real implementation, we would use Firebase Auth or Google Identity Services:
      // For example with Firebase:
      // 
      // import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
      // import { auth } from '../firebase-config';
      //
      // const provider = new GoogleAuthProvider();
      // const result = await signInWithPopup(auth, provider);
      // const user = result.user;
      // 
      // Then we would pass user data to our handler:
      // onGoogleSignIn({
      //   email: user.email,
      //   displayName: user.displayName,
      //   photoURL: user.photoURL,
      //   uid: user.uid
      // });

      // For demo purposes, we'll simulate a successful authentication
      // In a real app, replace this with actual Google Auth
      setTimeout(() => {
        const mockGoogleResponse: GoogleAuthResponse = {
          email: 'your.actual.email@gmail.com', // This would come from Google
          displayName: 'Your Name', // This would come from Google
          photoURL: 'https://lh3.googleusercontent.com/a/default-user', // This would come from Google
          uid: 'google-uid-123456' // This would come from Google
        };
        
        onGoogleSignIn(mockGoogleResponse);
        setIsAuthenticating(false);
      }, 1500); // Simulate network delay
      
    } catch (error) {
      setError('Google sign-in failed. Please try again.');
      setIsAuthenticating(false);
      console.error('Google sign-in error:', error);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto">
      <h2 className="text-2xl font-semibold text-slate-800 mb-6 text-center">
        {isLogin ? 'Log In' : 'Sign Up'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              placeholder="Enter your username"
            />
          </div>
        </div>
        
        {!isLogin && (
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <AtSign className="h-5 w-5 text-slate-400" />
              </div>
              <input
                id="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                  emailError ? 'border-red-300' : 'border-slate-300'
                }`}
                placeholder="Enter your email"
              />
            </div>
            {emailError && (
              <p className="mt-1 text-xs text-red-600">{emailError}</p>
            )}
          </div>
        )}
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock className="h-5 w-5 text-slate-400" />
            </div>
            <input
              id="password"
              type="password"
              value={password}
              onChange={handlePasswordChange}
              className={`w-full pl-10 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent ${
                passwordError ? 'border-red-300' : 'border-slate-300'
              }`}
              placeholder="Enter your password"
            />
          </div>
          {passwordError && (
            <p className="mt-1 text-xs text-red-600">{passwordError}</p>
          )}
        </div>
        
        <button
          type="submit"
          className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 flex items-center justify-center"
        >
          <LogIn className="h-5 w-5 mr-2" />
          {isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      
      <div className="my-4 flex items-center">
        <div className="flex-grow border-t border-slate-200"></div>
        <span className="px-3 text-slate-500 text-sm">OR</span>
        <div className="flex-grow border-t border-slate-200"></div>
      </div>
      
      <button
        onClick={handleGoogleSignIn}
        disabled={isAuthenticating}
        className={`w-full flex items-center justify-center py-2 px-4 border border-slate-300 rounded-md shadow-sm bg-white text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 ${isAuthenticating ? 'opacity-70 cursor-not-allowed' : ''}`}
      >
        {isAuthenticating ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </>
        ) : (
          <>
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Continue with Google
          </>
        )}
      </button>
      
      <div className="mt-4 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-sky-600 hover:text-sky-800 text-sm transition-colors duration-200"
        >
          {isLogin ? 'Need an account? Sign Up' : 'Already have an account? Log In'}
        </button>
      </div>
    </div>
  );
}; 