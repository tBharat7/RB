import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  googleAuth,
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Authentication routes with names matching frontend expectations
router.route('/signup').post(registerUser);  // Changed from /create
router.post('/signin', authUser);            // Changed from /session
router.post('/social', googleAuth);          // Kept as is

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router; 