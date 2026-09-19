import { Router } from 'express';
import { container } from '../../../infrastructure/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const reviewController = container.reviewController;

router.post('/', authMiddleware, reviewController.createReview);
router.get('/tutor/:tutorId', reviewController.getTutorReviews);

export default router;
