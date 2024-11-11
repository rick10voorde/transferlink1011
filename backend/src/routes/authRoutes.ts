import express from 'express';
import { getCurrentUser, updateUserRole } from '../controllers/authController';
import { requireAuth } from '../middleware/auth';

const router = express.Router();

router.get('/me', requireAuth, getCurrentUser);
router.put('/role', requireAuth, updateUserRole);

export default router;