import { Router } from 'express';
import { container } from '../../../infrastructure/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const studentController = container.studentController;

router.post('/', authMiddleware, studentController.createProfile);
router.get('/profile', authMiddleware, studentController.getProfile);
router.get('/:id', authMiddleware, studentController.getProfile);
router.put('/:id', authMiddleware, studentController.updateProfile);

export default router;
