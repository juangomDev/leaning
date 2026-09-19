import { describe, it } from 'node:test';
import assert from 'node:assert';
import { InMemoryAuthService } from './InMemoryAuthService.js';
import { UnauthorizedError } from '../../application/shared/errors/UnauthorizedError.js';

describe('Infrastructure: InMemoryAuthService', () => {
  const authService = new InMemoryAuthService('test-secret-key-12345');

  it('debe hashear contraseñas y compararlas correctamente', async () => {
    const plain = 'SuperSecret123!';
    const hashed = await authService.hashPassword(plain);

    assert.notStrictEqual(hashed, plain);
    assert.ok(hashed.includes(':'));

    const isMatch = await authService.comparePassword(plain, hashed);
    assert.strictEqual(isMatch, true);

    const isBadMatch = await authService.comparePassword('WrongPassword', hashed);
    assert.strictEqual(isBadMatch, false);
  });

  it('debe generar y verificar tokens JWT válidos', () => {
    const payload = {
      id: 'usr-auth-test',
      email: 'tester@educonnect.com',
      role: 'tutor',
    };

    const token = authService.generateToken(payload);
    assert.ok(typeof token === 'string');
    assert.ok(token.length > 20);

    const decoded = authService.verifyToken(token);
    assert.strictEqual(decoded.id, 'usr-auth-test');
    assert.strictEqual(decoded.email, 'tester@educonnect.com');
    assert.strictEqual(decoded.role, 'tutor');
  });

  it('debe rechazar tokens alterados o inválidos', () => {
    assert.throws(() => {
      authService.verifyToken('invalid.token.payload');
    }, UnauthorizedError);
  });
});
