import { IBookingRepository } from '../../../../domain/booking/BookingRepository.js';
import { Booking, BookingStatus } from '../../../../domain/booking/Booking.js';
import { supabase } from '../client.js';
import { BookingMapper } from '../mappers/BookingMapper.js';

export class SupabaseBookingRepository implements IBookingRepository {
  async create(booking: Booking): Promise<Booking> {
    if (!supabase) return booking;

    const row = BookingMapper.toRow(booking);
    const { error } = await supabase.from('bookings').insert({
      id: row.id,
      student_id: row.student_id,
      tutor_id: row.tutor_id,
      tutor_subject_id: row.tutor_subject_id,
      subject: row.subject,
      scheduled_at: row.scheduled_at,
      duration_hours: row.duration_hours,
      modality: row.modality,
      status: row.status,
      hourly_rate: row.hourly_rate,
      total_price: row.total_price,
      notes: row.notes,
    });

    if (error) throw new Error(error.message);
    return booking;
  }

  async findById(id: string): Promise<Booking | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('bookings').select('*').eq('id', id).single();
    if (error || !data) return null;

    return BookingMapper.toDomain(data);
  }

  async findByStudentId(studentId: string): Promise<Booking[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('student_id', studentId)
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map((b: any) => BookingMapper.toDomain(b));
  }

  async findByTutorId(tutorId: string): Promise<Booking[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('scheduled_at', { ascending: true });

    if (error) throw new Error(error.message);
    return (data || []).map((b: any) => BookingMapper.toDomain(b));
  }

  async updateStatus(id: string, status: BookingStatus, notes?: string): Promise<Booking> {
    if (!supabase) {
      const existing = await this.findById(id);
      if (!existing) throw new Error('Reserva no encontrada');
      existing.status = status;
      if (notes !== undefined) existing.notes = notes;
      return existing;
    }

    const payload: any = { status };
    if (notes !== undefined) payload.notes = notes;

    const { data, error } = await supabase
      .from('bookings')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return BookingMapper.toDomain(data);
  }
}
