import { IReviewRepository } from '../../../domain/review/ReviewRepository.js';
import { Review } from '../../../domain/review/Review.js';

export class InMemoryReviewRepository implements IReviewRepository {
  private reviews: Review[];

  constructor() {
    this.reviews = [
      new Review({
        id: 'rev-001',
        bookingId: 'b-001',
        studentId: 'student-demo-id',
        tutorId: '2',
        rating: 5,
        comment: 'Excelente explicación de FastAPI y Docker, muy práctico.',
        createdAt: new Date(Date.now() - 86400000),
      }),
      new Review({
        id: 'rev-002',
        bookingId: 'b-002',
        studentId: 'student-demo-id',
        tutorId: '1',
        rating: 5,
        comment: 'La mejor profesora de matemáticas que he tenido, súper paciente.',
        createdAt: new Date(Date.now() - 172800000),
      }),
    ];
  }

  async findById(id: string): Promise<Review | null> {
    const review = this.reviews.find((r) => r.id === id);
    return review || null;
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    const review = this.reviews.find((r) => r.bookingId === bookingId);
    return review || null;
  }

  async findByTutorId(tutorId: string): Promise<Review[]> {
    return this.reviews.filter((r) => r.tutorId === tutorId);
  }

  async create(review: Review): Promise<Review> {
    const index = this.reviews.findIndex((r) => r.id === review.id);
    if (index >= 0) {
      this.reviews[index] = review;
    } else {
      this.reviews.unshift(review);
    }
    return review;
  }
}
