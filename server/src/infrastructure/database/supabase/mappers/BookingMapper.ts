import { Booking, BookingModality, BookingStatus } from '../../../../domain/booking/Booking.js';
import { BookingFactory } from '../../../../domain/booking/BookingFactory.js';
import { BookingRow } from '../client.js';

export class BookingMapper {
  public static toDomain(row: BookingRow): Booking {
    const dur = Number(row.duration_hours) || 1;
    const tot = Number(row.total_price) || 0;
    const rate = row.hourly_rate ? Number(row.hourly_rate) : dur > 0 ? tot / dur : 25;

    return BookingFactory.reconstitute({
      id: row.id,
      studentId: row.student_id,
      tutorId: row.tutor_id,
      tutorSubjectId: row.tutor_subject_id || `subj-${row.tutor_id}`,
      subject: row.subject,
      scheduledAt: row.scheduled_at,
      durationHours: dur,
      modality: row.modality as BookingModality,
      status: row.status as BookingStatus,
      hourlyRate: rate,
      totalPrice: tot,
      notes: row.notes,
      createdAt: row.created_at,
    });
  }

  public static toRow(booking: Booking): Partial<BookingRow> {
    return {
      id: booking.id,
      student_id: booking.studentId,
      tutor_id: booking.tutorId,
      tutor_subject_id: booking.tutorSubjectId,
      subject: booking.subject,
      scheduled_at: booking.scheduledAt.toISOString(),
      duration_hours: booking.durationHours,
      modality: booking.modality,
      status: booking.status,
      hourly_rate: booking.hourlyRate,
      total_price: booking.totalPrice,
      notes: booking.notes,
    };
  }
}
