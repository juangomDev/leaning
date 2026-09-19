import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LoginUserUseCase } from './LoginUserUseCase.js';
import { User } from '../../../domain/user/User.js';
import { IUserRepository, AuthResult } from '../ports/IUserRepository.js';
import { InvalidCredentialsError } from '../errors/index.js';
import { UnauthorizedError } from '../../../domain/shared/errors/DomainError.js';

class MockAuthUserRepository implements IUserRepository {
  async findById(_id: string): Promise<User | null> { return null; }
  async findByEmail(_email: string): Promise<User | null> { return null; }
  async create(user: User): Promise<User> { return user; }
  async update(_id: string): Promise<User> { throw new Error('Not implemented'); }
  async authenticate(email: string, password?: string): Promise<AuthResult> {
    if (email === 'valid@educonnect.com' && password === 'secret123') {
      const user = new User({
        id: 'user-1',
        email: 'valid@educonnect.com',
        fullName: 'Valid User',
        roles: ['student'],
        avatarUrl: null,
        phone: null,
        createdAt: new Date(),
      });
      return { user, token: 'mock-jwt-token' };
    }
    throw new UnauthorizedError('Credenciales incorrectas');
  }
}

describe('Auth UseCase: LoginUserUseCase', () => {
  it('debe autenticar exitosamente con credenciales válidas y devolver token y DTO', async () => {
    const repo = new MockAuthUserRepository();
    const useCase = new LoginUserUseCase({ userRepository: repo });

    const result = await useCase.execute({
      email: 'valid@educonnect.com',
      password: 'secret123',
    });

    assert.strictEqual(result.token, 'mock-jwt-token');
    assert.strictEqual(result.user.email, 'valid@educonnect.com');
  });

  it('debe lanzar InvalidCredentialsError ante credenciales inválidas', async () => {
    const repo = new MockAuthUserRepository();
    const useCase = new LoginUserUseCase({ userRepository: repo });

    await assert.rejects(
      async () => {
        await useCase.execute({
          email: 'wrong@educonnect.com',
          password: 'bad',
        });
      },
      InvalidCredentialsError
    );
  });
});
