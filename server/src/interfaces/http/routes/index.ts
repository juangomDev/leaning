import { Router, Request, Response } from 'express';
import authRoutes from './authRoutes.js';
import tutorRoutes from './tutorRoutes.js';
import bookingRoutes from './bookingRoutes.js';
import walletRoutes from './walletRoutes.js';
import studentRoutes from './studentRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import adminRoutes from './adminRoutes.js';

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
apiRouter.use('/students', studentRoutes);
apiRouter.use('/tutors', tutorRoutes);
apiRouter.use('/bookings', bookingRoutes);
apiRouter.use('/reviews', reviewRoutes);
apiRouter.use('/wallet', walletRoutes);
apiRouter.use('/admin', adminRoutes);

export default apiRouter;
