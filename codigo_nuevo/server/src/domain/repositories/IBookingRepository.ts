import { Booking, BookingStatus } from '../entities/Booking.js';

export interface IBookingRepository {
  create(booking: Booking): Promise<Booking>;
  findById(id: string): Promise<Booking | null>;
  findByStudentId(studentId: string): Promise<Booking[]>;
  findByTutorId(tutorId: string): Promise<Booking[]>;
  updateStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking>;
}
