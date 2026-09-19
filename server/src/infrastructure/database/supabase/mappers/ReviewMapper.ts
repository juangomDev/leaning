import { Review } from '../../../../domain/review/Review.js';
import { ReviewFactory } from '../../../../domain/review/ReviewFactory.js';
import { ReviewRow } from '../client.js';

export class ReviewMapper {
  public static toDomain(row: ReviewRow): Review {
    return ReviewFactory.reconstitute({
      id: row.id,
      bookingId: row.booking_id,
      studentId: row.student_id,
      tutorId: row.tutor_id,
      rating: Number(row.rating),
      comment: row.comment,
      createdAt: row.created_at,
    });
  }

  public static toRow(review: Review): Partial<ReviewRow> {
    return {
      id: review.id,
      booking_id: review.bookingId,
      student_id: review.studentId,
      tutor_id: review.tutorId,
      rating: review.rating,
      comment: review.comment,
    };
  }
}
