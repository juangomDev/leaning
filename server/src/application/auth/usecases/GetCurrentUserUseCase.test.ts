import { describe, it } from 'node:test';
import assert from 'node:assert';
import { GetCurrentUserUseCase } from './GetCurrentUserUseCase.js';
import { User } from '../../../domain/user/User.js';
import { IUserRepository, AuthResult } from '../ports/IUserRepository.js';
import { NotFoundError } from '../../shared/errors/NotFoundError.js';

class MockFindUserRepository implements IUserRepository {
  private user: User = new User({
    id: 'user-42',
    email: 'user42@educonnect.com',
    fullName: 'Douglas Adams',
    roles: ['tutor'],
    avatarUrl: null,
    phone: null,
    createdAt: new Date('2026-01-01'),
  });

  async findById(id: string): Promise<User | null> {
    return id === 'user-42' ? this.user : null;
  }
  async findByEmail(_email: string): Promise<User | null> { return null; }
  async create(user: User): Promise<User> { return user; }
  async update(_id: string): Promise<User> { throw new Error('Not implemented'); }
  async authenticate(): Promise<AuthResult> { throw new Error('Not implemented'); }
}

describe('Auth UseCase: GetCurrentUserUseCase', () => {
  it('debe obtener el usuario actual y mapearlo a DTO', async () => {
    const repo = new MockFindUserRepository();
    const useCase = new GetCurrentUserUseCase({ userRepository: repo });

    const result = await useCase.execute('user-42');
    assert.strictEqual(result.id, 'user-42');
    assert.strictEqual(result.fullName, 'Douglas Adams');
    assert.strictEqual(result.email, 'user42@educonnect.com');
  });

  it('debe lanzar NotFoundError si el usuario no existe', async () => {
    const repo = new MockFindUserRepository();
    const useCase = new GetCurrentUserUseCase({ userRepository: repo });

    await assert.rejects(
      async () => {
        await useCase.execute('non-existent');
      },
      NotFoundError
    );
  });
});
