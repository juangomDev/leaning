import { apiClient } from '../../../api/apiClient';

export interface AdminBooking {
  id: string;
  studentId: string;
  studentName: string;
  tutorId: string;
  tutorName: string;
  subjectName: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  grossAmount: number;
  totalPrice: number;
  platformCommission: number;
  startTime: string;
  endTime: string;
  meetingLink?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'DISPUTED' | 'CANCELLED';
  disputeReason?: string;
  disputeResolution?: string;
}

export interface AdminReview {
  id: string;
  bookingId?: string;
  studentId?: string;
  studentName: string;
  tutorId?: string;
  tutorName: string;
  rating: number;
  comment: string;
  date: string;
  createdAt: string;
  status: 'published' | 'hidden' | 'reported' | 'PUBLISHED' | 'HIDDEN' | 'REPORTED';
  reportReason?: string;
}

export interface AdminSubject {
  id: string;
  name: string;
  slug: string;
  category: string;
  description?: string;
  active: boolean;
  totalTutors: number;
  activeTutorsCount?: number;
}

const DEFAULT_BOOKINGS: AdminBooking[] = [
  {
    id: 'bk_admin_001',
    studentId: 'stu_01',
    studentName: 'Mateo González',
    tutorId: 'tut_01',
    tutorName: 'Dra. Elena Rostova',
    subjectName: 'Cálculo Diferencial',
    scheduledDate: '2026-09-22',
    scheduledTime: '16:00',
    startTime: '2026-09-22T16:00:00',
    endTime: '2026-09-22T17:00:00',
    durationMinutes: 60,
    grossAmount: 25.00,
    totalPrice: 25.00,
    platformCommission: 2.50,
    meetingLink: 'https://meet.educonnect.com/bk_admin_001',
    status: 'CONFIRMED',
  },
  {
    id: 'bk_admin_002',
    studentId: 'stu_02',
    studentName: 'Valeria Mendoza',
    tutorId: 'tut_02',
    tutorName: 'Ing. Carlos Mendoza',
    subjectName: 'Física Cuántica',
    scheduledDate: '2026-09-23',
    scheduledTime: '18:00',
    startTime: '2026-09-23T18:00:00',
    endTime: '2026-09-23T19:30:00',
    durationMinutes: 90,
    grossAmount: 37.50,
    totalPrice: 37.50,
    platformCommission: 3.75,
    meetingLink: 'https://meet.educonnect.com/bk_admin_002',
    status: 'PENDING',
  },
  {
    id: 'bk_admin_003',
    studentId: 'stu_03',
    studentName: 'Camila Rodriguez',
    tutorId: 'tut_01',
    tutorName: 'Dra. Elena Rostova',
    subjectName: 'Álgebra Lineal',
    scheduledDate: '2026-09-18',
    scheduledTime: '10:00',
    startTime: '2026-09-18T10:00:00',
    endTime: '2026-09-18T11:00:00',
    durationMinutes: 60,
    grossAmount: 24.00,
    totalPrice: 24.00,
    platformCommission: 2.40,
    meetingLink: 'https://meet.educonnect.com/bk_admin_003',
    status: 'COMPLETED',
  },
  {
    id: 'bk_admin_004',
    studentId: 'stu_01',
    studentName: 'Mateo González',
    tutorId: 'tut_02',
    tutorName: 'Ing. Carlos Mendoza',
    subjectName: 'Estructuras de Datos',
    scheduledDate: '2026-09-17',
    scheduledTime: '15:00',
    startTime: '2026-09-17T15:00:00',
    endTime: '2026-09-17T16:00:00',
    durationMinutes: 60,
    grossAmount: 35.00,
    totalPrice: 35.00,
    platformCommission: 3.50,
    meetingLink: 'https://meet.educonnect.com/bk_admin_004',
    status: 'DISPUTED',
    disputeReason: 'El alumno alega que el profesor tuvo problemas de conexión y la clase duró solo 20 minutos.',
  },
];

const DEFAULT_REVIEWS: AdminReview[] = [
  {
    id: 'rev_admin_01',
    bookingId: 'bk_admin_003',
    studentId: 'usr_008',
    studentName: 'Camila Rodriguez',
    tutorId: 'tut_01',
    tutorName: 'Dra. Elena Rostova',
    rating: 5,
    comment: 'Elena es una profesora maravillosa. Me explicó vectores y matrices con muchísima claridad.',
    date: '2026-09-18',
    createdAt: '2026-09-18',
    status: 'PUBLISHED',
  },
  {
    id: 'rev_admin_02',
    bookingId: 'bk_admin_004',
    studentId: 'usr_003',
    studentName: 'Usuario Anónimo',
    tutorId: 'tut_02',
    tutorName: 'Ing. Carlos Mendoza',
    rating: 1,
    comment: 'Pésimo servicio, se le cayó el internet y no quiso reagendar. Exijo mi dinero de vuelta.',
    date: '2026-09-17',
    createdAt: '2026-09-17',
    status: 'REPORTED',
    reportReason: 'Reportada por el tutor: la clase se impartió y el alumno abandonó por su cuenta.',
  },
];

