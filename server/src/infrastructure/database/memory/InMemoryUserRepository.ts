import { IUserRepository } from '../../../domain/user/UserRepository.js';
import { User, UserRole } from '../../../domain/user/User.js';

interface UserRecord {
  user: User;
  password?: string;
  resetToken?: string;
  resetExpires?: Date;
  verificationToken?: string;
}

export class InMemoryUserRepository implements IUserRepository {
  private users: UserRecord[];

  constructor() {
    const now = new Date();
    this.users = [
      {
        user: new User({
          id: 'student-demo-id',
          email: 'alumno@educonnect.com',
          fullName: 'Alejandro Silva',
          roles: ['student'],
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          phone: '+52 55 9876 5432',
          createdAt: now,
          isEmailVerified: true,
          onboardingCompleted: true,
        }),
        password: 'password123',
      },
      {
        user: new User({
          id: 'usr-student-1',
          email: 'student@educonnect.com',
          fullName: 'Alejandro Silva',
          roles: ['student'],
          avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80',
          phone: '+52 55 9876 5432',
          createdAt: now,
          isEmailVerified: true,
          onboardingCompleted: true,
        }),
        password: 'password123',
      },
      {
        user: new User({
          id: 'tutor-demo-id',
          email: 'carlos@educonnect.com',
          fullName: 'Ing. Carlos Mendoza',
          roles: ['tutor'],
          avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
          phone: '+52 55 1234 5678',
          createdAt: now,
          isEmailVerified: true,
          onboardingCompleted: true,
        }),
        password: 'password123',
      },
      {
        user: new User({
          id: 'usr-tutor-1',
          email: 'tutor@educonnect.com',
          fullName: 'Dra. Elena Rostova',
          roles: ['tutor'],
          avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80',
          phone: '+52 55 1234 5678',
          createdAt: now,
          isEmailVerified: true,
          onboardingCompleted: true,
        }),
        password: 'password123',
      },
      {
        user: new User({
          id: 'usr-admin-1',
          email: 'admin@educonnect.com',
          fullName: 'Administrador EduConnect',
          roles: ['admin'],
          avatarUrl: null,
          phone: '+52 55 0000 0000',
          createdAt: now,
          isEmailVerified: true,
          onboardingCompleted: true,
        }),
        password: 'password123',
      },
    ];
  }

  async findById(id: string): Promise<User | null> {
    const record = this.users.find((u) => u.user.id === id);
    if (record) return record.user;

    // 1. Mapeo de alias de desarrollo (student-demo-id <-> usr-student-1, tutor-demo-id <-> usr-tutor-1)
    const aliases: Record<string, string> = {
      'usr-student-1': 'student-demo-id',
      'student-demo-id': 'usr-student-1',
      'usr-tutor-1': 'tutor-demo-id',
      'tutor-demo-id': 'usr-tutor-1',
    };
    if (aliases[id]) {
      const aliasRecord = this.users.find((u) => u.user.id === aliases[id]);
      if (aliasRecord) return aliasRecord.user;
    }

    // 2. Soporte para IDs con formato de slug generado (usr-<email-slug>)
    if (id.startsWith('usr-')) {
      const slug = id.replace(/^usr-/, '').toLowerCase();
      const bySlug = this.users.find(
        (u) => u.user.email.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-') === slug
      );
      if (bySlug) return bySlug.user;
    }

    return null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalized = email.toLowerCase().trim();
    const record = this.users.find((u) => u.user.email.toLowerCase().trim() === normalized);
    return record ? record.user : null;
  }

  async create(user: User, password?: string): Promise<User> {
    const existingIndex = this.users.findIndex((u) => u.user.email.toLowerCase() === user.email.toLowerCase());
    if (existingIndex >= 0) {
      this.users[existingIndex] = { ...this.users[existingIndex], user, password: password || this.users[existingIndex].password };
    } else {
      this.users.push({ user, password });
    }
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const record = this.users.find((u) => u.user.id === id);
    if (!record) throw new Error('Usuario no encontrado');
    Object.assign(record.user, updates);
    return record.user;
  }

  async savePasswordResetToken(userId: string, token: string, expiresAt: Date): Promise<void> {
    const record = this.users.find((u) => u.user.id === userId);
    if (record) {
      record.resetToken = token;
      record.resetExpires = expiresAt;
    }
  }

  async findByPasswordResetToken(token: string): Promise<{ user: User; expiresAt: Date } | null> {
    const record = this.users.find((u) => u.resetToken === token && u.resetExpires);
    if (!record || !record.resetExpires) return null;
    return {
      user: record.user,
      expiresAt: record.resetExpires,
    };
  }

  async clearPasswordResetToken(userId: string): Promise<void> {
    const record = this.users.find((u) => u.user.id === userId);
    if (record) {
      record.resetToken = undefined;
      record.resetExpires = undefined;
    }
  }

  async updatePassword(userId: string, newHashedPassword: string): Promise<void> {
    const record = this.users.find((u) => u.user.id === userId);
    if (record) {
      record.password = newHashedPassword;
    }
  }

  async saveEmailVerificationToken(userId: string, token: string): Promise<void> {
    const record = this.users.find((u) => u.user.id === userId);
    if (record) {
      record.verificationToken = token;
    }
  }

  async findByEmailVerificationToken(token: string): Promise<User | null> {
    const record = this.users.find((u) => u.verificationToken === token);
    return record ? record.user : null;
  }

  async clearEmailVerificationToken(userId: string): Promise<void> {
    const record = this.users.find((u) => u.user.id === userId);
    if (record) {
      record.verificationToken = undefined;
    }
  }
}

