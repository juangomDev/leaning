import { User } from './User.js';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User, password?: string): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  savePasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void>;
  findByPasswordResetToken(token: string): Promise<{ user: User; expiresAt: Date } | null>;
  clearPasswordResetToken(userId: string): Promise<void>;
  updatePassword(userId: string, newHashedPassword: string): Promise<void>;
  saveEmailVerificationToken(userId: string, token: string): Promise<void>;
  findByEmailVerificationToken(token: string): Promise<User | null>;
  clearEmailVerificationToken(userId: string): Promise<void>;
}

// Alias de compatibilidad
export type IUserRepository = UserRepository;

