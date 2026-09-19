import { IBookingRepository } from '../../domain/booking/BookingRepository.js';
import { Booking, BookingStatus } from '../../domain/booking/Booking.js';

export class InMemoryBookingRepository implements IBookingRepository {
  private bookings: Booking[];

  constructor() {
    this.bookings = [
      new Booking({
        id: 'b-001',
        studentId: 'student-demo-id',
        tutorId: '2',
        tutorSubjectId: 'subj-2',
        subject: 'Programación Python & Lógica',
        scheduledAt: new Date(Date.now() + 15 * 60 * 1000), // in 15 mins
        durationHours: 1,
        modality: 'online',
        status: 'confirmed',
        hourlyRate: 30,
        totalPrice: 30,
        notes: null,
        createdAt: new Date(),
      }),
      new Booking({
        id: 'b-002',
        studentId: 'student-demo-id',
        tutorId: '1',
        tutorSubjectId: 'subj-1',
        subject: 'Cálculo Integral & Series',
        scheduledAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
        durationHours: 1,
        modality: 'online',
        status: 'confirmed',
        hourlyRate: 25,
        totalPrice: 25,
        notes: null,
        createdAt: new Date(),
      }),
    ];
  }

  async create(booking: Booking): Promise<Booking> {
    this.bookings.unshift(booking);
    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    return this.bookings.find((b) => b.id === id) || null;
  }

  async findByStudentId(studentId: string): Promise<Booking[]> {
    return this.bookings.filter((b) => b.studentId === studentId);
  }

  async findByTutorId(tutorId: string): Promise<Booking[]> {
    return this.bookings.filter((b) => b.tutorId === tutorId);
  }

  async updateStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    const booking = await this.findById(id);
    if (!booking) throw new Error('Reserva no encontrada');
    booking.status = status;
    if (notes !== undefined) booking.notes = notes;
    return booking;
  }
}
