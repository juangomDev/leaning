import { apiClient } from '../../../api/apiClient';

export interface StudentBooking {
  id: string;
  studentId?: string;
  student_id?: string;
  tutorId?: string;
  tutor_id: string;
  tutorName?: string;
  tutor_name: string;
  tutorAvatar?: string;
  tutor_avatar?: string;
  subject?: string;
  subject_name: string;
  scheduledAt?: string;
  scheduled_at?: string;
  scheduled_date: string;
  scheduled_time: string;
  durationHours?: number;
  duration_minutes: number;
  modality?: 'online' | 'presencial' | string;
  status: 'CONFIRMED' | 'PENDING' | 'COMPLETED' | 'CANCELLED' | string;
  totalPrice?: number;
  price_paid: number;
  notes?: string;
  meetingUrl?: string;
  createdAt?: string;
}

export type BookingItem = StudentBooking;

export interface CreateBookingPayload {
  tutorId?: string;
  tutor_id?: string;
  tutorName?: string;
  tutor_name?: string;
  tutorAvatar?: string;
  tutor_avatar?: string;
  subject?: string;
  subject_name?: string;
  scheduledAt?: string;
  scheduled_date?: string;
  scheduled_time?: string;
  durationHours?: number;
  duration_minutes?: number;
  modality?: 'online' | 'presencial';
  notes?: string;
  price_paid?: number;
}

const MOCK_STUDENT_BOOKINGS: StudentBooking[] = [
  {
    id: 'bk_001',
    tutor_id: 'tut_01',
    tutorId: 'tut_01',
    tutor_name: 'Dra. Elena Rostova',
    tutorName: 'Dra. Elena Rostova',
    tutor_avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    subject_name: 'Cálculo Diferencial e Integral',
    subject: 'Cálculo Diferencial e Integral',
    scheduled_date: '2026-09-22',
    scheduled_time: '16:00',
    duration_minutes: 60,
    status: 'CONFIRMED',
    price_paid: 27.50,
    notes: 'Preparación para el examen parcial de derivadas e integrales triples.',
    meetingUrl: '/aula-virtual',
  },
  {
    id: 'bk_002',
    tutor_id: 'tut_02',
    tutorId: 'tut_02',
    tutor_name: 'Ing. Carlos Mendoza',
    tutorName: 'Ing. Carlos Mendoza',
    tutor_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    subject_name: 'Estructuras de Datos y Algoritmos',
    subject: 'Estructuras de Datos y Algoritmos',
    scheduled_date: '2026-09-24',
    scheduled_time: '18:30',
    duration_minutes: 90,
    status: 'CONFIRMED',
    price_paid: 37.50,
    notes: 'Árboles binarios de búsqueda y grafos.',
    meetingUrl: '/aula-virtual',
  },
  {
    id: 'bk_003',
    tutor_id: 'tut_03',
    tutorId: 'tut_03',
    tutor_name: 'Lic. Sarah Jenkins',
    tutorName: 'Lic. Sarah Jenkins',
    tutor_avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    subject_name: 'Inglés Conversacional Avanzado',
    subject: 'Inglés Conversacional Avanzado',
    scheduled_date: '2026-09-15',
    scheduled_time: '11:00',
    duration_minutes: 60,
    status: 'COMPLETED',
    price_paid: 24.50,
    notes: 'Simulacro de entrevista de trabajo técnica en inglés.',
    meetingUrl: '/aula-virtual',
  },
];

