import { Booking } from '../../../domain/entities/Booking.js';
import { IBookingRepository } from '../../../domain/repositories/IBookingRepository.js';

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
