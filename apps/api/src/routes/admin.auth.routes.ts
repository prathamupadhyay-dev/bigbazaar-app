import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/admin.auth.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes (admin must be logged in)
router.get('/me', protect, isAdmin, getMe);

export default router;
