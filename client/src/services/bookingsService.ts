import { apiClient } from '../api/apiClient';
import { Booking, CreateBookingInput } from '../types';

const STORAGE_KEY = 'educonnect_bookings';

export const bookingsService = {
  async getBookings(userId?: string, role?: string): Promise<Booking[]> {
    try {
      const res = await apiClient.get('/bookings/my-bookings');
      const data = res.data?.data || res.data;

      if (Array.isArray(data) && data.length > 0) {
        return data.map((b: any): Booking => ({
          id: String(b.id),
          student_id: b.studentId || b.student_id,
          student_name: b.studentName || 'Estudiante',
          student_avatar: b.studentAvatar,
          tutor_id: String(b.tutorId || b.tutor_id),
          tutor_name: b.tutorName || 'Tutor',
          tutor_avatar: b.tutorAvatar,
          subject: b.subject || 'Tutoría',
          scheduled_at: b.scheduledAt || b.scheduled_at,
          duration_hours: Number(b.durationHours || b.duration_hours || 1),
          modality: b.modality || 'online',
          status: b.status || 'pending',
          total_price: Number(b.totalPrice || b.total_price || 0),
          notes: b.notes,
          created_at: b.createdAt || b.created_at,
        }));
      }
    } catch (err: any) {
      console.warn('[bookingsService] Error consultando /bookings/my-bookings, usando fallback:', err?.message);
    }

    // Fallback local
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved) as Booking[];
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  },

  async createBooking(booking: CreateBookingInput & { student_name?: string; student_avatar?: string; tutor_name?: string; tutor_avatar?: string }): Promise<Booking> {
    try {
      const payload = {
        tutorId: booking.tutor_id,
        subject: booking.subject,
        scheduledAt: booking.scheduled_at,
        durationHours: booking.duration_hours || 1,
        modality: booking.modality || 'online',
        notes: booking.notes || '',
      };

      const res = await apiClient.post('/bookings', payload);
      const b = res.data?.data || res.data;

      if (b && b.id) {
        return {
          id: String(b.id),
          student_id: b.studentId || booking.student_id,
          tutor_id: String(b.tutorId || booking.tutor_id),
          subject: b.subject || booking.subject,
          scheduled_at: b.scheduledAt || booking.scheduled_at,
          duration_hours: Number(b.durationHours || booking.duration_hours || 1),
          modality: b.modality || booking.modality || 'online',
          status: b.status || 'pending',
          total_price: Number(b.totalPrice || booking.total_price || 0),
          notes: b.notes || booking.notes,
          created_at: b.createdAt,
          student_name: booking.student_name,
          tutor_name: booking.tutor_name,
        };
      }
    } catch (err: any) {
      console.warn('[bookingsService] Error creando reserva en API, usando almacenamiento local:', err?.message);
    }

    // Local fallback
    const saved = localStorage.getItem(STORAGE_KEY);
    const bookings: Booking[] = saved ? JSON.parse(saved) : [];
    const newBooking: Booking = {
      id: 'book-' + Date.now(),
      status: 'pending',
      created_at: new Date().toISOString(),
      student_id: booking.student_id,
      tutor_id: booking.tutor_id,
      subject: booking.subject,
      scheduled_at: booking.scheduled_at,
      duration_hours: booking.duration_hours || 1,
      modality: booking.modality || 'online',
      total_price: booking.total_price,
      notes: booking.notes || '',
      student_name: booking.student_name,
      student_avatar: booking.student_avatar,
      tutor_name: booking.tutor_name,
      tutor_avatar: booking.tutor_avatar,
    };
    bookings.push(newBooking);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
    return newBooking;
  },

  async updateBookingStatus(
    bookingId: string,
    newStatus: string,
    notesOrUserId?: string,
    _userRole?: string
  ): Promise<Booking | undefined> {
    try {
      const res = await apiClient.patch(`/bookings/${bookingId}/status`, {
        status: newStatus,
        notes: notesOrUserId,
      });
      const b = res.data?.data || res.data;
      if (b && b.id) {
        return {
          id: String(b.id),
          student_id: b.studentId,
          tutor_id: String(b.tutorId),
          subject: b.subject,
          scheduled_at: b.scheduledAt,
          duration_hours: Number(b.durationHours || 1),
          modality: b.modality,
          status: b.status,
          total_price: Number(b.totalPrice || 0),
          notes: b.notes,
        };
      }
    } catch (err: any) {
      console.warn('[bookingsService] Error actualizando estado en API:', err?.message);
    }

    // Local fallback
    const saved = localStorage.getItem(STORAGE_KEY);
    const bookings: Booking[] = saved ? JSON.parse(saved) : [];
    const updated = bookings.map((b) => (b.id === bookingId ? { ...b, status: newStatus } : b));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find((b) => b.id === bookingId);
  },
};
