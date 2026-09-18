import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
} from '../controllers/user.auth.controller';
import { protect, isUser } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

// Protected routes (user must be logged in)
router.get('/me', protect, isUser, getMe);

export default router;
