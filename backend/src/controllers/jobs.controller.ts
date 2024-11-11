import { Request, Response } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import Job from '../models/jobs.model';

// Add custom interface for typed requests
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

    const job = new Job({
      ...req.body,
      clubId: req.auth.userId
    });
    const savedJob = await job.save();
    res.status(201).json(savedJob);
  } catch (error) {
    res.status(400).json({ message: "Error creating job", error });
  }
};

export const getJobs = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const jobs = await Job.find({ status: 'published' });
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs", error });
  }
};

export const getJobById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error fetching job", error });
  }
};

export const updateJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({ message: "Unauthorized - No user ID found" });
      return;
    }

    const job = await Job.findOneAndUpdate(
      { _id: req.params.id, clubId: req.auth.userId },
      req.body,
      { new: true }
    );
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json(job);
  } catch (error) {
    res.status(500).json({ message: "Error updating job", error });
  }
};

export const deleteJob = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.auth?.userId) {
      res.status(401).json({ message: "Unauthorized - No user ID found" });
      return;
    }

    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      clubId: req.auth.userId
    });
    if (!job) {
      res.status(404).json({ message: "Job not found" });
      return;
    }
    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting job", error });
  }
};