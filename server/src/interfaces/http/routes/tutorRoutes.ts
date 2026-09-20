import { Router } from 'express';
import { container } from '../../../infrastructure/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const { tutorController } = container;

router.get('/', tutorController.getTutors);
router.get('/:id', tutorController.getTutorById);
router.post('/apply', authMiddleware, tutorController.applyTutor);

export default router;
