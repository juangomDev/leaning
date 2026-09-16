import { supabase, isSupabaseConfigured } from '../api/supabaseClient';
import { backendClient } from '../api/backendClient';
import { INITIAL_TUTORS } from '../data/initialTutors';

export const tutorsService = {
  async getTutors() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('tutors')
          .select(`
            *,
            profiles:id (
              full_name,
              avatar_url,
              phone
            )
          `);

        if (!error && data && data.length > 0) {
          return data.map(item => ({
            id: item.id,
            full_name: item.profiles?.full_name || 'Tutor',
            avatar_url: item.profiles?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
            subject_name: item.subject_name,
            subject_category: item.subject_category,
            bio: item.bio,
            price_per_hour: item.price_per_hour,
            modality: item.modality,
            rating: item.rating,
            reviews_count: item.reviews_count,
            badges: item.badges || [],
            is_available: item.is_available,
          }));
        }
      } catch (err) {
        console.warn('Error fetching tutors from Supabase, using fallback:', err);
      }
    }

    // Query Clean Architecture Backend
    const backendRes = await backendClient.get('/tutors');
    if (backendRes && backendRes.success && backendRes.data?.length > 0) {
      return backendRes.data.map((t) => ({
        id: t.id,
        full_name: t.fullName,
        avatar_url: t.avatarUrl,
        subject_name: t.subjectName,
        subject_category: t.subjectCategory,
        bio: t.bio,
        price_per_hour: t.pricePerHour,
        modality: t.modality,
        rating: t.rating,
        reviews_count: t.reviewsCount,
        badges: t.badges || [],
        is_available: t.isAvailable,
      }));
    }

    // Fallback local persistence
    const saved = localStorage.getItem('educonnect_tutors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('educonnect_tutors', JSON.stringify(INITIAL_TUTORS));
    return INITIAL_TUTORS;
  },

  async getTutorById(id) {
    const tutors = await this.getTutors();
    if (!id) return tutors[0];
    const match = tutors.find(t => t.id === id || String(t.id).startsWith(String(id)));
    if (match) return match;
    const num = parseInt(id, 10);
    if (!isNaN(num) && num > 0 && num <= tutors.length) {
      return tutors[num - 1];
    }
    return tutors[0];
  }
};
