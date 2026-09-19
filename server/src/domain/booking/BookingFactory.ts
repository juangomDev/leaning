import crypto from 'node:crypto';
import { Booking, BookingModality, BookingStatus } from './Booking.js';

export interface CreateBookingDTO {
  id?: string;
  studentId: string;
  tutorId: string;
  tutorSubjectId: string;
  subject: string;
  scheduledAt: Date | string;
  durationHours?: number;
  modality?: BookingModality;
  hourlyRate: number;
  notes?: string | null;
  createdAt?: Date;
}

export class BookingFactory {
  public static create({
    id,
    studentId,
    tutorId,
    tutorSubjectId,
    subject,
    scheduledAt,
    durationHours = 1,
    modality = 'online',
    hourlyRate,
    notes = null,
    createdAt = new Date(),
  }: CreateBookingDTO): Booking {
    const bookingId = id || crypto.randomUUID();
    const duration = Number(durationHours);
    const rate = Number(hourlyRate);
    const totalPrice = Number((duration * rate).toFixed(2));
    const parsedDate = scheduledAt instanceof Date ? scheduledAt : new Date(scheduledAt);

    return new Booking({
      id: bookingId,
      studentId,
      tutorId,
      tutorSubjectId,
      subject,
      scheduledAt: parsedDate,
      durationHours: duration,
      modality,
      status: 'pending',
      hourlyRate: rate,
      totalPrice,
      notes: notes || null,
      createdAt,
    });
  }

  public static reconstitute(raw: {
    id: string;
    studentId: string;
    tutorId: string;
    tutorSubjectId: string;
    subject: string;
    scheduledAt: Date | string;
    durationHours: number;
    modality: BookingModality;
    status: BookingStatus;
    hourlyRate: number;
    totalPrice: number;
    notes: string | null;
    createdAt: Date | string;
  }): Booking {
    return new Booking({
      id: raw.id,
      studentId: raw.studentId,
      tutorId: raw.tutorId,
      tutorSubjectId: raw.tutorSubjectId,
      subject: raw.subject,
      scheduledAt: raw.scheduledAt instanceof Date ? raw.scheduledAt : new Date(raw.scheduledAt),
      durationHours: raw.durationHours,
      modality: raw.modality,
      status: raw.status,
      hourlyRate: raw.hourlyRate,
      totalPrice: raw.totalPrice,
      notes: raw.notes,
      createdAt: raw.createdAt instanceof Date ? raw.createdAt : new Date(raw.createdAt),
    });
  }
}
