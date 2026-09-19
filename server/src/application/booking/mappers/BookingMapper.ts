import { Booking } from '../../../domain/booking/Booking.js';
import { BookingResponseDTO } from '../dtos/index.js';

export interface BookingPresentationDetails {
  tutorName?: string;
  tutorAvatar?: string;
  studentName?: string;
  studentAvatar?: string;
}

export class BookingMapper {
  public static toDTO(booking: Booking, details?: BookingPresentationDetails): BookingResponseDTO {
    return {
      id: booking.id,
      studentId: booking.studentId,
      tutorId: booking.tutorId,
      tutorSubjectId: booking.tutorSubjectId,
      subject: booking.subject,
      scheduledAt: booking.scheduledAt.toISOString(),
      durationHours: booking.durationHours,
      modality: booking.modality,
      status: booking.status,
      hourlyRate: booking.hourlyRate,
      totalPrice: booking.totalPrice,
      notes: booking.notes,
      createdAt: booking.createdAt.toISOString(),
      tutor: details?.tutorName
        ? {
            id: booking.tutorId,
            name: details.tutorName,
            avatar: details.tutorAvatar,
          }
        : undefined,
      student: details?.studentName
        ? {
            id: booking.studentId,
            name: details.studentName,
            avatar: details.studentAvatar,
          }
        : undefined,
    };
  }
}
