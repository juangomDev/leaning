import { Review } from '../../../domain/review/Review.js';
import { ReviewResponseDTO } from '../dtos/index.js';

export class ReviewMapper {
  public static toDTO(review: Review): ReviewResponseDTO {
    return {
      id: review.id,
      bookingId: review.bookingId,
      studentId: review.studentId,
      tutorId: review.tutorId,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt.toISOString(),
    };
  }
}
