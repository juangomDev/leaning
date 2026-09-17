import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes.js';
import tutorRoutes from './tutorRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import walletRoutes from './walletRoutes.js';

const apiRouter = Router();

// Health Check
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'EduConnect Backend API (TypeScript)',
    architecture: 'Clean Architecture',
    version: '1.0.0',
  });
});

// Domain Module Routes
apiRouter.use('/auth', authRoutes);
apiRouter.use('/tutors', tutorRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/wallet', walletRoutes);

export default apiRouter;
