import { Review } from '../../../domain/review/Review.js';
import { IReviewRepository } from '../../review/ports/IReviewRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { ModerateReviewDTO, AdminOperationResultDTO } from '../dtos/index.js';

export interface ModerateReviewDeps {
  reviewRepository: IReviewRepository;
}

export class ModerateReviewUseCase implements IUseCase<ModerateReviewDTO, AdminOperationResultDTO> {
  private readonly reviewRepository: IReviewRepository;

  constructor({ reviewRepository }: ModerateReviewDeps) {
    this.reviewRepository = reviewRepository;
  }

  async execute({ reviewId, action, reason }: ModerateReviewDTO): Promise<AdminOperationResultDTO> {
    const review = await this.reviewRepository.findById(reviewId);
    if (!review) {
      throw new NotFoundError(`Reseña con ID '${reviewId}'`);
    }

    let updatedComment = review.comment;
    if (action === 'hide') {
      updatedComment = `[Comentario oculto por moderación: ${reason || 'Infracción a normas de la comunidad'}]`;
    } else if (action === 'delete') {
      updatedComment = `[Reseña eliminada por el administrador]`;
    }

    const moderatedReview = new Review({
      id: review.id,
      bookingId: review.bookingId,
      studentId: review.studentId,
      tutorId: review.tutorId,
      rating: review.rating,
      comment: updatedComment,
      createdAt: review.createdAt,
    });

    await this.reviewRepository.create(moderatedReview);

    return {
      success: true,
      targetId: review.id,
      message: `Acción '${action}' ejecutada con éxito sobre la reseña ${review.id}`,
    };
  }
}
