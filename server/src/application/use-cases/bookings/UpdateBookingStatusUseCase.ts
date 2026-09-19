import { Booking, BookingStatus } from '../../../domain/booking/Booking.js';
import { NotFoundError } from '../../../domain/shared/errors/DomainError.js';
import { IBookingRepository } from '../../../domain/booking/BookingRepository.js';

export interface UpdateBookingStatusDTO {
  bookingId: string;
  status: BookingStatus;
  notes?: string | null;
}

export class UpdateBookingStatusUseCase {
  private bookingRepository: IBookingRepository;

  constructor({ bookingRepository }: { bookingRepository: IBookingRepository }) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ bookingId, status, notes = null }: UpdateBookingStatusDTO): Promise<Booking> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new NotFoundError(`Reserva con ID '${bookingId}'`);
    }

    if (status === 'confirmed') booking.confirm();
    else if (status === 'cancelled') booking.cancel(notes ?? undefined);
    else if (status === 'completed') booking.complete();

    return await this.bookingRepository.updateStatus(bookingId, booking.status, booking.notes ?? undefined);
  }
}
