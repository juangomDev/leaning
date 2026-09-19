import { IBookingRepository } from '../../../domain/booking/BookingRepository.js';
import { Booking, BookingStatus, BookingModality } from '../../../domain/booking/Booking.js';
import { supabase } from '../supabaseClient.js';

export class SupabaseBookingRepository implements IBookingRepository {
  async create(booking: Booking): Promise<Booking> {
    if (!supabase) return booking;

    const { error } = await supabase.from('bookings').insert({
      id: booking.id,
      student_id: booking.studentId,
      tutor_id: booking.tutorId,
      subject: booking.subject,
      scheduled_at: booking.scheduledAt.toISOString(),
      duration_hours: booking.durationHours,
      modality: booking.modality,
      status: booking.status,
      total_price: booking.totalPrice,
      notes: booking.notes,
    });

    if (error) throw new Error(error.message);
    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error || !data) return null;

    const dur = Number(data.duration_hours) || 1;
    const tot = Number(data.total_price) || 0;
    const rate = dur > 0 ? tot / dur : 25;

    return new Booking({
      id: data.id,
      studentId: data.student_id,
      tutorId: data.tutor_id,
      tutorSubjectId: data.tutor_subject_id || `subj-${data.tutor_id}`,
      subject: data.subject,
      scheduledAt: new Date(data.scheduled_at),
      durationHours: dur,
      modality: data.modality as BookingModality,
      status: data.status as BookingStatus,
      hourlyRate: rate,
      totalPrice: tot,
      notes: data.notes || null,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    });
  }

  async findByStudentId(studentId: string): Promise<Booking[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        tutor:tutor_id (
          id,
          subject_name,
          profiles:id (full_name, avatar_url)
        )
      `)
      .eq('student_id', studentId)
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map((b: any) => {
      const dur = Number(b.duration_hours) || 1;
      const tot = Number(b.total_price) || 0;
      const rate = dur > 0 ? tot / dur : 25;

      return new Booking({
        id: b.id,
        studentId: b.student_id,
        tutorId: b.tutor_id,
        tutorSubjectId: b.tutor_subject_id || `subj-${b.tutor_id}`,
        subject: b.subject,
        scheduledAt: new Date(b.scheduled_at),
        durationHours: dur,
        modality: b.modality as BookingModality,
        status: b.status as BookingStatus,
        hourlyRate: rate,
        totalPrice: tot,
        notes: b.notes || null,
        createdAt: b.created_at ? new Date(b.created_at) : new Date(),
      });
    });
  }

  async findByTutorId(tutorId: string): Promise<Booking[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select(`*`)
      .eq('tutor_id', tutorId)
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map((b: any) => {
      const dur = Number(b.duration_hours) || 1;
      const tot = Number(b.total_price) || 0;
      const rate = dur > 0 ? tot / dur : 25;

      return new Booking({
        id: b.id,
        studentId: b.student_id,
        tutorId: b.tutor_id,
        tutorSubjectId: b.tutor_subject_id || `subj-${b.tutor_id}`,
        subject: b.subject,
        scheduledAt: new Date(b.scheduled_at),
        durationHours: dur,
        modality: b.modality as BookingModality,
        status: b.status as BookingStatus,
        hourlyRate: rate,
        totalPrice: tot,
        notes: b.notes || null,
        createdAt: b.created_at ? new Date(b.created_at) : new Date(),
      });
    });
  }

  async updateStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    if (!supabase) {
      const current = await this.findById(id);
      if (!current) throw new Error('Booking not found');
      current.status = status;
      if (notes) current.notes = notes;
      return current;
    }

    const updates: Record<string, any> = { status };
    if (notes) updates.notes = notes;

    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    const dur = Number(data.duration_hours) || 1;
    const tot = Number(data.total_price) || 0;
    const rate = dur > 0 ? tot / dur : 25;

    return new Booking({
      id: data.id,
      studentId: data.student_id,
      tutorId: data.tutor_id,
      tutorSubjectId: data.tutor_subject_id || `subj-${data.tutor_id}`,
      subject: data.subject,
      scheduledAt: new Date(data.scheduled_at),
      durationHours: dur,
      modality: data.modality as BookingModality,
      status: data.status as BookingStatus,
      hourlyRate: rate,
      totalPrice: tot,
      notes: data.notes || null,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    });
  }
}
