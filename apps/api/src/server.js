import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import userAuthRoutes from './routes/user.auth.routes';
import adminAuthRoutes from './routes/admin.auth.routes';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

app.use('/api/v1/auth/user', userAuthRoutes);
app.use('/api/v1/auth/admin', adminAuthRoutes);

app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
});