import { IReviewRepository } from '../../../../domain/review/ReviewRepository.js';
import { Review } from '../../../../domain/review/Review.js';
import { dbClient as supabase } from '../client.js';
import { ReviewMapper } from '../mappers/ReviewMapper.js';

export class SupabaseReviewRepository implements IReviewRepository {
  async findById(id: string): Promise<Review | null> {
    if (!supabase) return null;

    const { data, error } = await supabase.from('reviews').select('*').eq('id', id).single();
    if (error || !data) return null;

    return ReviewMapper.toDomain(data);
  }

  async findByBookingId(bookingId: string): Promise<Review | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('booking_id', bookingId)
      .maybeSingle();

    if (error || !data) return null;
    return ReviewMapper.toDomain(data);
  }

  async findByTutorId(tutorId: string): Promise<Review[]> {
    if (!supabase) return [];

    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data || []).map((r: any) => ReviewMapper.toDomain(r));
  }

  async create(review: Review): Promise<Review> {
    if (!supabase) return review;

    const row = ReviewMapper.toRow(review);
    const { data, error } = await supabase
      .from('reviews')
      .upsert({
        id: review.id,
        booking_id: row.booking_id,
        student_id: row.student_id,
        tutor_id: row.tutor_id,
        rating: row.rating,
        comment: row.comment,
        created_at: review.createdAt.toISOString(),
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return ReviewMapper.toDomain(data);
  }
}