const DEFAULT_SUBJECTS: AdminSubject[] = [
  { id: 'sb_1', name: 'Cálculo Diferencial e Integral', slug: 'calculo', category: 'Matemáticas', description: 'Límites, derivadas, integrales de Riemann y series infinitas.', active: true, totalTutors: 14, activeTutorsCount: 14 },
  { id: 'sb_2', name: 'Física Cuántica y Ondas', slug: 'fisica', category: 'Física', description: 'Mecánica cuántica, dualidad onda-partícula y postulados de Schrödinger.', active: true, totalTutors: 9, activeTutorsCount: 9 },
  { id: 'sb_3', name: 'Programación Web Fullstack', slug: 'programacion-web', category: 'Informática', description: 'TypeScript, React, Node.js y diseño de arquitecturas REST.', active: true, totalTutors: 22, activeTutorsCount: 22 },
  { id: 'sb_4', name: 'Inglés Conversacional y TOEFL', slug: 'ingles', category: 'Idiomas', description: 'Fluidez verbal, gramática avanzada y preparación para pruebas oficiales.', active: true, totalTutors: 18, activeTutorsCount: 18 },
  { id: 'sb_5', name: 'Química Orgánica y Bioquímica', slug: 'quimica', category: 'Ciencias', description: 'Grupos funcionales, estereoquímica y vías metabólicas celulares.', active: true, totalTutors: 8, activeTutorsCount: 8 },
];

export const adminOperationsService = {
  async getBookings(): Promise<AdminBooking[]> {
    const saved = localStorage.getItem('educonnect_admin_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_admin_bookings', JSON.stringify(DEFAULT_BOOKINGS));
    return DEFAULT_BOOKINGS;
  },

  async getBookingById(id: string): Promise<AdminBooking | null> {
    const list = await this.getBookings();
    return list.find(b => b.id === id) || null;
  },

  async resolveDispute(
    bookingId: string,
    resolution: 'REFUND_STUDENT' | 'PAY_TUTOR' | 'SPLIT',
    resolutionNotes: string
  ): Promise<void> {
    const list = await this.getBookings();
    const updated = list.map(b => {
      if (b.id === bookingId) {
        return {
          ...b,
          status: (resolution === 'REFUND_STUDENT' ? 'CANCELLED' : 'COMPLETED') as any,
          disputeResolution: `Resolución [${resolution}]: ${resolutionNotes}`,
        };
      }
      return b;
    });
    localStorage.setItem('educonnect_admin_bookings', JSON.stringify(updated));
  },

  async getReviews(): Promise<AdminReview[]> {
    const saved = localStorage.getItem('educonnect_admin_reviews');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_admin_reviews', JSON.stringify(DEFAULT_REVIEWS));
    return DEFAULT_REVIEWS;
  },

  async getReviewById(id: string): Promise<AdminReview | null> {
    const list = await this.getReviews();
    return list.find(r => r.id === id) || null;
  },

  async moderateReview(reviewId: string, action: 'approve' | 'hide' | 'delete' | 'PUBLISHED' | 'HIDDEN' | 'DELETED'): Promise<void> {
    const norm = action.toLowerCase();
    const apiAction = norm === 'published' ? 'approve' : norm === 'hidden' ? 'hide' : norm === 'deleted' ? 'delete' : norm;

    try {
      await apiClient.post(`/admin/reviews/${reviewId}/moderate`, { action: apiAction });
    } catch {
      // Offline fallback
    }

    const list = await this.getReviews();
    let updated = list;
    if (apiAction === 'delete') {
      updated = list.filter(r => r.id !== reviewId);
    } else {
      updated = list.map(r => r.id === reviewId ? {
        ...r,
        status: apiAction === 'approve' ? 'PUBLISHED' as const : 'HIDDEN' as const
      } : r);
    }
    localStorage.setItem('educonnect_admin_reviews', JSON.stringify(updated));
  },

  async getSubjects(): Promise<AdminSubject[]> {
    const saved = localStorage.getItem('educonnect_admin_subjects');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_admin_subjects', JSON.stringify(DEFAULT_SUBJECTS));
    return DEFAULT_SUBJECTS;
  },

  async createSubject(subject: Omit<AdminSubject, 'id' | 'totalTutors'>): Promise<AdminSubject> {
    const list = await this.getSubjects();
    const newSubject: AdminSubject = {
      ...subject,
      id: `sb_${Date.now()}`,
      totalTutors: 0,
    };
    const updated = [...list, newSubject];
    localStorage.setItem('educonnect_admin_subjects', JSON.stringify(updated));
    return newSubject;
  },

  async updateSubject(id: string, partial: Partial<AdminSubject>): Promise<void> {
    const list = await this.getSubjects();
    const updated = list.map(s => s.id === id ? { ...s, ...partial } : s);
    localStorage.setItem('educonnect_admin_subjects', JSON.stringify(updated));
  },

  async deleteSubject(id: string): Promise<void> {
    const list = await this.getSubjects();
    const updated = list.filter(s => s.id !== id);
    localStorage.setItem('educonnect_admin_subjects', JSON.stringify(updated));
  },
};
