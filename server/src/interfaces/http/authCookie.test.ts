import { describe, it } from 'node:test';
import assert from 'node:assert';
import app from '../../app.js';
import { container } from '../../infrastructure/container.js';

describe('HTTP: HttpOnly Cookie Authentication & Logout', () => {
  it('login establece cookie HttpOnly y no expone el token en el body', async () => {
    // Simulamos req y res para login
    let cookieName = '';
    let cookieValue = '';
    let cookieOptions: any = {};
    let jsonResponse: any = null;
    let statusCode = 0;

    const req: any = {
      body: {
        email: 'alumno@educonnect.com',
        password: 'password123',
      },
    };

    const res: any = {
      cookie(name: string, val: string, opts: any) {
        cookieName = name;
        cookieValue = val;
        cookieOptions = opts;
        return this;
      },
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    };

    await container.authController.login(req, res, () => {});

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(cookieName, 'auth_token');
    assert.ok(cookieValue && cookieValue.length > 20);
    assert.strictEqual(cookieOptions.httpOnly, true);
    assert.strictEqual(cookieOptions.path, '/');

    // Confirmar que el JSON no expone el token
    assert.ok(jsonResponse.data.user);
    assert.strictEqual(jsonResponse.data.token, undefined);
  });

  it('logout elimina la cookie auth_token', async () => {
    let clearedName = '';
    let clearedOptions: any = {};
    let statusCode = 0;
    let jsonResponse: any = null;

    const req: any = {};
    const res: any = {
      clearCookie(name: string, opts: any) {
        clearedName = name;
        clearedOptions = opts;
        return this;
      },
      status(code: number) {
        statusCode = code;
        return this;
      },
      json(data: any) {
        jsonResponse = data;
        return this;
      },
    };

    await container.authController.logout(req, res, () => {});

    assert.strictEqual(statusCode, 200);
    assert.strictEqual(clearedName, 'auth_token');
    assert.strictEqual(clearedOptions.httpOnly, true);
    assert.strictEqual(jsonResponse.success, true);
    assert.strictEqual(jsonResponse.message, 'Sesión cerrada exitosamente');
  });

  it('authMiddleware autentica correctamente leyendo req.cookies.auth_token', async () => {
    const validToken = container.authService.generateToken({
      id: 'student-demo-id',
      email: 'alumno@educonnect.com',
      role: 'student',
    });

    const req: any = {
      cookies: {
        auth_token: validToken,
      },
      headers: {},
    };
    const res: any = {};
    let nextCalled = false;
    let nextError: any = null;

    const { authMiddleware } = await import('./middlewares/authMiddleware.js');
    await authMiddleware(req, res, (err?: any) => {
      nextCalled = true;
      nextError = err;
    });

    assert.strictEqual(nextCalled, true);
    assert.strictEqual(nextError, undefined);
    assert.strictEqual(req.user.id, 'student-demo-id');
    assert.strictEqual(req.user.role, 'student');
  });

  it('flujo completo: registro -> login (cookie) -> getMe resuelve el usuario correctamente', async () => {
    // 1. Registro
    let regResponse: any = null;
    const regReq: any = {
      body: {
        email: 'juan@example.com',
        password: 'password123',
        fullName: 'Juan Perez',
        role: 'student',
      },
    };
    const regRes: any = {
      status(_code: number) { return this; },
      json(data: any) { regResponse = data; return this; },
    };
    await container.authController.register(regReq, regRes, () => {});
    assert.strictEqual(regResponse.success, true);
    const registeredId = regResponse.data.id;

    // 2. Login
    let cookieVal = '';
    const loginReq: any = {
      body: { email: 'juan@example.com', password: 'password123' },
    };
    const loginRes: any = {
      cookie(_name: string, val: string) { cookieVal = val; return this; },
      status(_code: number) { return this; },
      json(_data: any) { return this; },
    };
    await container.authController.login(loginReq, loginRes, () => {});
    assert.ok(cookieVal.length > 20);

    // 3. authMiddleware con la cookie
    const authReq: any = {
      cookies: { auth_token: cookieVal },
      headers: {},
    };
    const { authMiddleware } = await import('./middlewares/authMiddleware.js');
    await authMiddleware(authReq, {} as any, () => {});
    assert.strictEqual(authReq.user.id, registeredId);

    // 4. getMe
    let meData: any = null;
    let meCode = 0;
    const meRes: any = {
      status(code: number) { meCode = code; return this; },
      json(data: any) { meData = data; return this; },
    };
    await container.authController.getMe(authReq, meRes, () => {});
    assert.strictEqual(meCode, 200);
    assert.strictEqual(meData.data.email, 'juan@example.com');
    assert.strictEqual(meData.data.id, registeredId);
  });

  it('getMe resuelve usuario con cookie heredada con ID derivado usr-juan-example-com sin lanzar 404', async () => {
    const legacyToken = container.authService.generateToken({
      id: 'usr-juan-example-com',
      email: 'juan@example.com',
      role: 'student',
    });

    const req: any = {
      cookies: { auth_token: legacyToken },
      headers: {},
    };
    const { authMiddleware } = await import('./middlewares/authMiddleware.js');
    await authMiddleware(req, {} as any, () => {});

    let meData: any = null;
    let meCode = 0;
    const meRes: any = {
      status(code: number) { meCode = code; return this; },
      json(data: any) { meData = data; return this; },
    };

    await container.authController.getMe(req, meRes, () => {});
    assert.strictEqual(meCode, 200);
    assert.strictEqual(meData.data.email, 'juan@example.com');
  });
});
