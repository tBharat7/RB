import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/userModel.js';

// Mock user data - similar to what we have in userController
// Using a simple version here for the middleware
const mockUsers = [
  {
    _id: '60d0fe4f5311236168a109ca',
    username: 'johndoe',
    email: 'john@example.com',
    displayName: 'John Doe',
    photoURL: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  {
    _id: '60d0fe4f5311236168a109cb',
    username: 'janedoe',
    email: 'jane@example.com',
    displayName: 'Jane Doe',
    photoURL: 'https://randomuser.me/api/portraits/women/1.jpg',
  }
];

const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check for token in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if we're using mock database
      if (process.env.MOCK_DB === 'true') {
        console.log('Auth middleware using mock database');
        
        // In mock mode, we'll create a mock user based on the token
        req.user = {
          _id: decoded.id,
          username: 'mockuser',
          email: 'mock@example.com',
          displayName: 'Mock User',
          photoURL: 'https://randomuser.me/api/portraits/lego/1.jpg',
        };
      } else {
        // Get user from the token
        req.user = await User.findById(decoded.id).select('-password');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token');
  }
});

export { protect }; 