import { Router } from 'express';
import { container } from '../../../infrastructure/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const adminController = container.adminController;

router.post('/tutors/:id/approve', authMiddleware, adminController.approveTutor);
router.post('/users/:id/ban', authMiddleware, adminController.banUser);
router.post('/reviews/:id/moderate', authMiddleware, adminController.moderateReview);

export default router;
