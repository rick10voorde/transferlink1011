import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

// Clerk auth middleware - zonder opties om TypeScript errors te voorkomen
export const requireAuth = ClerkExpressRequireAuth();

// Custom auth error handling
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Auth Error:', err);
  if (err.statusCode === 401) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next(err);
};