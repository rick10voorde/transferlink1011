import { Request } from 'express';
import { IJob } from '../models/job';

export interface JobBody extends Omit<IJob, 'club' | 'views' | 'applications' | 'createdAt' | 'updatedAt' | 'expiresAt'> {
  club: string;
}

export interface CreateJobRequest extends Request {
  body: JobBody;
}

export interface UpdateJobRequest extends Request {
  params: {
    jobId: string;
  };
  body: Partial<JobBody>;
}

export interface JobResponse {
  success: boolean;
  data: IJob | null;
  message?: string;
}

export interface JobsListResponse {
  success: boolean;
  data: {
    jobs: IJob[];
    total: number;
    page: number;
    limit: number;
  };
  message?: string;
}