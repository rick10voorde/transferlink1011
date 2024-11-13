import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/database';
import jobRoutes from './routes/jobs.routes';
import dashboardRoutes from './routes/dashboard.routes'; // Nieuwe import
import { limiter } from './middleware/auth';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://yourdomain.com' 
    : 'http://localhost:3000',
  credentials: true,
  exposedHeaders: ['Authorization']
}));
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());
app.use(limiter);

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/dashboard', dashboardRoutes); // Nieuwe route

// Health check route
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Global error handling middleware
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  console.error('Global Error:', err);
  
  if (err.statusCode === 401) {
    res.status(401).json({ message: 'Unauthorized' });
  } else {
    res.status(500).json({ message: 'Something went wrong!' });
  }
};

// Gebruik error handlers als middleware
app.use(errorHandler);

// Start server and connect to database
const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();