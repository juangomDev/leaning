import { test, describe } from 'node:test';
import assert from 'node:assert';
import { authMiddleware, AuthenticatedRequest } from './middlewares/authMiddleware.js';
import { container } from '../../infrastructure/container.js';
import { UnauthorizedError } from '../../domain/shared/errors/DomainError.js';

describe('HTTP Security: authMiddleware hardening', () => {
  test('debe rechazar peticiones sin token con UnauthorizedError', async () => {
    delete process.env.ALLOW_DEMO_HEADERS;
    const req = {
      cookies: {},
      headers: {},
    } as AuthenticatedRequest;

    let capturedError: any = null;
    await authMiddleware(req, {} as any, (err) => {
      capturedError = err;
    });

    assert.ok(capturedError instanceof UnauthorizedError);
    assert.strictEqual(capturedError.message, 'Token de autenticación no proporcionado (cookie o header)');
  });

  test('debe ignorar cabeceras demo cuando ALLOW_DEMO_HEADERS no está activo', async () => {
    delete process.env.ALLOW_DEMO_HEADERS;
    const req = {
      cookies: {},
      headers: {
        'x-demo-user-id': 'attacker-uuid',
        'x-demo-role': 'admin',
      },
    } as AuthenticatedRequest;

    let capturedError: any = null;
    await authMiddleware(req, {} as any, (err) => {
      capturedError = err;
    });

    assert.ok(capturedError instanceof UnauthorizedError);
    assert.strictEqual(req.user, undefined);
  });

  test('no debe permitir escalación a admin mediante cabeceras demo incluso con ALLOW_DEMO_HEADERS=true', async () => {
    process.env.ALLOW_DEMO_HEADERS = 'true';
    const req = {
      cookies: {},
      headers: {
        'x-demo-user-id': 'dev-user-123',
        'x-demo-role': 'admin',
      },
    } as AuthenticatedRequest;

    let nextCalled = false;
    await authMiddleware(req, {} as any, (err) => {
      if (!err) nextCalled = true;
    });

    assert.strictEqual(nextCalled, true);
    assert.ok(req.user);
    assert.strictEqual(req.user.id, 'dev-user-123');
    // Debe haber degradado admin a student para evitar escalación
    assert.strictEqual(req.user.role, 'student');

    delete process.env.ALLOW_DEMO_HEADERS;
  });

  test('debe autenticar correctamente cuando se provee una cookie auth_token legítima', async () => {
    delete process.env.ALLOW_DEMO_HEADERS;
    const token = container.authService.generateToken({
      id: 'valid-admin-id',
      email: 'admin@educonnect.com',
      role: 'admin',
      roles: ['admin'],
    });

    const req = {
      cookies: {
        auth_token: token,
      },
      headers: {},
    } as AuthenticatedRequest;

    let nextCalled = false;
    await authMiddleware(req, {} as any, (err) => {
      if (!err) nextCalled = true;
    });

    assert.strictEqual(nextCalled, true);
    assert.ok(req.user);
    assert.strictEqual(req.user.id, 'valid-admin-id');
    assert.strictEqual(req.user.role, 'admin');
  });
});
