import { ITutorRepository } from '../../../../domain/tutor/TutorRepository.js';
import { Tutor, TutorFilterOptions } from '../../../../domain/tutor/Tutor.js';
import { supabase } from '../client.js';
import { TutorMapper } from '../mappers/TutorMapper.js';

export class SupabaseTutorRepository implements ITutorRepository {
  async findAll(filters: TutorFilterOptions = {}): Promise<Tutor[]> {
    if (!supabase) return [];

    let query = supabase.from('tutors').select(`
      *,
      profiles:id (
        full_name,
        avatar_url
      ),
      tutor_subjects (*)
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

    return (data || []).map((item: any) => {
      const row = {
        id: item.id,
        user_id: item.user_id || item.id,
        full_name: item.profiles?.full_name || item.full_name || 'Tutor',
        avatar_url: item.profiles?.avatar_url || item.avatar_url || '',
        bio: item.bio || '',
        modality: item.modality || 'online',
        rating: item.rating ? Number(item.rating) : 5.0,
        reviews_count: item.reviews_count ? Number(item.reviews_count) : 0,
        badges: item.badges || [],
        is_available: Boolean(item.is_available ?? true),
        created_at: item.created_at || new Date().toISOString(),
      };

      const subjects = (item.tutor_subjects && item.tutor_subjects.length > 0)
        ? item.tutor_subjects
        : [
            {
              id: `subj-${item.id}`,
              tutor_id: item.id,
              subject_name: item.subject_name || 'General',
              category: item.subject_category || 'otro',
              price_per_hour: item.price_per_hour ? Number(item.price_per_hour) : 25,
              description: item.bio || 'Clases particulares',
              is_active: Boolean(item.is_available ?? true),
              created_at: item.created_at || new Date().toISOString(),
            },
          ];

      return TutorMapper.toDomain(row, subjects);
    });
  }

  async findById(id: string): Promise<Tutor | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from('tutors')
      .select(`
        *,
        profiles:id (
          full_name,
          avatar_url
        ),
        tutor_subjects (*)
      `)
      .eq('id', id)
      .single();

    if (error || !data) return null;

    const row = {
      id: data.id,
      user_id: data.user_id || data.id,
      full_name: data.profiles?.full_name || data.full_name || 'Tutor',
      avatar_url: data.profiles?.avatar_url || data.avatar_url || '',
      bio: data.bio || '',
      modality: data.modality || 'online',
      rating: data.rating ? Number(data.rating) : 5.0,
      reviews_count: data.reviews_count ? Number(data.reviews_count) : 0,
      badges: data.badges || [],
      is_available: Boolean(data.is_available ?? true),
      created_at: data.created_at || new Date().toISOString(),
    };

    const subjects = (data.tutor_subjects && data.tutor_subjects.length > 0)
      ? data.tutor_subjects
      : [
          {
            id: `subj-${data.id}`,
            tutor_id: data.id,
            subject_name: data.subject_name || 'General',
            category: data.subject_category || 'otro',
            price_per_hour: data.price_per_hour ? Number(data.price_per_hour) : 25,
            description: data.bio || 'Clases particulares',
            is_active: Boolean(data.is_available ?? true),
            created_at: data.created_at || new Date().toISOString(),
          },
        ];

    return TutorMapper.toDomain(row, subjects);
  }

  async create(tutor: Tutor): Promise<Tutor> {
    if (!supabase) return tutor;

    const row = TutorMapper.toRow(tutor);
    const primarySubject = tutor.subjects[0];

    const { error: tutorError } = await supabase.from('tutors').upsert({
      id: tutor.id,
      user_id: tutor.userId,
      bio: row.bio,
      modality: row.modality,
      rating: row.rating,
      reviews_count: row.reviews_count,
      badges: row.badges,
      is_available: row.is_available,
      subject_name: primarySubject?.subjectName,
      subject_category: primarySubject?.category,
      price_per_hour: primarySubject?.pricePerHour,
    });

    if (tutorError) throw new Error(tutorError.message);

    if (tutor.subjects.length > 0) {
      const subjectRows = tutor.subjects.map((s) => TutorMapper.toSubjectRow(s));
      await supabase.from('tutor_subjects').upsert(subjectRows);
    }

    return tutor;
  }

  async update(id: string, tutor: Tutor): Promise<Tutor> {
    if (!supabase) return tutor;

    const row = TutorMapper.toRow(tutor);
    const primarySubject = tutor.subjects[0];

    const { error } = await supabase
      .from('tutors')
      .update({
        bio: row.bio,
        modality: row.modality,
        rating: row.rating,
        reviews_count: row.reviews_count,
        badges: row.badges,
        is_available: row.is_available,
        subject_name: primarySubject?.subjectName,
        subject_category: primarySubject?.category,
        price_per_hour: primarySubject?.pricePerHour,
      })
      .eq('id', id);

    if (error) throw new Error(error.message);

    if (tutor.subjects.length > 0) {
      const subjectRows = tutor.subjects.map((s) => TutorMapper.toSubjectRow(s));
      await supabase.from('tutor_subjects').upsert(subjectRows);
    }

    return tutor;
  }
}
