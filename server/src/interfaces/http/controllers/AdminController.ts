import { Response, NextFunction } from 'express';
import {
  ApproveTutorUseCase,
  BanUserUseCase,
  ModerateReviewUseCase,
} from '../../../application/admin/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { UnauthorizedError } from '../../../domain/shared/errors/DomainError.js';

export class AdminController {
  private approveTutorUseCase: ApproveTutorUseCase;
  private banUserUseCase: BanUserUseCase;
  private moderateReviewUseCase: ModerateReviewUseCase;

  constructor({
    approveTutorUseCase,
    banUserUseCase,
    moderateReviewUseCase,
  }: {
    approveTutorUseCase: ApproveTutorUseCase;
    banUserUseCase: BanUserUseCase;
    moderateReviewUseCase: ModerateReviewUseCase;
  }) {
    this.approveTutorUseCase = approveTutorUseCase;
    this.banUserUseCase = banUserUseCase;
    this.moderateReviewUseCase = moderateReviewUseCase;
  }

  private assertAdmin(req: AuthenticatedRequest): void {
    if (req.user?.role !== 'admin') {
      throw new UnauthorizedError('Acceso denegado: se requieren permisos de administrador');
    }
  }

  approveTutor = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.assertAdmin(req);
      const { id } = req.params;
      const result = await this.approveTutorUseCase.execute({ tutorId: id });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  banUser = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.assertAdmin(req);
      const { id } = req.params;
      const { reason } = req.body;

      const result = await this.banUserUseCase.execute({
        userId: id,
        reason: reason || 'Incumplimiento de términos',
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  moderateReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      this.assertAdmin(req);
      const { id } = req.params;
      const { action } = req.body;

      const result = await this.moderateReviewUseCase.execute({
        reviewId: id,
        action: action || 'hide',
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
