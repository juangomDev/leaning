import { IBookingRepository } from '../ports/IBookingRepository.js';
import { IUseCase } from '../../shared/IUseCase.js';
import { BookingResponseDTO } from '../dtos/index.js';
import { BookingMapper } from '../mappers/BookingMapper.js';

export interface GetUserBookingsDeps {
  bookingRepository: IBookingRepository;
}

export interface GetUserBookingsInput {
  userId: string;
  role?: string;
}

export class GetUserBookingsUseCase implements IUseCase<GetUserBookingsInput, BookingResponseDTO[]> {
  private readonly bookingRepository: IBookingRepository;

  constructor({ bookingRepository }: GetUserBookingsDeps) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ userId, role }: GetUserBookingsInput): Promise<BookingResponseDTO[]> {
    const bookings =
      role === 'tutor'
        ? await this.bookingRepository.findByTutorId(userId)
        : await this.bookingRepository.findByStudentId(userId);

    return bookings.map((b) => BookingMapper.toDTO(b));
  }
}
