import { Review } from './Review.js';

export interface ReviewRepository {
  findById(id: string): Promise<Review | null>;
  findByBookingId(bookingId: string): Promise<Review | null>;
  findByTutorId(tutorId: string): Promise<Review[]>;
  create(review: Review): Promise<Review>;
}

export type IReviewRepository = ReviewRepository;
