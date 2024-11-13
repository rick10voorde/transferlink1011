import { Request, Response } from 'express';
import Job from '../models/jobs.model';

// Custom interface voor type safety
interface AuthenticatedRequest extends Request {
  auth?: {
    userId: string;
    sessionId: string;
    user?: any;
  };
}

export const getClubDashboardStats = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const clubId = req.auth?.userId;
    
    if (!clubId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Get total jobs count
    const totalJobs = await Job.countDocuments({ clubId });
    
    // Get active jobs
    const activeJobs = await Job.countDocuments({ 
      clubId, 
      status: 'published',
      expiresAt: { $gt: new Date() }
    });

    // Get total applications
    const jobs = await Job.find({ clubId });
    const totalApplications = jobs.reduce((sum, job) => sum + (job.applications || 0), 0);

    // Get recent activity (last 5 jobs)
    const recentJobs = await Job.find({ clubId })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title status createdAt applications');

    res.json({
      stats: {
        totalJobs,
        activeJobs,
        totalApplications,
        averageApplications: totalJobs ? Math.round(totalApplications / totalJobs) : 0
      },
      recentActivity: recentJobs
    });
  } catch (error) {
    console.error('Error in getClubDashboardStats:', error);
    res.status(500).json({ message: 'Error fetching dashboard stats', error });
  }
};