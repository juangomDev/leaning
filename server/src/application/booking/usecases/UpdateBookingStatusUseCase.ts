import { IBookingRepository } from '../ports/IBookingRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { BookingNotFoundError } from '../errors/index.js';
import { ForbiddenError } from '../../shared/errors/ForbiddenError.js';
import { UpdateBookingStatusDTO, BookingResponseDTO } from '../dtos/index.js';
import { BookingMapper } from '../mappers/BookingMapper.js';

export interface UpdateBookingStatusDeps {
  bookingRepository: IBookingRepository;
}

export class UpdateBookingStatusUseCase implements IUseCase<UpdateBookingStatusDTO, BookingResponseDTO> {
  private readonly bookingRepository: IBookingRepository;

  constructor({ bookingRepository }: UpdateBookingStatusDeps) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ bookingId, status, notes = null, requesterId, requesterRole }: UpdateBookingStatusDTO): Promise<BookingResponseDTO> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new BookingNotFoundError(bookingId);
    }

    if (requesterId) {
      const isStudent = booking.studentId === requesterId;
      const isTutor = booking.tutorId === requesterId;
      const isAdmin = requesterRole === 'admin';

      if (!isStudent && !isTutor && !isAdmin) {
        throw new ForbiddenError('No tienes autorización para modificar el estado de esta reserva');
      }
    }

    if (status === 'confirmed') booking.confirm();
    else if (status === 'cancelled') booking.cancel(notes ?? undefined);
    else if (status === 'completed') booking.complete();

    const updated = await this.bookingRepository.updateStatus(bookingId, booking.status, booking.notes ?? undefined);
    return BookingMapper.toDTO(updated);
  }
}
