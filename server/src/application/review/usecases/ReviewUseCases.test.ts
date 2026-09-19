import { describe, it } from 'node:test';
import assert from 'node:assert';
import { Review } from '../../../domain/review/Review.js';
import { IReviewRepository } from '../ports/IReviewRepository.js';
import { IBookingRepository } from '../../booking/ports/IBookingRepository.js';
import { Booking } from '../../../domain/booking/Booking.js';
import { BookingFactory } from '../../../domain/booking/BookingFactory.js';
import { CreateReviewUseCase } from './CreateReviewUseCase.js';
import { GetTutorReviewsUseCase } from './GetTutorReviewsUseCase.js';
import { ConflictError } from '../../shared/errors/ConflictError.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';

class MockReviewRepository implements IReviewRepository {
  public reviews: Map<string, Review> = new Map();

  async findById(id: string): Promise<Review | null> {
    return this.reviews.get(id) || null;
  }
  async findByBookingId(bookingId: string): Promise<Review | null> {
    for (const r of this.reviews.values()) {
      if (r.bookingId === bookingId) return r;
    }
    return null;
  }
  async findByTutorId(tutorId: string): Promise<Review[]> {
    return Array.from(this.reviews.values()).filter((r) => r.tutorId === tutorId);
  }
  async create(review: Review): Promise<Review> {
    this.reviews.set(review.id, review);
    return review;
  }
}

class MockBookingRepo implements IBookingRepository {
  public bookings: Map<string, Booking> = new Map();
  async findById(id: string): Promise<Booking | null> { return this.bookings.get(id) || null; }
  async findByStudentId(): Promise<Booking[]> { return []; }
  async findByTutorId(): Promise<Booking[]> { return []; }
  async create(b: Booking): Promise<Booking> { this.bookings.set(b.id, b); return b; }
  async updateStatus(): Promise<Booking> { throw new Error('Not needed'); }
}

describe('Review UseCases', () => {
  it('debe permitir crear una reseña únicamente si la clase está en estado completed', async () => {
    const revRepo = new MockReviewRepository();
    const bookRepo = new MockBookingRepo();

    const booking = BookingFactory.create({
      id: 'book-completed',
      studentId: 'stu-ana',
      tutorId: 'tut-pedro',
      tutorSubjectId: 'subj-1',
      subject: 'Matemáticas',
      scheduledAt: new Date(),
      hourlyRate: 30,
    });

    await bookRepo.create(booking);

    const useCase = new CreateReviewUseCase({
      reviewRepository: revRepo,
      bookingRepository: bookRepo,
    });

    // Estado 'pending': debe fallar con ConflictError
    await assert.rejects(
      async () => {
        await useCase.execute({
          bookingId: 'book-completed',
          rating: 5,
          comment: 'Excelente clase muy clara',
          studentId: 'stu-ana',
        });
      },
      ConflictError
    );

    // Pasamos a 'confirmed' y luego a 'completed'
    booking.confirm();
    booking.complete();

    // Ahora debe tener éxito
    const result = await useCase.execute({
      bookingId: 'book-completed',
      rating: 5,
      comment: 'Excelente clase muy clara y didáctica',
      studentId: 'stu-ana',
    });

    assert.ok(result.id);
    assert.strictEqual(result.bookingId, 'book-completed');
    assert.strictEqual(result.rating, 5);
    assert.strictEqual(result.comment, 'Excelente clase muy clara y didáctica');
  });

  it('debe rechazar reseña si el estudiante que la emite no es el de la reserva', async () => {
    const revRepo = new MockReviewRepository();
    const bookRepo = new MockBookingRepo();

    const booking = BookingFactory.create({
      id: 'book-foreign',
      studentId: 'stu-ana',
      tutorId: 'tut-pedro',
      tutorSubjectId: 'subj-1',
      subject: 'Matemáticas',
      scheduledAt: new Date(),
      hourlyRate: 30,
    });
    booking.confirm();
    booking.complete();
    await bookRepo.create(booking);

    const useCase = new CreateReviewUseCase({
      reviewRepository: revRepo,
      bookingRepository: bookRepo,
    });

    await assert.rejects(
      async () => {
        await useCase.execute({
          bookingId: 'book-foreign',
          rating: 4,
          comment: 'Clase buena',
          studentId: 'stu-impostor',
        });
      },
      ForbiddenError
    );
  });

  it('debe listar las reseñas de un tutor', async () => {
    const revRepo = new MockReviewRepository();
    const bookRepo = new MockBookingRepo();

    const booking = BookingFactory.create({
      id: 'book-review-list',
      studentId: 'stu-ana',
      tutorId: 'tut-pedro',
      tutorSubjectId: 'subj-1',
      subject: 'Matemáticas',
      scheduledAt: new Date(),
      hourlyRate: 30,
    });
    booking.confirm();
    booking.complete();
    await bookRepo.create(booking);

    const createUseCase = new CreateReviewUseCase({
      reviewRepository: revRepo,
      bookingRepository: bookRepo,
    });
    await createUseCase.execute({
      bookingId: 'book-review-list',
      rating: 5,
      comment: 'Increíble profesor',
    });

    const getReviewsUseCase = new GetTutorReviewsUseCase({ reviewRepository: revRepo });
    const list = await getReviewsUseCase.execute('tut-pedro');
    assert.strictEqual(list.length, 1);
    assert.strictEqual(list[0].tutorId, 'tut-pedro');
  });
});
