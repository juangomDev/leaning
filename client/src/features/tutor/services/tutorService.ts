import { apiClient } from '../../../api/apiClient';

export interface TutorSubject {
  id: string;
  name: string;
  category: string;
  hourlyRate: number;
  level: string;
  active: boolean;
}

export interface TutorReview {
  id: string;
  studentName: string;
  studentAvatar: string;
  rating: number;
  date: string;
  comment: string;
  subject: string;
  reply?: string;
}

export interface TutorProfileData {
  id?: string;
  full_name: string;
  avatar_url: string;
  headline: string;
  bio: string;
  baseHourlyRate: number;
  experienceYears: number;
  degree: string;
  languages: string[];
  modality: 'online' | 'presencial' | 'ambas';
  videoPresentationUrl?: string;
  isAvailable: boolean;
  verificationStatus: 'verified' | 'pending' | 'unverified';
  documentUploaded?: boolean;
}

const DEFAULT_SUBJECTS: TutorSubject[] = [
  { id: 'ts_1', name: 'Cálculo Diferencial e Integral', category: 'Matemáticas', hourlyRate: 25.0, level: 'Universitario', active: true },
  { id: 'ts_2', name: 'Física Cuántica y Clásica', category: 'Física', hourlyRate: 28.0, level: 'Universitario / Bachillerato', active: true },
  { id: 'ts_3', name: 'Álgebra Lineal y Geometría Analítica', category: 'Matemáticas', hourlyRate: 24.0, level: 'Secundaria / Pregrado', active: true },
];

const DEFAULT_REVIEWS: TutorReview[] = [
  {
    id: 'rev_1',
    studentName: 'Mateo González',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: 'Hace 3 días',
    comment: 'Elena me salvó el semestre en Cálculo III. Su paciencia y explicaciones visuales son excepcionales.',
    subject: 'Cálculo Diferencial',
    reply: '¡Muchas gracias Mateo! Tuviste una gran disciplina para dominar las integrales dobles.',
  },
  {
    id: 'rev_2',
    studentName: 'Camila Rodriguez',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    rating: 5,
    date: 'Hace 1 semana',
    comment: 'Excelente tutora. Domina a la perfección los teoremas y se adapta a tu ritmo.',
    subject: 'Álgebra Lineal',
  },
  {
    id: 'rev_3',
    studentName: 'Lucas Morales',
    studentAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    rating: 4,
    date: 'Hace 2 semanas',
    comment: 'Muy buena clase de cinemática. Resolvimos varios ejercicios tipo examen.',
    subject: 'Física Clásica',
  },
];

export const tutorService = {
  async getProfile(): Promise<TutorProfileData> {
    const saved = localStorage.getItem('educonnect_tutor_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }

    try {
      const res = await apiClient.get('/auth/me');
      const data = res.data?.data || res.data;
      const initial: TutorProfileData = {
        full_name: data?.profile?.full_name || 'Prof. Carlos Mendoza',
        avatar_url: data?.profile?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        headline: 'PhD en Física y Matemáticas Puras',
        bio: 'Más de 8 años enseñando cálculo diferencial, ecuaciones diferenciales y física para estudiantes de ingeniería y ciencias.',
        baseHourlyRate: 25.0,
        experienceYears: 8,
        degree: 'Doctorado en Ciencias Físicas por la Universidad Complutense',
        languages: ['Español (Nativo)', 'Inglés (C2)'],
        modality: 'online',
        videoPresentationUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        isAvailable: true,
        verificationStatus: 'verified',
        documentUploaded: true,
      };
      localStorage.setItem('educonnect_tutor_profile', JSON.stringify(initial));
      return initial;
    } catch {
      return {
        full_name: 'Prof. Carlos Mendoza',
        avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
        headline: 'PhD en Física y Matemáticas Puras',
        bio: 'Más de 8 años enseñando cálculo diferencial, ecuaciones diferenciales y física.',
        baseHourlyRate: 25.0,
        experienceYears: 8,
        degree: 'Doctorado en Ciencias Físicas',
        languages: ['Español (Nativo)', 'Inglés (C2)'],
        modality: 'online',
        isAvailable: true,
        verificationStatus: 'verified',
        documentUploaded: true,
      };
    }
  },

  async updateProfile(data: Partial<TutorProfileData>): Promise<TutorProfileData> {
    const current = await this.getProfile();
    const updated = { ...current, ...data };
    localStorage.setItem('educonnect_tutor_profile', JSON.stringify(updated));
    return updated;
  },

  async toggleAvailability(): Promise<boolean> {
    const current = await this.getProfile();
    const updated = { ...current, isAvailable: !current.isAvailable };
    localStorage.setItem('educonnect_tutor_profile', JSON.stringify(updated));
    return updated.isAvailable;
  },

  async getSubjects(): Promise<TutorSubject[]> {
    const saved = localStorage.getItem('educonnect_tutor_subjects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_tutor_subjects', JSON.stringify(DEFAULT_SUBJECTS));
    return DEFAULT_SUBJECTS;
  },

  async addSubject(subject: Omit<TutorSubject, 'id'>): Promise<TutorSubject> {
    const subjects = await this.getSubjects();
    const newSubject: TutorSubject = {
      ...subject,
      id: `ts_${Date.now()}`,
    };
    const updated = [...subjects, newSubject];
    localStorage.setItem('educonnect_tutor_subjects', JSON.stringify(updated));
    return newSubject;
  },

  async deleteSubject(id: string): Promise<void> {
    const subjects = await this.getSubjects();
    const updated = subjects.filter(s => s.id !== id);
    localStorage.setItem('educonnect_tutor_subjects', JSON.stringify(updated));
  },

  async getReviews(): Promise<TutorReview[]> {
    const saved = localStorage.getItem('educonnect_tutor_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_tutor_reviews', JSON.stringify(DEFAULT_REVIEWS));
    return DEFAULT_REVIEWS;
  },

  async replyToReview(reviewId: string, replyText: string): Promise<void> {
    const reviews = await this.getReviews();
    const updated = reviews.map(r => r.id === reviewId ? { ...r, reply: replyText } : r);
    localStorage.setItem('educonnect_tutor_reviews', JSON.stringify(updated));
  },
};
