import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.model.js';
import sendEmail from '../utils/sendEmail.js';

const generateToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

export const signup = async (req, res) => {
  try {
    const {
      fullName,
      name,
      email,
      password,
      phoneNumber,
      phone,
      role = 'user',
      userTypes = ['buyer'],
      status = 'active'
    } = req.body;

    const resolvedName = fullName || name;
    const resolvedPhone = phoneNumber || phone;

    if (!resolvedName || !email || !password) {
      res.status(400).json({
        success: false,
        message: 'Please provide fullName, email and password'
      });
      return;
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'Email already registered' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    const user = await User.create({
      fullName: resolvedName,
      name: resolvedName,
      email,
      password: hashedPassword,
      phoneNumber: resolvedPhone,
      role,
      userTypes: Array.isArray(userTypes) ? userTypes : [userTypes],
      status,
      otp,
      otpExpires,
      isVerified: false
    });

    console.log(`[AUTH] Generated OTP for ${email}: ${otp}`);

    try {
      await sendEmail({
        to: email,
        subject: 'BigBazaar — Your Verification Code',
        html: `
          <h2>Welcome to BigBazaar!</h2>
          <p>Hi ${resolvedName},</p>
          <p>Your 6-digit verification code is:</p>
          <h1 style="letter-spacing: 4px; color: #2563EB;">${otp}</h1>
          <p>This code will expire in 10 minutes.</p>
        `
      });
    } catch (mailErr) {
      console.warn('[AUTH] Email sending skipped/failed, check console for OTP:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: 'Signup successful! OTP sent for verification.',
      email,
      otp: process.env.NODE_ENV !== 'production' ? otp : undefined
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      res.status(400).json({ success: false, message: 'Please provide email and otp' });
      return;
    }

    const user = await User.findOne({ email }).select('+otp +otpExpires +password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const isExpired = user.otpExpires && new Date(user.otpExpires) < new Date();
    if (isExpired) {
      res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
      return;
    }

    if (user.otp !== String(otp).trim()) {
      res.status(400).json({ success: false, message: 'Invalid OTP code' });
      return;
    }

    user.isVerified = true;
    user.status = 'active';
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = generateToken(String(user._id), user.role);

    res.status(200).json({
      success: true,
      message: 'OTP verified successfully',
      token,
      user: {
        id: user._id,
        fullName: user.fullName || user.name,
        name: user.fullName || user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: user.role,
        userTypes: user.userTypes,
        status: user.status
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const register = signup;

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please provide email and password' });
      return;
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
      return;
    }

    const token = generateToken(String(user._id), user.role);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({ success: false, message: 'Please provide your email' });
      return;
    }

    const user = await User.findOne({ email });
    if (!user) {
      res.status(200).json({ success: true, message: 'If that email exists, a reset link has been sent' });
      return;
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');

    user.resetPasswordToken = hashedToken;
    user.resetPasswordExpire = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${rawToken}`;

    await sendEmail({
      to: user.email,
      subject: 'BigBazaar — Password Reset Request',
      html: `
        <h2>Password Reset</h2>
        <p>Hi ${user.name},</p>
        <p>You requested a password reset. Click the button below (valid for 15 minutes):</p>
        <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;background:#e53e3e;color:#fff;border-radius:5px;text-decoration:none;">Reset Password</a>
        <p>If you didn't request this, you can safely ignore this email.</p>
      `
    });

    res.status(200).json({ success: true, message: 'Reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password) {
      res.status(400).json({ success: false, message: 'Please provide a new password' });
      return;
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpire: { $gt: new Date() }
    });

    if (!user) {
      res.status(400).json({ success: false, message: 'Token is invalid or has expired' });
      return;
    }

    user.password = await bcrypt.hash(password, 12);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful. Please login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMe = async (req, res) => {
  try {
    res.status(200).json({ success: true, user: req.user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};