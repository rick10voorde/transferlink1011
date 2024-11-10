// src/controllers/jobController.ts
import { Request, Response } from 'express';
import Job from '../models/job';
import { CreateJobRequest, UpdateJobRequest, JobResponse, JobsListResponse } from '../types/jobTypes';

export const createJob = async (req: CreateJobRequest, res: Response<JobResponse>) => {
  try {
    const job = new Job({
      ...req.body,
      club: req.body.club
    });

    await job.save();

    res.status(201).json({
      success: true,
      data: job,
      message: 'Job created successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to create job'
    });
  }
};

export const getJobs = async (req: Request, res: Response<JobsListResponse>) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = req.query.status || 'active';

    const jobs = await Job.find({ status })
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Job.countDocuments({ status });

    res.status(200).json({
      success: true,
      data: {
        jobs,
        total,
        page,
        limit
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: {
        jobs: [],
        total: 0,
        page: 1,
        limit: 10
      },
      message: error instanceof Error ? error.message : 'Failed to fetch jobs'
    });
  }
};

export const getJob = async (req: Request, res: Response<JobResponse>) => {
  try {
    const job = await Job.findById(req.params.jobId);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Job not found'
      });
    }

    job.views = (job.views || 0) + 1;
    await job.save();

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to fetch job'
    });
  }
};

export const updateJob = async (req: UpdateJobRequest, res: Response<JobResponse>) => {
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: job,
      message: 'Job updated successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to update job'
    });
  }
};

export const deleteJob = async (req: Request, res: Response<JobResponse>) => {
  try {
    const job = await Job.findByIdAndDelete(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        data: null,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      data: null,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      data: null,
      message: error instanceof Error ? error.message : 'Failed to delete job'
    });
  }
};