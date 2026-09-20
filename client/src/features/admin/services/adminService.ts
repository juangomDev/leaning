import { apiClient } from '../../../api/apiClient';

export interface AdminDashboardSummary {
  totalUsers: number;
  totalTutors: number;
  pendingTutors: number;
  totalStudents: number;
  grossRevenue: number;
  platformCommissions: number;
  totalBookings: number;
  openDisputes: number;
  systemHealth: 'optimal' | 'warning' | 'degraded';
}

export interface AdminUser {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string;
  roles: string[];
  status: 'active' | 'banned';
  banReason?: string;
  walletBalance: number;
  createdAt: string;
  lastLogin: string;
}

export interface AdminTutor {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  headline: string;
  subjects: string[];
  hourlyRate: number;
  verificationStatus: 'verified' | 'pending' | 'rejected';
  isVerified: boolean;
  rejectionReason?: string;
  degree: string;
  experienceYears: number;
  documentUrl: string;
  documents?: { name: string; type: string; url: string }[];
  appliedDate: string;
  createdAt: string;
  bio: string;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

export interface AdminStudent {
  id: string;
  userId: string;
  name: string;
  email: string;
  avatar: string;
  academicLevel: string;
  gradeLevel?: string;
  learningGoals: string[];
  interests?: string[];
  totalBookings: number;
  walletBalance: number;
  joinedDate: string;
  createdAt: string;
  user: {
    name: string;
    email: string;
    avatarUrl?: string;
  };
}

const DEFAULT_USERS: AdminUser[] = [
  {
    id: 'usr_001',
    email: 'admin@educonnect.com',
    full_name: 'Super Administrador',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=120&q=80',
    roles: ['admin'],
    status: 'active',
    walletBalance: 0,
    createdAt: '2026-01-01',
    lastLogin: 'Hace 5 minutos',
  },
  {
    id: 'usr_002',
    email: 'elena.rostova@educonnect.com',
    full_name: 'Dra. Elena Rostova',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    roles: ['tutor'],
    status: 'active',
    walletBalance: 480.0,
    createdAt: '2026-01-10',
    lastLogin: 'Hoy, 08:30',
  },
  {
    id: 'usr_003',
    email: 'mateo.gonzalez@example.com',
    full_name: 'Mateo González',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    roles: ['student'],
    status: 'active',
    walletBalance: 67.50,
    createdAt: '2026-02-01',
    lastLogin: 'Ayer, 19:15',
  },
  {
    id: 'usr_004',
    email: 'carlos.mendoza@example.com',
    full_name: 'Ing. Carlos Mendoza',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    roles: ['tutor', 'student'],
    status: 'active',
    walletBalance: 245.0,
    createdAt: '2026-01-15',
    lastLogin: 'Hoy, 09:10',
  },
  {
    id: 'usr_005',
    email: 'rodrigo.fake@spam.com',
    full_name: 'Rodrigo Spam',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    roles: ['student'],
    status: 'banned',
    banReason: 'Intento de pagos con tarjetas fraudulentas repetidas veces',
    walletBalance: 0,
    createdAt: '2026-03-02',
    lastLogin: 'Hace 10 días',
  },
];

const DEFAULT_TUTORS: AdminTutor[] = [
  {
    id: 'tut_01',
    userId: 'usr_002',
    name: 'Dra. Elena Rostova',
    email: 'elena.rostova@educonnect.com',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
    headline: 'PhD en Física y Matemáticas Puras',
    subjects: ['Cálculo Diferencial', 'Física Cuántica', 'Álgebra Lineal'],
    hourlyRate: 25.0,
    verificationStatus: 'verified',
    isVerified: true,
    degree: 'Doctorado en Ciencias Físicas - UCM',
    experienceYears: 8,
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    documents: [
      { name: 'Titulo_Doctorado_Fisica_UCM.pdf', type: 'PDF', url: '#' },
      { name: 'Certificacion_Docente_Universitaria.pdf', type: 'PDF', url: '#' }
    ],
    appliedDate: '2026-01-10',
    createdAt: '2026-01-10',
    bio: 'Más de 8 años enseñando cálculo diferencial, ecuaciones diferenciales y física para estudiantes de ingeniería.',
    user: {
      name: 'Dra. Elena Rostova',
      email: 'elena.rostova@educonnect.com',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'
    }
  },
  {
    id: 'tut_02',
    userId: 'usr_004',
    name: 'Ing. Carlos Mendoza',
    email: 'carlos.mendoza@example.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    headline: 'Full-Stack Developer & Ex-Google Lead',
    subjects: ['Programación Web', 'Estructuras de Datos', 'Python'],
    hourlyRate: 35.0,
    verificationStatus: 'verified',
    isVerified: true,
    degree: 'Ingeniería en Sistemas Computacionales',
    experienceYears: 10,
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    documents: [
      { name: 'Titulo_Ingenieria_Sistemas.pdf', type: 'PDF', url: '#' }
    ],
    appliedDate: '2026-01-15',
    createdAt: '2026-01-15',
    bio: 'Mentor de código para desarrolladores universitarios y preparación para entrevistas técnicas.',
    user: {
      name: 'Ing. Carlos Mendoza',
      email: 'carlos.mendoza@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80'
    }
  },
  {
    id: 'tut_03',
    userId: 'usr_006',
    name: 'Lic. Mariana Solís',
    email: 'mariana.solis@uni.edu',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80',
    headline: 'Especialista en Bioquímica y Farmacología',
    subjects: ['Bioquímica', 'Química Orgánica', 'Farmacología'],
    hourlyRate: 28.0,
    verificationStatus: 'pending',
    isVerified: false,
    degree: 'Licenciatura en Química Farmacéutica Biológica',
    experienceYears: 4,
    documentUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
    documents: [
      { name: 'Cedula_Profesional_QFB.pdf', type: 'PDF', url: '#' },
      { name: 'Constancia_Docencia_Adjunta.pdf', type: 'PDF', url: '#' }
    ],
    appliedDate: '2026-09-19',
    createdAt: '2026-09-19',
    bio: 'Docente universitaria de bioquímica clínica y preparación para exámenes de grado médico.',
    user: {
      name: 'Lic. Mariana Solís',
      email: 'mariana.solis@uni.edu',
      avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=120&q=80'
    }
  },
];

const DEFAULT_STUDENTS: AdminStudent[] = [
  {
    id: 'stu_01',
    userId: 'usr_003',
    name: 'Mateo González',
    email: 'mateo.gonzalez@example.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
    academicLevel: 'Pregrado Universitario - 3er Semestre',
    gradeLevel: 'Universidad (3er Semestre)',
    learningGoals: ['Cálculo III', 'Física de Ondas'],
    interests: ['Cálculo', 'Física', 'Álgebra Lineal'],
    totalBookings: 6,
    walletBalance: 67.50,
    joinedDate: '2026-02-01',
    createdAt: '2026-02-01',
    user: {
      name: 'Mateo González',
      email: 'mateo.gonzalez@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80'
    }
  },
  {
    id: 'stu_02',
    userId: 'usr_007',
    name: 'Valeria Mendoza',
    email: 'valeria.m@example.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80',
    academicLevel: 'Bachillerato / Preparatoria',
    gradeLevel: 'Preparatoria / Bachillerato',
    learningGoals: ['Física Cuántica', 'Preparación Universitaria'],
    interests: ['Física', 'Matemáticas'],
    totalBookings: 3,
    walletBalance: 45.00,
    joinedDate: '2026-02-20',
    createdAt: '2026-02-20',
    user: {
      name: 'Valeria Mendoza',
      email: 'valeria.m@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=120&q=80'
    }
  },
  {
    id: 'stu_03',
    userId: 'usr_008',
    name: 'Camila Rodriguez',
    email: 'camila.r@example.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80',
    academicLevel: 'Pregrado Universitario',
    gradeLevel: 'Universidad (1er Año)',
    learningGoals: ['Álgebra Lineal', 'Estadística'],
    interests: ['Estadística', 'Python'],
    totalBookings: 4,
    walletBalance: 12.00,
    joinedDate: '2026-03-01',
    createdAt: '2026-03-01',
    user: {
      name: 'Camila Rodriguez',
      email: 'camila.r@example.com',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80'
    }
  },
];

export const adminService = {
  async getDashboardSummary(): Promise<AdminDashboardSummary> {
    const users = await this.getUsers();
    const tutors = await this.getTutors();
    const students = await this.getStudents();

    const pendingTutors = tutors.filter(t => t.verificationStatus === 'pending').length;

    return {
      totalUsers: users.length,
      totalTutors: tutors.length,
      pendingTutors,
      totalStudents: students.length,
      grossRevenue: 14850.00,
      platformCommissions: 1485.00,
      totalBookings: 342,
      openDisputes: 1,
      systemHealth: 'optimal',
    };
  },

  async getUsers(): Promise<AdminUser[]> {
    const saved = localStorage.getItem('educonnect_admin_users');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_admin_users', JSON.stringify(DEFAULT_USERS));
    return DEFAULT_USERS;
  },

  async getUserById(id: string): Promise<AdminUser | null> {
    const users = await this.getUsers();
    return users.find(u => u.id === id) || null;
  },

  async banUser(userId: string, reason: string): Promise<void> {
    try {
      await apiClient.post(`/admin/users/${userId}/ban`, { reason });
    } catch {
      // Offline fallback
    }

    const users = await this.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, status: 'banned' as const, banReason: reason } : u);
    localStorage.setItem('educonnect_admin_users', JSON.stringify(updated));
  },

  async unbanUser(userId: string): Promise<void> {
    const users = await this.getUsers();
    const updated = users.map(u => u.id === userId ? { ...u, status: 'active' as const, banReason: undefined } : u);
    localStorage.setItem('educonnect_admin_users', JSON.stringify(updated));
  },

  async getTutors(): Promise<AdminTutor[]> {
    const saved = localStorage.getItem('educonnect_admin_tutors');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_admin_tutors', JSON.stringify(DEFAULT_TUTORS));
    return DEFAULT_TUTORS;
  },

  async getTutorById(id: string): Promise<AdminTutor | null> {
    const tutors = await this.getTutors();
    return tutors.find(t => t.id === id) || null;
  },

  async approveTutor(tutorId: string): Promise<void> {
    try {
      await apiClient.post(`/admin/tutors/${tutorId}/approve`);
    } catch {
      // Offline fallback
    }

    const tutors = await this.getTutors();
    const updated = tutors.map(t => t.id === tutorId ? { ...t, verificationStatus: 'verified' as const } : t);
    localStorage.setItem('educonnect_admin_tutors', JSON.stringify(updated));
  },

  async rejectTutor(tutorId: string, reason?: string): Promise<void> {
    const tutors = await this.getTutors();
    const updated = tutors.map(t => t.id === tutorId ? { ...t, verificationStatus: 'rejected' as const } : t);
    localStorage.setItem('educonnect_admin_tutors', JSON.stringify(updated));
  },

  async getStudents(): Promise<AdminStudent[]> {
    const saved = localStorage.getItem('educonnect_admin_students');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback
      }
    }
    localStorage.setItem('educonnect_admin_students', JSON.stringify(DEFAULT_STUDENTS));
    return DEFAULT_STUDENTS;
  },
};
