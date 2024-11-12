import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import Job from '../models/jobs.model';

interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
    user?: any;
  };
}

export const createJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({ message: "Unauthorized - No user ID found" });
      return;
    }

    console.log('Creating job with data:', req.body);
    console.log('Auth info:', req.auth);

    const job = new Job({
      ...req.body,
      clubId: req.auth.userId,
      status: 'published'
    });

    console.log('Job model created:', job);

    const savedJob = await job.save();
    console.log('Job saved to database:', savedJob);
    
    res.status(201).json(savedJob);
  } catch (error) {
    console.error('Detailed error in createJob:', error);
    res.status(400).json({ 
      message: "Error creating job", 
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error
    });
  }
};

export const getJobs = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('Fetching all published jobs');
    const jobs = await Job.find({ status: 'published' });
    console.log('Found jobs:', jobs);
    res.json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

export const getJobById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    console.log('Fetching job by ID:', req.params.id);
    const job = await Job.findById(req.params.id);
    if (!job) {
      console.log('Job not found');
      res.status(404).json({ message: "Job not found" });
      return;
    }
    console.log('Found job:', job);
    res.json(job);
  } catch (error) {
    console.error('Error fetching job by ID:', error);
    res.status(500).json({ message: "Error fetching job", error });
  }
};

export const updateJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({ message: "Unauthorized - No user ID found" });
      return;
    }

    console.log('Updating job:', req.params.id);
    console.log('Update data:', req.body);

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, clubId: req.auth.userId },
      req.body,
      { new: true }
    );
    if (!job) {
      console.log('Job not found or unauthorized');
      res.status(404).json({ message: "Job not found" });
      return;
    }
    console.log('Job updated:', job);
    res.json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ message: "Error updating job", error });
  }
};

export const deleteJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({ message: "Unauthorized - No user ID found" });
      return;
    }

    console.log('Deleting job:', req.params.id);

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      clubId: req.auth.userId
    });
    if (!job) {
      console.log('Job not found or unauthorized');
      res.status(404).json({ message: "Job not found" });
      return;
    }
    console.log('Job deleted:', job);
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ message: "Error deleting job", error });
  }
};