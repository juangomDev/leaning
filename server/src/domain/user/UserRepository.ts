import { User } from './User.js';

export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(user: User, password?: string): Promise<User>;
  update(id: string, updates: Partial<User>): Promise<User>;
}

// Alias de compatibilidad
export type IUserRepository = UserRepository;

