import { Request, Response, NextFunction } from 'express';
import { ClerkExpressRequireAuth } from '@clerk/clerk-sdk-node';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Clerk auth middleware
export const requireAuth = ClerkExpressRequireAuth();

// Custom auth error handling
export const handleAuthError = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err.statusCode === 401) {
    return res.status(401).json({ message: 'Unauthorized' });
  }
  next(err);
};