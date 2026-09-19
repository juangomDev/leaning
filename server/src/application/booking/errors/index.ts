import { ConflictError } from '../../shared/errors/ConflictError.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

export class TutorUnavailableError extends ConflictError {
  constructor(tutorId: string, scheduledAt: Date) {
    super(`El tutor ${tutorId} no se encuentra disponible en la fecha y hora seleccionada: ${scheduledAt.toISOString()}`);
  }
}

export class BookingNotFoundError extends NotFoundError {
  constructor(bookingId: string) {
    super(`Reserva con ID '${bookingId}'`);
  }
}
