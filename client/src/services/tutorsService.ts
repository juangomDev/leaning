import { apiClient } from '../api/apiClient';
import { INITIAL_TUTORS } from '../data/initialTutors';
import { Tutor } from '../types';

export interface TutorFilters {
  q?: string;
  categoria?: string;
  modalidad?: string;
  maxPrice?: number;
  minRating?: number;
}

export const tutorsService = {
  async getTutors(filters?: TutorFilters): Promise<Tutor[]> {
    try {
      const params: Record<string, any> = {};
      if (filters?.q) params.q = filters.q;
      if (filters?.categoria && filters.categoria !== 'todas') params.categoria = filters.categoria;
      if (filters?.modalidad && filters.modalidad !== 'todas') params.modalidad = filters.modalidad;
      if (filters?.maxPrice) params.maxPrice = filters.maxPrice;
      if (filters?.minRating) params.minRating = filters.minRating;

      const res = await apiClient.get('/tutors', { params });
      const data = res.data?.data || res.data;

      if (Array.isArray(data) && data.length > 0) {
        return data.map((t: any): Tutor => ({
          id: String(t.id),
          full_name: t.fullName || t.full_name || 'Tutor',
          avatar_url: t.avatarUrl || t.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
          subject_name: t.subjectName || t.subject_name || (t.subjects?.[0]?.subjectName) || 'Tutoría General',
          subject_category: t.subjectCategory || t.subject_category || (t.subjects?.[0]?.category) || 'otro',
          bio: t.bio || '',
          price_per_hour: Number(t.pricePerHour || t.price_per_hour || t.subjects?.[0]?.pricePerHour || 25),
          modality: t.modality || 'online',
          rating: Number(t.rating || 5.0),
          reviews_count: Number(t.reviewsCount || t.reviews_count || 0),
          badges: t.badges || ['Verificado'],
          is_available: t.isAvailable ?? t.is_available ?? true,
        }));
      }
    } catch (err: any) {
      console.warn('[tutorsService] Error al consultar API backend, usando fallback:', err?.message);
    }

    // Fallback local
    const saved = localStorage.getItem('educonnect_tutors');
    if (saved) {
      try {
        return JSON.parse(saved) as Tutor[];
      } catch (e) {
        console.error(e);
      }
    }
    localStorage.setItem('educonnect_tutors', JSON.stringify(INITIAL_TUTORS));
    return INITIAL_TUTORS;
  },

  async getTutorById(id: string | number | undefined): Promise<Tutor> {
    if (!id) {
      const all = await this.getTutors();
      return all[0];
    }

    try {
      const res = await apiClient.get(`/tutors/${id}`);
      const t = res.data?.data || res.data;
      if (t && t.id) {
        return {
          id: String(t.id),
          full_name: t.fullName || t.full_name,
          avatar_url: t.avatarUrl || t.avatar_url,
          subject_name: t.subjectName || t.subject_name || (t.subjects?.[0]?.subjectName) || 'Tutoría General',
          subject_category: t.subjectCategory || t.subject_category || (t.subjects?.[0]?.category) || 'otro',
          bio: t.bio || '',
          price_per_hour: Number(t.pricePerHour || t.price_per_hour || t.subjects?.[0]?.pricePerHour || 25),
          modality: t.modality || 'online',
          rating: Number(t.rating || 5.0),
          reviews_count: Number(t.reviewsCount || t.reviews_count || 0),
          badges: t.badges || [],
          is_available: t.isAvailable ?? true,
        };
      }
    } catch (err: any) {
      console.warn(`[tutorsService] Error consultando tutor ${id}, buscando en catálogo local:`, err?.message);
    }

    const tutors = await this.getTutors();
    const match = tutors.find(t => String(t.id) === String(id));
    return match || tutors[0];
  }
};
