import { User } from '../entities/User.js';

export interface AuthResult {
  user: User;
  token: string;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User, password?: string): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
  authenticate(email: string, password?: string): Promise<AuthResult>;
}
