import { Response, NextFunction } from 'express';
import {
  CreateReviewUseCase,
  GetTutorReviewsUseCase,
} from '../../../application/review/index.js';
import { AuthenticatedRequest } from '../middlewares/authMiddleware.js';

export class ReviewController {
  private createReviewUseCase: CreateReviewUseCase;
  private getTutorReviewsUseCase: GetTutorReviewsUseCase;

  constructor({
    createReviewUseCase,
    getTutorReviewsUseCase,
  }: {
    createReviewUseCase: CreateReviewUseCase;
    getTutorReviewsUseCase: GetTutorReviewsUseCase;
  }) {
    this.createReviewUseCase = createReviewUseCase;
    this.getTutorReviewsUseCase = getTutorReviewsUseCase;
  }

  createReview = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const studentId = req.user?.id || req.body.studentId;
      const { bookingId, rating, comment } = req.body;

      const review = await this.createReviewUseCase.execute({
        bookingId,
        studentId,
        rating: Number(rating),
        comment,
      });

      res.status(201).json({
        success: true,
        data: review,
      });
    } catch (err) {
      next(err);
    }
  };

  getTutorReviews = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { tutorId } = req.params;
      const reviews = await this.getTutorReviewsUseCase.execute(tutorId);

      res.status(200).json({
        success: true,
        count: reviews.length,
        data: reviews,
      });
    } catch (err) {
      next(err);
    }
  };
}
