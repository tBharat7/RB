import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid username or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ $or: [{ email }, { username }] });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    username,
    email,
    password,
  });

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
  const user = await User.findById(req.user._id);

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
  const user = await User.findById(req.user._id);

  if (user) {
    user.displayName = req.body.displayName || user.displayName;
    user.email = req.body.email || user.email;
    user.photoURL = req.body.photoURL || user.photoURL;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

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
  const { email, displayName, photoURL } = req.body;
  
  // Extract username from email
  const username = email.split('@')[0];

  let user = await User.findOne({ email });

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