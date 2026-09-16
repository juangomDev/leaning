import { Router } from 'express';
import { container } from '../../../infrastructure/container.js';

const router = Router();
const { tutorController } = container;

router.get('/', tutorController.getTutors);
router.get('/:id', tutorController.getTutorById);
router.post('/apply', tutorController.applyTutor);

export default router;
