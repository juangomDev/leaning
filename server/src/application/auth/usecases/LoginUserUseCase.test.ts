import { describe, it } from 'node:test';
import assert from 'node:assert';
import { LoginUserUseCase } from './LoginUserUseCase.js';
import { User } from '../../../domain/user/User.js';
import { IUserRepository } from '../ports/IUserRepository.js';
import { IAuthService, TokenPayload } from '../../shared/ports/IAuthService.js';
import { InvalidCredentialsError } from '../errors/index.js';
import { UnauthorizedError } from '../../../domain/shared/errors/DomainError.js';

class MockUserRepository implements IUserRepository {
  private user = new User({
    id: 'user-1',
    email: 'valid@educonnect.com',
    fullName: 'Valid User',
    roles: ['student'],
    avatarUrl: null,
    phone: null,
    createdAt: new Date(),
  });

  async findById(id: string): Promise<User | null> {
    return id === 'user-1' ? this.user : null;
  }
  async findByEmail(email: string): Promise<User | null> {
    return email === 'valid@educonnect.com' ? this.user : null;
  }
  async create(user: User): Promise<User> { return user; }
  async update(_id: string): Promise<User> { throw new Error('Not implemented'); }
}

class MockAuthService implements IAuthService {
  async hashPassword(password: string): Promise<string> { return password; }
  async comparePassword(plain: string, hashed: string): Promise<boolean> { return plain === hashed; }
  generateToken(_payload: TokenPayload): string { return 'mock-jwt-token'; }
  verifyToken(_token: string): TokenPayload { return { id: 'user-1', email: 'valid@educonnect.com' }; }
  async login(email: string, password: string): Promise<{ token: string; userId: string; role?: string; email?: string }> {
    if (email === 'valid@educonnect.com' && password === 'secret123') {
      return { token: 'mock-jwt-token', userId: 'user-1', email, role: 'student' };
    }
    throw new UnauthorizedError('Credenciales incorrectas');
  }
}

describe('Auth UseCase: LoginUserUseCase', () => {
  it('debe autenticar exitosamente con credenciales válidas y devolver token y DTO', async () => {
    const repo = new MockUserRepository();
    const authService = new MockAuthService();
    const useCase = new LoginUserUseCase({ userRepository: repo, authService });

    const result = await useCase.execute({
      email: 'valid@educonnect.com',
      password: 'secret123',
    });

    assert.strictEqual(result.token, 'mock-jwt-token');
    assert.strictEqual(result.user.email, 'valid@educonnect.com');
  });

  it('debe lanzar InvalidCredentialsError ante credenciales inválidas', async () => {
    const repo = new MockUserRepository();
    const authService = new MockAuthService();
    const useCase = new LoginUserUseCase({ userRepository: repo, authService });

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
