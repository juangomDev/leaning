import { apiClient } from '../../../api/apiClient';

export interface AuthSuccessResponse {
  success: boolean;
  message: string;
  data?: any;
  user?: any;
}

export const authService = {
  async forgotPassword(email: string): Promise<AuthSuccessResponse> {
    const res = await apiClient.post<AuthSuccessResponse>('/auth/forgot-password', { email });
    return res.data;
  },

  async resetPassword(token: string, newPassword: string): Promise<AuthSuccessResponse> {
    const res = await apiClient.post<AuthSuccessResponse>('/auth/reset-password', {
      token,
      newPassword,
    });
    return res.data;
  },

  async verifyEmail(token: string): Promise<AuthSuccessResponse> {
    const res = await apiClient.post<AuthSuccessResponse>('/auth/verify-email', { token });
    return res.data;
  },

  async resendVerification(email: string): Promise<AuthSuccessResponse> {
    const res = await apiClient.post<AuthSuccessResponse>('/auth/resend-verification', { email });
    return res.data;
  },

  async completeOnboarding(data: Record<string, any>): Promise<AuthSuccessResponse> {
    const res = await apiClient.post<AuthSuccessResponse>('/auth/onboarding', data);
    return res.data;
  },
};
