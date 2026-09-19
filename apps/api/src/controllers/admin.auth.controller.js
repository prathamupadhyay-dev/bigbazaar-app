import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.model';
import sendEmail from '../utils/sendEmail';
import { AuthRequest } from '../middleware/auth.middleware';

// ─── Helper: generate signed JWT ────────────────────────────────────────────
const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// ─── POST /api/v1/auth/admin/register ───────────────────────────────────────
export const register = async (req, res) => {
  try {
    const { name, email, password, adminSecretKey } = req.body;

    // Guard: require admin secret key
    if (adminSecretKey !== process.env.ADMIN_SECRET_KEY) {
      res.status(403).json({ success: false, message: 'Invalid admin secret key' });
      return;
    }

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email and password' });
      return;
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const admin = await Admin.create({ name, email, password: hashedPassword });

    const token = generateToken(String(admin._id), admin.role);

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/v1/auth/admin/login ──────────────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(String(admin._id), admin.role);

    res.status(200).json({
      success: true,
      message: 'Admin login successful',
      token,
      admin: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/v1/auth/admin/forgot-password ────────────────────────────────
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide your email' });
      return;
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
      res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    admin.resetPasswordToken = hashedToken;
    admin.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await admin.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/admin/reset-password/${rawToken}`;

    await sendEmail({
      to: admin.email,
      subject: 'BigBazaar Admin — Password Reset Request',
      html: `
        <h2>Admin Password Reset</h2>
        <p>Hi ${admin.name},</p>
        <p>You requested a password reset for your admin account. Click below (valid for 15 minutes):</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#2b6cb0;color:#fff;border-radius:5px;text-decoration:none;">Reset Password</a>
        <p>If you didn't request this, please secure your account immediately.</p>
      `
    });

    res.status(200).json({ success: true, message: 'Reset link sent to your admin email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── POST /api/v1/auth/admin/reset-password/:token ──────────────────────────
export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ success: false, message: 'Please provide a new password' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const admin = await Admin.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }
    });

    if (!admin) {
      res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
      return;
    }

    admin.password = await bcrypt.hash(password, 12);
    admin.resetPasswordToken = undefined;
    admin.resetPasswordExpire = undefined;
    await admin.save();

    res.status(200).json({ success: true, message: 'Admin password reset successful. Please login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ─── GET /api/v1/auth/admin/me ───────────────────────────────────────────────
export const getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, admin: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};