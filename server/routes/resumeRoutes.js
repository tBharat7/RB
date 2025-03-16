import express from 'express';
import { saveResume, getResume, updateResume } from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, saveResume)
  .get(protect, getResume)
  .patch(protect, updateResume);

export default router; 