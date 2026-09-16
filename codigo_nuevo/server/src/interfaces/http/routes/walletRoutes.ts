import { Router } from 'express';
import { container } from '../../../infrastructure/container.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
const { walletController } = container;

router.get('/balance', authMiddleware, walletController.getBalance);
router.post('/recharge', authMiddleware, walletController.recharge);

export default router;
