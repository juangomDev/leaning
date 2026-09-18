import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { backendClient } from '../api/backendClient';
import { Booking } from '../types';

const STORAGE_KEY = 'educonnect_bookings';

export const bookingsService = {
  async getBookings(userId?: string, role?: string): Promise<Booking[]> {
    // 1. Try Clean Architecture Backend
    if (userId) {
      try {
        const backendRes = await backendClient.get<{ success?: boolean; data?: any[] }>('/bookings/my-bookings', null, {
          'x-demo-user-id': userId,
          'x-demo-role': role || 'student',
        });
        if (backendRes && backendRes.success && Array.isArray(backendRes.data) && backendRes.data.length > 0) {
          return backendRes.data.map((b: any): Booking => ({
            id: b.id,
            student_id: b.studentId,
            student_name: b.studentName || 'Estudiante',
            student_avatar: b.studentAvatar,
            tutor_id: b.tutorId,
            tutor_name: b.tutorName || 'Tutor',
            tutor_avatar: b.tutorAvatar,
            subject: b.subject || 'Tutoría',
            scheduled_at: b.scheduledAt,
            duration_hours: b.durationHours,
            modality: b.modality,
            status: b.status,
            total_price: b.totalPrice,
            notes: b.notes,
            created_at: b.createdAt,
          }));
        }
      } catch (err) {
        console.warn('Error fetching bookings from backend, trying Supabase/local fallback:', err);
      }
    }

    // 2. Try Supabase directly if configured
    if (isSupabaseConfigured && supabase && userId) {
      try {
        const query = supabase
          .from('bookings')
          .select(`
            *,
            tutor:tutor_id (
              subject_name,
              price_per_hour,
              profiles:id (full_name, avatar_url)
            ),
            student:student_id (
              full_name,
              avatar_url,
              phone
            )
          `);

        if (role === 'tutor') {
          query.eq('tutor_id', userId);
        } else {
          query.eq('student_id', userId);
        }

        const { data, error } = await query.order('scheduled_at', { ascending: true });
        if (!error && data) {
          return (data as any[]).map((b: any): Booking => ({
            id: b.id,
            student_id: b.student_id,
            student_name: b.student?.full_name || 'Estudiante',
            student_avatar: b.student?.avatar_url,
            tutor_id: b.tutor_id,
            tutor_name: b.tutor?.profiles?.full_name || 'Tutor',
            tutor_avatar: b.tutor?.profiles?.avatar_url,
            subject: b.subject || b.tutor?.subject_name || 'Tutoría',
            scheduled_at: b.scheduled_at,
            duration_hours: b.duration_hours,
            modality: b.modality,
            status: b.status,
            total_price: b.total_price,
            notes: b.notes,
            created_at: b.created_at,
          }));
        }
      } catch (err) {
        console.warn('Error fetching bookings from Supabase, using fallback:', err);
      }
    }

    // Local fallback
    const saved = localStorage.getItem(STORAGE_KEY);
    const bookings: Booking[] = saved ? JSON.parse(saved) : [];
    if (!userId) return bookings;
    return bookings.filter(b => role === 'tutor' ? b.tutor_id === userId : b.student_id === userId);
  },

  async createBooking(booking: any): Promise<Booking> {
    // 1. Try Clean Architecture Backend
    try {
      const backendRes = await backendClient.post<{ success?: boolean; data?: any }>(
        '/bookings',
        {
          studentId: booking.student_id,
          tutorId: booking.tutor_id,
          subject: booking.subject,
          scheduledAt: booking.scheduled_at,
          durationHours: booking.duration_hours || 1,
          modality: booking.modality || 'online',
          totalPrice: booking.total_price,
          notes: booking.notes || '',
        },
        null,
        {
          'x-demo-user-id': booking.student_id,
          'x-demo-role': 'student',
        }
      );
      if (backendRes && backendRes.success && backendRes.data) {
        const b = backendRes.data;
        return {
          id: b.id,
          student_id: b.studentId,
          tutor_id: b.tutorId,
          subject: b.subject,
          scheduled_at: b.scheduledAt,
          duration_hours: b.durationHours,
          modality: b.modality,
          status: b.status,
          total_price: b.totalPrice,
          notes: b.notes,
          created_at: b.createdAt,
        };
      }
    } catch (err) {
      console.warn('Error creating booking on backend, trying fallback:', err);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .insert([{
            student_id: booking.student_id,
            tutor_id: booking.tutor_id,
            subject: booking.subject,
            scheduled_at: booking.scheduled_at,
            duration_hours: booking.duration_hours || 1,
            modality: booking.modality || 'online',
            status: 'pending',
            total_price: booking.total_price,
            notes: booking.notes || '',
          }])
          .select();

        if (!error && data && data[0]) {
          return data[0] as Booking;
        }
      } catch (err) {
        console.warn('Error creating booking on Supabase, falling back to local:', err);
      }
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
    userId: string | null = null,
    role: string | null = null
  ): Promise<Booking | undefined> {
    // 1. Try Clean Architecture Backend
    try {
      const backendRes = await backendClient.patch<{ success?: boolean; data?: any }>(
        `/bookings/${bookingId}/status`,
        { status: newStatus },
        null,
        {
          'x-demo-user-id': userId || 'demo-user',
          'x-demo-role': role || 'tutor',
        }
      );
      if (backendRes && backendRes.success && backendRes.data) {
        const b = backendRes.data;
        return {
          id: b.id,
          student_id: b.studentId,
          tutor_id: b.tutorId,
          subject: b.subject,
          scheduled_at: b.scheduledAt,
          duration_hours: b.durationHours,
          modality: b.modality,
          status: b.status,
          total_price: b.totalPrice,
        };
      }
    } catch (err) {
      console.warn('Error updating booking status on backend, trying fallback:', err);
    }

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('bookings')
          .update({ status: newStatus })
          .eq('id', bookingId)
          .select();

        if (!error && data && data[0]) {
          return data[0] as Booking;
        }
      } catch (err) {
        console.warn('Error updating booking on Supabase:', err);
      }
    }

    // Local fallback
    const saved = localStorage.getItem(STORAGE_KEY);
    const bookings: Booking[] = saved ? JSON.parse(saved) : [];
    const updated = bookings.map(b => b.id === bookingId ? { ...b, status: newStatus } : b);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated.find(b => b.id === bookingId);
  }
};
