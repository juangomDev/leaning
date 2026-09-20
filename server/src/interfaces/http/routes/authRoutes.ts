import { Router } from 'express';
import { container } from '../../../infrastructure/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const { authController } = container;

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email', authController.verifyEmail);
router.post('/resend-verification', authController.resendVerification);
router.post('/onboarding', authMiddleware, authController.onboarding);

export default router;
