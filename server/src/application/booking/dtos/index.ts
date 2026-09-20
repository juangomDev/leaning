import { BookingModality, BookingStatus } from '../../../domain/booking/Booking.js';

export interface CreateBookingDTO {
  studentId: string;
  tutorId: string;
  subject?: string;
  scheduledAt: string | Date;
  durationHours?: number;
  modality?: BookingModality;
  notes?: string | null;
}

export interface UpdateBookingStatusDTO {
  bookingId: string;
  status: BookingStatus;
  notes?: string | null;
  requesterId?: string;
  requesterRole?: string;
}

export interface CancelBookingDTO {
  bookingId: string;
  reason?: string;
}

export interface BookingResponseDTO {
  id: string;
  studentId: string;
  tutorId: string;
  tutorSubjectId: string;
  subject: string;
  scheduledAt: string;
  durationHours: number;
  modality: BookingModality;
  status: BookingStatus;
  hourlyRate: number;
  totalPrice: number;
  notes: string | null;
  createdAt: string;
  tutor?: {
    id: string;
    name?: string;
    avatar?: string;
  };
  student?: {
    id: string;
    name?: string;
    avatar?: string;
  };
}
