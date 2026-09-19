import { UserRole } from '../../../domain/user/User.js';

export interface RegisterUserInputDTO {
  email: string;
  password?: string;
  fullName: string;
  role?: UserRole;
  phone?: string | null;
}

export interface LoginUserInputDTO {
  email: string;
  password?: string;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
  roles: string[];
  avatarUrl: string | null;
  phone: string | null;
  createdAt: string;
}

export interface AuthResponseDTO {
  user: UserResponseDTO;
  token?: string;
}
