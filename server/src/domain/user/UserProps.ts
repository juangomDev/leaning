import { Email } from './value-objects/Email.js';
import { Phone } from './value-objects/Phone.js';

export type UserRole = 'student' | 'tutor' | 'admin';

export const VALID_ROLES: readonly UserRole[] = ['student', 'tutor', 'admin'] as const;

export interface UserProps {
  id: string;
  email: Email | string;
  fullName: string;
  roles: UserRole[];
  avatarUrl: string | null;
  phone: Phone | string | null;
  createdAt: Date;
  isEmailVerified?: boolean;
  onboardingCompleted?: boolean;
}

export interface CreateUserDTO {
  id?: string;
  email: string;
  fullName: string;
  roles?: UserRole[];
  role?: UserRole;
  avatarUrl?: string | null;
  phone?: string | null;
  createdAt?: Date;
  isEmailVerified?: boolean;
  onboardingCompleted?: boolean;
}
