import { apiClient } from '../../../api/apiClient';

export interface TutorBooking {
  id: string;
  studentId: string;
  studentName: string;
  studentAvatar: string;
  studentEmail: string;
  subjectName: string;
  scheduledDate: string;
  scheduledTime: string;
  durationMinutes: number;
  grossAmount: number;
  netEarnings: number;
  platformFee: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
  meetingUrl: string;
  rejectionReason?: string;
}

const DEFAULT_TUTOR_BOOKINGS: TutorBooking[] = [
  {
    id: 'tbk_001',
    studentId: 'stu_101',
    studentName: 'Mateo González',
    studentAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    studentEmail: 'mateo.gonzalez@example.com',
    subjectName: 'Cálculo Diferencial e Integral',
    scheduledDate: '2026-09-22',
    scheduledTime: '16:00',
    durationMinutes: 60,
    grossAmount: 25.0,
    netEarnings: 22.50,
    platformFee: 2.50,
    status: 'CONFIRMED',
    notes: 'Examen de derivadas parciales e integrales dobles en la Universidad.',
    meetingUrl: '/aula-virtual',
  },
  {
    id: 'tbk_002',
    studentId: 'stu_102',
    studentName: 'Valeria Mendoza',
    studentAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    studentEmail: 'valeria.m@example.com',
    subjectName: 'Física Cuántica y Ondas',
    scheduledDate: '2026-09-23',
    scheduledTime: '18:00',
    durationMinutes: 90,
    grossAmount: 37.50,
    netEarnings: 33.75,
    platformFee: 3.75,
    status: 'PENDING',
    notes: 'Solicitud de primera clase de prueba para apoyo en física de ondas.',
    meetingUrl: '/aula-virtual',
  },
  {
    id: 'tbk_003',
    studentId: 'stu_103',
    studentName: 'Camila Rodriguez',
    studentAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    studentEmail: 'camila.r@example.com',
    subjectName: 'Álgebra Lineal',
    scheduledDate: '2026-09-18',
    scheduledTime: '10:00',
    durationMinutes: 60,
    grossAmount: 24.0,
    netEarnings: 21.60,
    platformFee: 2.40,
    status: 'COMPLETED',
    notes: 'Espacios vectoriales y transformaciones lineales.',
    meetingUrl: '/aula-virtual',
  },
];

export const tutorBookingService = {
  async getBookings(): Promise<TutorBooking[]> {
    const saved = localStorage.getItem('educonnect_tutor_bookings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }

    try {
      const res = await apiClient.get('/bookings/my-bookings');
      const list = res.data?.data;
      if (Array.isArray(list) && list.length > 0) {
        return list.map((b: any) => ({
          id: b.id,
          studentId: b.studentId || 'stu_101',
          studentName: b.studentName || 'Estudiante EduConnect',
          studentAvatar: b.studentAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          studentEmail: b.studentEmail || 'estudiante@example.com',
          subjectName: b.subject || 'Clase Particular',
          scheduledDate: b.scheduledAt ? b.scheduledAt.split('T')[0] : '2026-09-22',
          scheduledTime: b.scheduledAt && b.scheduledAt.includes('T') ? b.scheduledAt.split('T')[1].slice(0, 5) : '16:00',
          durationMinutes: b.durationHours ? b.durationHours * 60 : 60,
          grossAmount: b.totalPrice || 25,
          netEarnings: (b.totalPrice || 25) * 0.9,
          platformFee: (b.totalPrice || 25) * 0.1,
          status: (b.status || 'CONFIRMED').toUpperCase(),
          notes: b.notes,
          meetingUrl: '/aula-virtual',
        }));
      }
    } catch {
      // Fallback a los datos mockeados iniciales
    }

    localStorage.setItem('educonnect_tutor_bookings', JSON.stringify(DEFAULT_TUTOR_BOOKINGS));
    return DEFAULT_TUTOR_BOOKINGS;
  },

  async getBookingById(id: string): Promise<TutorBooking | null> {
    const list = await this.getBookings();
    return list.find(b => b.id === id) || null;
  },

  async acceptBooking(bookingId: string): Promise<void> {
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'confirmed' });
    } catch {
      // Offline fallback
    }

    const current = await this.getBookings();
    const updated = current.map(b => b.id === bookingId ? { ...b, status: 'CONFIRMED' as const } : b);
    localStorage.setItem('educonnect_tutor_bookings', JSON.stringify(updated));
  },

  async rejectBooking(bookingId: string, reason: string): Promise<void> {
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'cancelled', notes: reason });
    } catch {
      // Offline fallback
    }

    const current = await this.getBookings();
    const updated = current.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' as const, rejectionReason: reason } : b);
    localStorage.setItem('educonnect_tutor_bookings', JSON.stringify(updated));
  },

  async completeBooking(bookingId: string): Promise<void> {
    try {
      await apiClient.patch(`/bookings/${bookingId}/status`, { status: 'completed' });
    } catch {
      // Offline fallback
    }

    const current = await this.getBookings();
    const updated = current.map(b => b.id === bookingId ? { ...b, status: 'COMPLETED' as const } : b);
    localStorage.setItem('educonnect_tutor_bookings', JSON.stringify(updated));
  },
};