export const studentBookingService = {
  async getBookings(): Promise<StudentBooking[]> {
    try {
      const res = await apiClient.get('/bookings/my-bookings');
      const list = res.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((b: any) => ({
          id: b.id,
          tutor_id: b.tutorId || b.tutor_id || 'tut_01',
          tutorId: b.tutorId || b.tutor_id || 'tut_01',
          tutor_name: b.tutorName || b.tutor_name || 'Profesor EduConnect',
          tutorName: b.tutorName || b.tutor_name || 'Profesor EduConnect',
          tutor_avatar: b.tutorAvatar || b.tutor_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          subject_name: b.subject || b.subject_name || 'Tutoría General',
          subject: b.subject || b.subject_name || 'Tutoría General',
          scheduled_date: b.scheduled_date || (b.scheduledAt ? b.scheduledAt.split('T')[0] : '2026-09-22'),
          scheduled_time: b.scheduled_time || (b.scheduledAt && b.scheduledAt.includes('T') ? b.scheduledAt.split('T')[1].slice(0, 5) : '16:00'),
          duration_minutes: b.duration_minutes || (b.durationHours ? b.durationHours * 60 : 60),
          status: (b.status || 'CONFIRMED').toUpperCase(),
          price_paid: b.price_paid || b.totalPrice || b.total_price || 25,
          notes: b.notes,
          meetingUrl: b.meetingUrl || '/aula-virtual',
        }));
      }
    } catch {
      // Fallback a los datos mockeados iniciales
    }

    // Retornar mocks almacenados localmente si existen
    const local = localStorage.getItem('educonnect_student_bookings');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        // Fallback
      }
    }

    localStorage.setItem('educonnect_student_bookings', JSON.stringify(MOCK_STUDENT_BOOKINGS));
    return MOCK_STUDENT_BOOKINGS;
  },

  async getMyBookings(): Promise<StudentBooking[]> {
    return this.getBookings();
  },

  async getBookingById(id: string): Promise<StudentBooking | null> {
    const list = await this.getBookings();
    const found = list.find(b => b.id === id);
    if (found) return found;

    try {
      const res = await apiClient.get(`/bookings/${id}`);
      return res.data?.data || null;
    } catch {
      return null;
    }
  },

  async createBooking(payload: CreateBookingPayload): Promise<StudentBooking> {
    const tutorId = payload.tutor_id || payload.tutorId || 'tut_01';
    const tutorName = payload.tutor_name || payload.tutorName || 'Profesor EduConnect';
    const tutorAvatar = payload.tutor_avatar || payload.tutorAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
    const subjectName = payload.subject_name || payload.subject || 'Clase Particular';
    const scheduledDate = payload.scheduled_date || '2026-09-25';
    const scheduledTime = payload.scheduled_time || '16:00';
    const durationMinutes = payload.duration_minutes || (payload.durationHours ? payload.durationHours * 60 : 60);
    const pricePaid = payload.price_paid || 27.50;

    const newBooking: StudentBooking = {
      id: `bk_${Date.now()}`,
      tutor_id: tutorId,
      tutorId: tutorId,
      tutor_name: tutorName,
      tutorName: tutorName,
      tutor_avatar: tutorAvatar,
      subject_name: subjectName,
      subject: subjectName,
      scheduled_date: scheduledDate,
      scheduled_time: scheduledTime,
      duration_minutes: durationMinutes,
      status: 'CONFIRMED',
      price_paid: pricePaid,
      notes: payload.notes || '',
      meetingUrl: '/aula-virtual',
    };

    try {
      await apiClient.post('/bookings', {
        tutorId,
        subject: subjectName,
        scheduledAt: `${scheduledDate}T${scheduledTime}:00Z`,
        durationHours: durationMinutes / 60,
        modality: payload.modality || 'online',
        notes: payload.notes,
      });
    } catch {
      // Ignorar error de red y persistir localmente
    }

    const current = await this.getBookings();
    const updated = [newBooking, ...current];
    localStorage.setItem('educonnect_student_bookings', JSON.stringify(updated));

    return newBooking;
  },

  async cancelBooking(bookingId: string, reason: string): Promise<any> {
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, {
        status: 'cancelled',
        notes: reason,
      });
    } catch {
      // Continuar con actualización local
    }

    const current = await this.getBookings();
    const updated = current.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED', notes: reason } : b);
    localStorage.setItem('educonnect_student_bookings', JSON.stringify(updated));

    return { success: true };
  },

  async rescheduleBooking(bookingId: string, newScheduledAt: string): Promise<any> {
    const parts = newScheduledAt.split(' ');
    const newDate = parts[0] || newScheduledAt;
    const newTime = parts[1] || '16:00';

    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, {
        status: 'confirmed',
        notes: `Reprogramada para: ${newScheduledAt}`,
      });
    } catch {
      // Continuar
    }

    const current = await this.getBookings();
    const updated = current.map(b => b.id === bookingId ? {
      ...b,
      scheduled_date: newDate,
      scheduled_time: newTime,
      status: 'CONFIRMED'
    } : b);
    localStorage.setItem('educonnect_student_bookings', JSON.stringify(updated));

    return { success: true };
  },

  async submitReview(payload: {
    tutorId: string;
    bookingId: string;
    rating: number;
    comment: string;
  }): Promise<any> {
    try {
      await apiClient.post('/reviews', payload);
    } catch {
      // Continuar
    }

    const current = await this.getBookings();
    const updated = current.map(b => b.id === payload.bookingId ? { ...b, status: 'COMPLETED' } : b);
    localStorage.setItem('educonnect_student_bookings', JSON.stringify(updated));

    return { success: true };
  },
};
