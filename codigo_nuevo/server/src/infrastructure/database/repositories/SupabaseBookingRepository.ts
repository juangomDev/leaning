import { IBookingRepository } from '../../../domain/repositories/IBookingRepository.js';
import { Booking, BookingModality, BookingStatus } from '../../../domain/entities/Booking.js';
import { supabase } from '../supabaseClient.js';

export class SupabaseBookingRepository implements IBookingRepository {
  async create(booking: Booking): Promise<Booking> {
    if (!supabase) return booking;

    const { error } = await supabase
      .from('bookings')
      .insert({
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
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error || !data) return null;

    return new Booking({
      id: data.id,
      studentId: data.student_id,
      tutorId: data.tutor_id,
      subject: data.subject,
      scheduledAt: data.scheduled_at,
      durationHours: data.duration_hours,
      modality: data.modality as BookingModality,
      status: data.status as BookingStatus,
      totalPrice: data.total_price,
      notes: data.notes,
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

    return (data || []).map(
      (b: any) =>
        new Booking({
          id: b.id,
          studentId: b.student_id,
          tutorId: b.tutor_id,
          subject: b.subject,
          scheduledAt: b.scheduled_at,
          durationHours: b.duration_hours,
          modality: b.modality as BookingModality,
          status: b.status as BookingStatus,
          totalPrice: b.total_price,
          notes: b.notes,
          createdAt: b.created_at ? new Date(b.created_at) : new Date(),
          tutor: {
            id: b.tutor?.id,
            name: b.tutor?.profiles?.full_name,
            avatar: b.tutor?.profiles?.avatar_url,
          },
        })
    );
  }

  async findByTutorId(tutorId: string): Promise<Booking[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        student:student_id (
          id,
          full_name,
          avatar_url
        )
      `)
      .eq('tutor_id', tutorId)
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(error.message);

    return (data || []).map(
      (b: any) =>
        new Booking({
          id: b.id,
          studentId: b.student_id,
          tutorId: b.tutor_id,
          subject: b.subject,
          scheduledAt: b.scheduled_at,
          durationHours: b.duration_hours,
          modality: b.modality as BookingModality,
          status: b.status as BookingStatus,
          totalPrice: b.total_price,
          notes: b.notes,
          createdAt: b.created_at ? new Date(b.created_at) : new Date(),
          student: {
            id: b.student?.id,
            name: b.student?.full_name,
            avatar: b.student?.avatar_url,
          },
        })
    );
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

    return new Booking({
      id: data.id,
      studentId: data.student_id,
      tutorId: data.tutor_id,
      subject: data.subject,
      scheduledAt: data.scheduled_at,
      durationHours: data.duration_hours,
      modality: data.modality as BookingModality,
      status: data.status as BookingStatus,
      totalPrice: data.total_price,
      notes: data.notes,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    });
  }
}
