import { Request, Response } from 'express';
import { clerkClient } from '@clerk/clerk-sdk-node';

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - Clerk types
    const userId = req.auth.userId;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const user = await clerkClient.users.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Error fetching user data' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - Clerk types
    const userId = req.auth.userId;
    const { role } = req.body;
    
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Validate role
    const validRoles = ['club', 'agent', 'player'];
    if (!validRoles.includes(role)) {
      res.status(400).json({ message: 'Invalid role' });
      return;
    }

    // Update user metadata with role
    await clerkClient.users.updateUser(userId, {
      publicMetadata: { role }
    });

    res.json({ message: 'Role updated successfully', role });
  } catch (error) {
    console.error('Error updating role:', error);
    res.status(500).json({ message: 'Error updating user role' });
  }
};