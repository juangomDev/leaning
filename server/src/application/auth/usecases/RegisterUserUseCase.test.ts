import { describe, it } from 'node:test';
import assert from 'node:assert';
import { RegisterUserUseCase } from './RegisterUserUseCase.js';
import { User } from '../../../domain/user/User.js';
import { IUserRepository } from '../ports/IUserRepository.js';
import { UserAlreadyExistsError } from '../errors/index.js';
import { IClock } from '../../shared/ports/IClock.js';

class MockUserRepository implements IUserRepository {
  public users: Map<string, User> = new Map();

  async findByEmail(email: string): Promise<User | null> {
    for (const u of this.users.values()) {
      if (u.email === email.toLowerCase().trim()) return u;
    }
    return null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async create(user: User, _password?: string): Promise<User> {
    this.users.set(user.id, user);
    return user;
  }

  async update(id: string, updates: Partial<User>): Promise<User> {
    const existing = this.users.get(id);
    if (!existing) throw new Error('Not found');
    Object.assign(existing, updates);
    return existing;
  }
}

class FixedClock implements IClock {
  constructor(private readonly fixedDate: Date) {}
  now(): Date {
    return this.fixedDate;
  }
}

describe('Auth UseCase: RegisterUserUseCase', () => {
  it('debe registrar un usuario exitosamente mapeando a DTO y fijando createdAt con IClock', async () => {
    const userRepo = new MockUserRepository();
    const fixedDate = new Date('2026-01-01T10:00:00Z');
    const clock = new FixedClock(fixedDate);
    const useCase = new RegisterUserUseCase({ userRepository: userRepo, clock });

    const result = await useCase.execute({
      email: 'test@educonnect.com',
      fullName: 'Carlos Rodriguez',
      password: 'password123',
      role: 'student',
      phone: '+1234567890',
    });

    assert.ok(result.id);
    assert.strictEqual(result.email, 'test@educonnect.com');
    assert.strictEqual(result.fullName, 'Carlos Rodriguez');
    assert.deepStrictEqual(result.roles, ['student']);
    assert.strictEqual(result.createdAt, fixedDate.toISOString());
  });

  it('debe lanzar UserAlreadyExistsError si el email ya existe', async () => {
    const userRepo = new MockUserRepository();
    const useCase = new RegisterUserUseCase({ userRepository: userRepo });

    await useCase.execute({
      email: 'duplicate@educonnect.com',
      fullName: 'Original User',
    });

    await assert.rejects(
      async () => {
        await useCase.execute({
          email: 'duplicate@educonnect.com',
          fullName: 'Duplicate User',
        });
      },
      UserAlreadyExistsError
    );
  });
});
