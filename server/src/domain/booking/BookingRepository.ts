import { Booking, BookingStatus } from './Booking.js';

export interface BookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByStudentId(studentId: string): Promise<Booking[]>;
  findByTutorId(tutorId: string): Promise<Booking[]>;
  updateStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking>;
}

export type IBookingRepository = BookingRepository;
