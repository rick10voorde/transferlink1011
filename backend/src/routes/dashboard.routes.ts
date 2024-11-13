import express from 'express';
import { getClubDashboardStats } from '../controllers/dashboard.controller';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

// Gebruik een async wrapper om errors correct af te handelen
const asyncHandler = (fn: Function) => (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/club/stats', requireAuth, asyncHandler(getClubDashboardStats));

export default router;