import { apiClient } from '../../../api/apiClient';

export interface OnboardingData {
  role?: string;
  educationLevel?: string;
  learningGoals?: string[];
  preferredSubjects?: string[];
  schedulePreference?: string;
  avatarUrl?: string;
  bio?: string;
  hourlyRate?: number;
  paymentMethod?: string;
}

export const onboardingService = {
  async completeOnboarding(data: OnboardingData) {
    const res = await apiClient.post('/auth/onboarding', data);
    return res.data;
  },
};
