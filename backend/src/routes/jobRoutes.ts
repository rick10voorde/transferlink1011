// src/routes/jobRoutes.ts
import { Router, RequestHandler } from 'express';
import {
  createJob,
  getJobs,
  getJob,
  updateJob,
  deleteJob
} from '../controllers/jobController';
import { CreateJobRequest, UpdateJobRequest, JobResponse, JobsListResponse } from '../types/jobTypes';

const router = Router();

// Routes with properly typed handlers
router.get('/', getJobs as RequestHandler<{}, JobsListResponse>);

router.get('/:jobId', getJob as RequestHandler<{ jobId: string }, JobResponse>);

router.post('/', createJob as RequestHandler<{}, JobResponse, CreateJobRequest['body']>);

router.put('/:jobId', updateJob as RequestHandler<{ jobId: string }, JobResponse, UpdateJobRequest['body']>);

router.delete('/:jobId', deleteJob as RequestHandler<{ jobId: string }, JobResponse>);

export default router;