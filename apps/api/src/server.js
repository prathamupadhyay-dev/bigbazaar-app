import { webcrypto } from 'crypto';
if (!globalThis.crypto) globalThis.crypto = webcrypto; // Node 18 polyfill

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userAuthRoutes from './routes/user.auth.routes.js';
import adminAuthRoutes from './routes/admin.auth.routes.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: (origin, callback) => callback(null, true),
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Auth routes matching POST /auth/signup and POST /auth/verify-otp
app.use('/auth', userAuthRoutes);
app.use('/api/auth', userAuthRoutes);
app.use('/api/v1/auth/user', userAuthRoutes);
app.use('/api/v1/auth/admin', adminAuthRoutes);

app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
});