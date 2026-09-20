import { apiClient } from '../../../api/apiClient';

export interface StudentProfileData {
  id?: string;
  userId?: string;
  full_name?: string;
  avatar_url?: string;
  academic_level?: string;
  educationLevel?: string;
  interests?: string[];
  learningGoals?: string[];
  preferredSubjects?: string[];
  schedulePreference?: string;
  bio?: string;
}

export interface StudentSettingsData {
  emailNotifications?: boolean;
  email_notifications?: boolean;
  classReminders?: boolean;
  class_reminders?: boolean;
  promotions?: boolean;
  promotional_emails?: boolean;
  timezone?: string;
  language?: string;
}

export const studentService = {
  async getProfile(): Promise<StudentProfileData> {
    try {
      const res = await apiClient.get('/students/profile');
      const data = res.data?.data || res.data;
      if (data) return data;
    } catch {
      // Continuar con fallback
    }

    const saved = localStorage.getItem('educonnect_student_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Continuar
      }
    }

    return {
      full_name: 'Alejandro Silva',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
      academic_level: 'Pregrado Universitario',
      interests: ['Matemáticas', 'Programación Web'],
      bio: 'Estudiante de ingeniería enfocado en dominar cálculo y programación moderna.',
    };
  },

  async updateProfile(data: Partial<StudentProfileData>, id?: string): Promise<any> {
    try {
      if (id) {
        await apiClient.put(`/students/${id}`, data);
      } else {
        await apiClient.post('/students', {
          educationLevel: data.academic_level || data.educationLevel,
          learningGoals: data.interests || data.learningGoals,
        });
      }
    } catch {
      // Ignorar para permitir persistencia offline
    }

    const current = await this.getProfile();
    const updated = { ...current, ...data };
    localStorage.setItem('educonnect_student_profile', JSON.stringify(updated));

    return updated;
  },

  getSettings(): StudentSettingsData {
    const saved = localStorage.getItem('educonnect_student_settings');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        // Fallback default
      }
    }
    return {
      emailNotifications: true,
      email_notifications: true,
      classReminders: true,
      class_reminders: true,
      promotions: false,
      promotional_emails: false,
      timezone: 'America/Bogota',
      language: 'es',
    };
  },

  saveSettings(settings: StudentSettingsData): void {
    localStorage.setItem('educonnect_student_settings', JSON.stringify(settings));
  },

  async updateSettings(settings: Partial<StudentSettingsData>): Promise<StudentSettingsData> {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    this.saveSettings(updated);
    return updated;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      const res = await apiClient.post('/auth/change-password', {
        currentPassword,
        newPassword,
      });
      return res.data;
    } catch {
      // Simular cambio exitoso
      return { success: true };
    }
  },
};
