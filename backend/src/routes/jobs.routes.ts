// backend/src/routes/jobs.routes.ts
import express, { Router } from 'express';
import type { Request, Response } from 'express';
import {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob
} from '../controllers/jobs.controller';
import { requireAuth } from '../middleware/auth';  // Add this import

const router: Router = express.Router();

// Wrap the async handlers to handle promise rejections
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => 
  (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch((error) => {
      res.status(500).json({ error: error.message });
    });
  };

// Protected routes
router.post('/', requireAuth, asyncHandler(createJob));
router.get('/', asyncHandler(getJobs));  // This one can stay public
router.get('/:id', requireAuth, asyncHandler(getJobById));
router.put('/:id', requireAuth, asyncHandler(updateJob));
router.delete('/:id', requireAuth, asyncHandler(deleteJob));

export default router;