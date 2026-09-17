import { IUserRepository, AuthResult } from '../../domain/repositories/IUserRepository.js';
import { User } from '../../domain/entities/User.js';
import { UnauthorizedError } from '../../domain/errors/DomainError.js';

interface UserRecord {
  user: User;
  password?: string;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: UserRecord[];

  constructor() {
    this.users = [
      {
        user: new User({
          id: 'student-demo-id',
          email: 'alumno@educonnect.com',
          fullName: 'Alejandro Silva',
          role: 'student',
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          phone: '+52 55 9876 5432',
        }),
        password: 'password123',
      },
      {
        user: new User({
          id: 'tutor-demo-id',
          email: 'carlos@educonnect.com',
          fullName: 'Ing. Carlos Mendoza',
          role: 'tutor',
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          phone: '+52 55 1234 5678',
        }),
        password: 'password123',
      },
    ];
  }

  async findById(id: string): Promise<User | null> {
    const record = this.users.find((u) => u.user.id === id);
    return record ? record.user : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const record = this.users.find((u) => u.user.email.toLowerCase() === email.toLowerCase());
    return record ? record.user : null;
  }

  async create(user: User, password?: string): Promise<User> {
    this.users.push({ user, password });
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const record = this.users.find((u) => u.user.id === id);
    if (!record) throw new Error('Usuario no encontrado');
    Object.assign(record.user, updates);
    return record.user;
  }

  async authenticate(email: string, password?: string): Promise<AuthResult> {
    const record = this.users.find(
      (u) => u.user.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (!record) {
      throw new UnauthorizedError('Credenciales incorrectas');
    }
    return {
      user: record.user,
      token: `mock-jwt-token-${record.user.id}`,
    };
  }
}
