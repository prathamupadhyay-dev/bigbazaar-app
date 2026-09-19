import { Router } from 'express';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe } from
'../controllers/admin.auth.controller';
import { protect, isAdmin } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);

router.get('/me', protect, isAdmin, getMe);

export default router;