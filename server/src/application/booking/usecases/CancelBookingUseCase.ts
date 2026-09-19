import { IBookingRepository } from '../ports/IBookingRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { BookingNotFoundError } from '../errors/index.js';
import { CancelBookingDTO, BookingResponseDTO } from '../dtos/index.js';
import { BookingMapper } from '../mappers/BookingMapper.js';

export interface CancelBookingDeps {
  bookingRepository: IBookingRepository;
}

export class CancelBookingUseCase implements IUseCase<CancelBookingDTO, BookingResponseDTO> {
  private readonly bookingRepository: IBookingRepository;

  constructor({ bookingRepository }: CancelBookingDeps) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ bookingId, reason }: CancelBookingDTO): Promise<BookingResponseDTO> {
    const booking = await this.bookingRepository.findById(bookingId);
    if (!booking) {
      throw new BookingNotFoundError(bookingId);
    }

    booking.cancel(reason);
    const updated = await this.bookingRepository.updateStatus(bookingId, booking.status, booking.notes ?? undefined);
    return BookingMapper.toDTO(updated);
  }
}
