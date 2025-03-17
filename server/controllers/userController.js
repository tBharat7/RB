import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// Mock user data for development without MongoDB
const mockUsers = [
  {
    _id: '60d0fe4f5311236168a109ca',
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
    password: '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', // 'password123'
  },
  {
    _id: '60d0fe4f5311236168a109cb',
    username: 'janedoe',
    email: 'jane@example.com',
    displayName: 'Jane Doe',
    photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
    password: '$2a$10$7JB720yubVSZvUI0rEqK/.VqGOZTH.ulu33dHOiBE8ByOhJIrdAu2', // 'password123'
  }
];

// Helper function to check if we're in mock mode
const isUsingMockDB = () => {
  return process.env.MOCK_DB === 'true';
};

// Mock functions to emulate database operations
const mockFindOne = async (criteria) => {
  console.log('Using mock database - findOne:', criteria);
  
  if (criteria.email) {
    return mockUsers.find(user => user.email === criteria.email);
  }
  
  if (criteria.username) {
    return mockUsers.find(user => user.username === criteria.username);
  }
  
  return null;
};

const mockCreate = async (userData) => {
  console.log('Using mock database - create:', userData);
  
  const newUser = {
    _id: `mock-id-${Date.now()}`,
    ...userData,
    matchPassword: async (enteredPassword) => true, // Always match in mock mode
  };
  
  // Add to mock users array if we needed persistence
  mockUsers.push(newUser);
  
  return newUser;
};

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  console.log('Auth attempt with:', { email });
  
  let user;
  
  // Handle mock database mode
  if (isUsingMockDB()) {
    console.log('Using mock authentication');
    
    // In mock mode, we'll allow any credentials that look valid
    if (email && password) {
      // Find a mock user or create one on the fly
      user = await mockFindOne({ email }) || {
        _id: `mock-id-${Date.now()}`,
        username: email.split('@')[0],
        email,
        displayName: email.split('@')[0].replace(/[^a-zA-Z0-9]/g, ' '),
        photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
        matchPassword: async () => true
      };
    }
  } else {
    // Real database logic - check for both email and username
    // This handles both cases where client might send either email or username in the email field
    user = await User.findOne({
      $or: [
        { email },
        { username: email } // Support username login through the email field
      ]
    });
    
    console.log('User found:', user ? 'Yes' : 'No');
    
    // Check password
    if (user && !(await user.matchPassword(password))) {
      console.log('Password does not match');
      user = null; // Clear user if password doesn't match
    }
  }

  if (user) {
    res.json({
      _id: user._id,
      username: user.username || email.split('@')[0],
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  
  console.log('Register attempt with:', { name, email });
  
  let userExists;
  let user;
  
  if (isUsingMockDB()) {
    console.log('Using mock registration');
    
    userExists = await mockFindOne({ email });
    
    if (!userExists) {
      user = await mockCreate({
        username: email.split('@')[0],
        email,
        displayName: name || email.split('@')[0],
        password,
        photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
        matchPassword: async () => true
      });
    }
  } else {
    userExists = await User.findOne({ email });
    
    if (!userExists) {
      user = await User.create({
        username: email.split('@')[0],
        email,
        displayName: name,
        password,
      });
    }
  }

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  if (user) {
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {
  let user;
  
  if (isUsingMockDB()) {
    // In mock mode, just return the user from the request
    user = req.user;
  } else {
    user = await User.findById(req.user._id);
  }

  if (user) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {
  let user;
  let updatedUser;
  
  if (isUsingMockDB()) {
    // In mock mode, just update the user in memory
    user = req.user;
    
    if (user) {
      updatedUser = {
        ...user,
        displayName: req.body.displayName || user.displayName,
        email: req.body.email || user.email,
        photoURL: req.body.photoURL || user.photoURL,
        password: req.body.password || user.password
      };
    }
  } else {
    user = await User.findById(req.user._id);
    
    if (user) {
      user.displayName = req.body.displayName || user.displayName;
      user.email = req.body.email || user.email;
      user.photoURL = req.body.photoURL || user.photoURL;

      if (req.body.password) {
        user.password = req.body.password;
      }

      updatedUser = await user.save();
    }
  }

  if (updatedUser) {
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      displayName: updatedUser.displayName,
      photoURL: updatedUser.photoURL,
      token: generateToken(updatedUser._id),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Login or register with Google
// @route   POST /api/users/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { email, displayName, photoURL, uid } = req.body;
  
  console.log('Google auth attempt with:', { email, displayName });
  
  // Extract username from email
  const username = email.split('@')[0];
  
  let user;
  
  if (isUsingMockDB()) {
    console.log('Using mock Google authentication');
    
    // In mock mode, either find the user or create one
    user = await mockFindOne({ email }) || await mockCreate({
      username,
      email,
      displayName: displayName || username,
      photoURL,
      password: Math.random().toString(36).slice(-8),
      matchPassword: async () => true
    });
  } else {
    user = await User.findOne({ email });

    // If user doesn't exist, create one
    if (!user) {
      // Generate a random password for the Google user
      const password = Math.random().toString(36).slice(-8);
      
      user = await User.create({
        username,
        email,
        password,
        displayName,
        photoURL,
      });
    }
  }

  res.json({
    _id: user._id,
    username: user.username,
    email: user.email,
    displayName: user.displayName || displayName,
    photoURL: user.photoURL || photoURL,
    token: generateToken(user._id),
  });
});

export { authUser, registerUser, getUserProfile, updateUserProfile, googleAuth }; 