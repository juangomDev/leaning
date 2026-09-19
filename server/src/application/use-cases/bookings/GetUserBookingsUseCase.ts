import { Booking } from '../../../domain/booking/Booking.js';
import { IBookingRepository } from '../../../domain/booking/BookingRepository.js';

export interface GetUserBookingsDTO {
  userId: string;
  role?: string;
}

export class GetUserBookingsUseCase {
  private bookingRepository: IBookingRepository;

  constructor({ bookingRepository }: { bookingRepository: IBookingRepository }) {
    this.bookingRepository = bookingRepository;
  }

  async execute({ userId, role }: GetUserBookingsDTO): Promise<Booking[]> {
    if (role === 'tutor') {
      return await this.bookingRepository.findByTutorId(userId);
    }
    return await this.bookingRepository.findByStudentId(userId);
  }
}
