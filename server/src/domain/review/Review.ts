import { ValidationError, ConflictError } from '../shared/errors/DomainError.js';
import { Booking } from '../booking/Booking.js';

export interface ReviewProps {
  id: string;
  bookingId: string;
  studentId: string;
  tutorId: string;
  rating: number;
  comment: string;
  createdAt: Date;
}

export class Review {
  public readonly id: string;
  public readonly bookingId: string;
  public readonly studentId: string;
  public readonly tutorId: string;
  public readonly rating: number;
  public readonly comment: string;
  public readonly createdAt: Date;

  constructor({
    id,
    bookingId,
    studentId,
    tutorId,
    rating,
    comment,
    createdAt,
  }: ReviewProps) {
    if (!id || typeof id !== 'string' || id.trim() === '') {
      throw new ValidationError('El id de la reseña es requerido');
    }
    if (!bookingId || typeof bookingId !== 'string' || bookingId.trim() === '') {
      throw new ValidationError('El bookingId es requerido');
    }
    if (!studentId || typeof studentId !== 'string' || studentId.trim() === '') {
      throw new ValidationError('El studentId es requerido');
    }
    if (!tutorId || typeof tutorId !== 'string' || tutorId.trim() === '') {
      throw new ValidationError('El tutorId es requerido');
    }
    if (!createdAt || !(createdAt instanceof Date) || isNaN(createdAt.getTime())) {
      throw new ValidationError('La fecha de creación createdAt es requerida y debe ser válida');
    }

    this.validateRating(rating);
    this.validateComment(comment);

    this.id = id.trim();
    this.bookingId = bookingId.trim();
    this.studentId = studentId.trim();
    this.tutorId = tutorId.trim();
    this.rating = Math.round(Number(rating));
    this.comment = comment.trim();
    this.createdAt = createdAt;
  }

  public static fromCompletedBooking(
    booking: Booking,
    { id, rating, comment, createdAt = new Date() }: { id: string; rating: number; comment: string; createdAt?: Date }
  ): Review {
    if (!booking.canGenerateReview()) {
      throw new ConflictError(
        `No se puede generar una reseña para una reserva en estado "${booking.status}". Solo se permite para clases completadas.`
      );
    }

    return new Review({
      id,
      bookingId: booking.id,
      studentId: booking.studentId,
      tutorId: booking.tutorId,
      rating,
      comment,
      createdAt,
    });
  }

  private validateRating(rating: number): void {
    if (rating === undefined || isNaN(rating) || rating < 1 || rating > 5) {
      throw new ValidationError('La calificación debe ser un valor entre 1 y 5 estrellas');
    }
  }

  private validateComment(comment: string): void {
    if (!comment || typeof comment !== 'string' || comment.trim().length < 3) {
      throw new ValidationError('El comentario de la reseña debe tener al menos 3 caracteres');
    }
    if (comment.trim().length > 1000) {
      throw new ValidationError('El comentario de la reseña no puede exceder 1000 caracteres');
    }
  }
}
