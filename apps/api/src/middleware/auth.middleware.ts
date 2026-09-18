import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.model';
import Admin from '../models/Admin.model';

// Extend Express Request to carry user/admin payload
export interface AuthRequest extends Request {
  user?: any;
}

interface JwtPayload {
  id: string;
  role: string;
}

// ─── Protect: verify JWT & attach user/admin to req ────────────────────────
export const protect = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Not authorised, no token' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Try User first, then Admin
    let account =
      (await User.findById(decoded.id).select('-password')) ||
      (await Admin.findById(decoded.id).select('-password'));

    if (!account) {
      res.status(401).json({ success: false, message: 'Account not found' });
      return;
    }

    req.user = account;
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token invalid or expired' });
  }
};

// ─── isAdmin: only allow admin role ────────────────────────────────────────
export const isAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Admins only' });
  }
};

// ─── isUser: only allow user role ──────────────────────────────────────────
export const isUser = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.user && req.user.role === 'user') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Access denied: Users only' });
  }
};
