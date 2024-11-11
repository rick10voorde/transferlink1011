import { User } from '@clerk/clerk-sdk-node';

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string;
        sessionId: string;
        user?: User;
      };
    }
  }
}

export {};