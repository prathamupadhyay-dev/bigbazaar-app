import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe } from
'../controllers/user.auth.controller.js';
import { protect, isUser } from '../middleware/auth.middleware.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', protect, isUser, getMe);

export default router;