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

// Authentication routes with explicit method handling
router.route('/signup')
  .post(registerUser)
  .all((req, res) => {
    res.status(405).json({ message: `Method ${req.method} not allowed on this endpoint` });
  });

router.route('/signin')
  .post(authUser)
  .all((req, res) => {
    res.status(405).json({ message: `Method ${req.method} not allowed on this endpoint` });
  });

router.route('/social')
  .post(googleAuth)
  .all((req, res) => {
    res.status(405).json({ message: `Method ${req.method} not allowed on this endpoint` });
  });

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .all((req, res) => {
    res.status(405).json({ message: `Method ${req.method} not allowed on this endpoint` });
  });

export default router; 