import { apiClient } from '../../../api/apiClient';

export interface BecomeTutorPayload {
  bio: string;
  hourlyRate: number;
  subject: string;
  modality: 'online' | 'presencial';
  experienceYears?: number;
  degree?: string;
}

export interface BecomeStudentPayload {
  educationLevel: string;
  learningGoals: string[];
}

export const roleService = {
  async becomeTutor(data: BecomeTutorPayload): Promise<any> {
    // 1. Usar endpoint oficial de postulacion de tutor
    const res = await apiClient.post('/tutors/apply', {
      bio: data.bio,
      hourlyRate: data.hourlyRate,
      subject: data.subject,
      modality: data.modality,
      experienceYears: data.experienceYears || 2,
      degree: data.degree || 'Profesional Certificado',
    });

    // 2. Sincronizar estado de onboarding para reflejar el rol en la sesión
    try {
      await apiClient.post('/auth/onboarding', {
        role: 'tutor',
        bio: data.bio,
        hourlyRate: data.hourlyRate,
        schedulePreference: 'Lunes a Viernes',
      });
    } catch {
      // Ignorar si ya se completó el onboarding
    }

    return res.data;
  },

  async becomeStudent(data: BecomeStudentPayload): Promise<any> {
    const res = await apiClient.post('/students', {
      educationLevel: data.educationLevel,
      learningGoals: data.learningGoals,
    });

    try {
      await apiClient.post('/auth/onboarding', {
        role: 'student',
        educationLevel: data.educationLevel,
        learningGoals: data.learningGoals,
      });
    } catch {
      // Ignorar si ya se completó
    }

    return res.data;
  },
};
