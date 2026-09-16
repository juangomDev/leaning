import { ITutorRepository } from '../../../domain/repositories/ITutorRepository.js';
import { Tutor, TutorFilterOptions, TutorModality } from '../../../domain/entities/Tutor.js';
import { supabase } from '../supabaseClient.js';

export class SupabaseTutorRepository implements ITutorRepository {
  async findAll(filters: TutorFilterOptions = {}): Promise<Tutor[]> {
    if (!supabase) return [];

    let query = supabase.from('tutors').select(`
      *,
      profiles:id (
        full_name,
        avatar_url,
        phone
      )
    `);

    if (filters.category) {
      query = query.eq('subject_category', filters.category);
    }
    if (filters.modality && filters.modality !== 'todas') {
      query = query.or(`modality.eq.${filters.modality},modality.eq.ambas`);
    }
    if (filters.maxPrice) {
      query = query.lte('price_per_hour', filters.maxPrice);
    }
    if (filters.minRating) {
      query = query.gte('rating', filters.minRating);
    }

    const { data, error } = await query;
    if (error) throw new Error(error.message);

    const tutors = (data || []).map(
      (item: any) =>
        new Tutor({
          id: item.id,
          fullName: item.profiles?.full_name || 'Tutor',
          avatarUrl: item.profiles?.avatar_url,
          subjectName: item.subject_name,
          subjectCategory: item.subject_category,
          bio: item.bio,
          pricePerHour: item.price_per_hour,
          modality: item.modality as TutorModality,
          rating: item.rating,
          reviewsCount: item.reviews_count,
          badges: item.badges || [],
          isAvailable: item.is_available,
          createdAt: item.created_at ? new Date(item.created_at) : new Date(),
        })
    );

    if (filters.query) {
      const q = filters.query.toLowerCase();
      return tutors.filter(
        (t) =>
          t.fullName.toLowerCase().includes(q) ||
          t.subjectName.toLowerCase().includes(q) ||
          (t.bio && t.bio.toLowerCase().includes(q))
      );
    }

    return tutors;
  }

  async findById(id: string): Promise<Tutor | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('tutors')
      .select(`
        *,
        profiles:id (
          full_name,
          avatar_url,
          phone
        )
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    return new Tutor({
      id: data.id,
      fullName: data.profiles?.full_name || 'Tutor',
      avatarUrl: data.profiles?.avatar_url,
      subjectName: data.subject_name,
      subjectCategory: data.subject_category,
      bio: data.bio,
      pricePerHour: data.price_per_hour,
      modality: data.modality as TutorModality,
      rating: data.rating,
      reviewsCount: data.reviews_count,
      badges: data.badges || [],
      isAvailable: data.is_available,
      createdAt: data.created_at ? new Date(data.created_at) : new Date(),
    });
  }

  async create(tutor: Tutor): Promise<Tutor> {
    if (!supabase) return tutor;

    const { error } = await supabase.from('tutors').insert({
      id: tutor.id,
      subject_name: tutor.subjectName,
      subject_category: tutor.subjectCategory,
      bio: tutor.bio,
      price_per_hour: tutor.pricePerHour,
      modality: tutor.modality,
      rating: tutor.rating,
      reviews_count: tutor.reviewsCount,
      badges: tutor.badges,
      is_available: tutor.isAvailable,
    });

    if (error) throw new Error(error.message);
    return tutor;
  }

  async update(id: string, updates: Partial<Tutor>): Promise<Tutor> {
    if (!supabase) {
      const current = await this.findById(id);
      return current || (updates as Tutor);
    }

    const payload: Record<string, any> = {};
    if (updates.subjectName !== undefined) payload.subject_name = updates.subjectName;
    if (updates.subjectCategory !== undefined) payload.subject_category = updates.subjectCategory;
    if (updates.bio !== undefined) payload.bio = updates.bio;
    if (updates.pricePerHour !== undefined) payload.price_per_hour = updates.pricePerHour;
    if (updates.modality !== undefined) payload.modality = updates.modality;
    if (updates.isAvailable !== undefined) payload.is_available = updates.isAvailable;

    const { error } = await supabase.from('tutors').update(payload).eq('id', id);
    if (error) throw new Error(error.message);

    const updated = await this.findById(id);
    return updated!;
  }
}
