import { Response, NextFunction } from 'express';
import {
  GetWalletBalanceUseCase,
  RechargeWalletUseCase,
} from '../../../application/wallet/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export class WalletController {
  private getWalletBalanceUseCase: GetWalletBalanceUseCase;
  private rechargeWalletUseCase: RechargeWalletUseCase;

  constructor({
    getWalletBalanceUseCase,
    rechargeWalletUseCase,
  }: {
    getWalletBalanceUseCase: GetWalletBalanceUseCase;
    rechargeWalletUseCase: RechargeWalletUseCase;
  }) {
    this.getWalletBalanceUseCase = getWalletBalanceUseCase;
    this.rechargeWalletUseCase = rechargeWalletUseCase;
  }

  getBalance = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id || 'student-demo-id';
      const result = await this.getWalletBalanceUseCase.execute(userId);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  recharge = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = req.user?.id || 'student-demo-id';
      const { amount, method } = req.body;

      const result = await this.rechargeWalletUseCase.execute({
        userId,
        amount,
        method,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };
}
