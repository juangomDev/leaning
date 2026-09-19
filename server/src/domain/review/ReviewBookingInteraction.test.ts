import { describe, it } from 'node:test';
import assert from 'node:assert';
import { BookingFactory } from '../booking/BookingFactory.js';
import { Review } from './Review.js';
import { ReviewFactory } from './ReviewFactory.js';
import { ConflictError } from '../shared/errors/DomainError.js';

describe('Prueba Multi-Entidad: Interacción Booking -> Review', () => {
  const futureDate = new Date(Date.now() + 86400000);

  it('debe permitir generar una reseña a partir de un Booking cuando y solo cuando está completed', () => {
    // 1. Crear reserva
    const booking = BookingFactory.create({
      studentId: 'student-300',
      tutorId: 'tutor-400',
      tutorSubjectId: 'subj-english',
      subject: 'Inglés Avanzado',
      scheduledAt: futureDate,
      hourlyRate: 25,
    });

    // En estado pending no se puede generar review
    assert.throws(
      () =>
        ReviewFactory.createFromCompletedBooking(booking, {
          rating: 5,
          comment: 'Clase aún no realizada',
        }),
      (err: any) => err instanceof ConflictError && err.message.includes('Solo se permite para clases completadas')
    );

    // 2. Avanzar el ciclo de vida de Booking: pending -> confirmed -> completed
    booking.confirm();
    booking.complete();

    // 3. Ahora sí se puede generar la Review
    const review = ReviewFactory.createFromCompletedBooking(booking, {
      rating: 5,
      comment: '¡Excelente tutor! Aprendí mucho vocabulario.',
    });

    assert.ok(review.id);
    assert.strictEqual(review.bookingId, booking.id);
    assert.strictEqual(review.studentId, 'student-300');
    assert.strictEqual(review.tutorId, 'tutor-400');
    assert.strictEqual(review.rating, 5);
  });
});
