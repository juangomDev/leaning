import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';
import { IAuthService, TokenPayload } from '../../application/shared/ports/IAuthService.js';
import { config } from '../config/env.js';
import { UnauthorizedError } from '../../application/shared/errors/UnauthorizedError.js';

export class InMemoryAuthService implements IAuthService {
  private readonly secret: string;

  constructor(secret = config.jwtSecret) {
    this.secret = secret;
  }

  async hashPassword(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16).toString('hex');
      crypto.scrypt(password, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        resolve(`${salt}:${derivedKey.toString('hex')}`);
      });
    });
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const [salt, key] = hashed.split(':');
      if (!salt || !key) {
        resolve(false);
        return;
      }

      crypto.scrypt(plain, salt, 64, (err, derivedKey) => {
        if (err) reject(err);
        const keyBuffer = Buffer.from(key, 'hex');
        const match = crypto.timingSafeEqual(keyBuffer, derivedKey);
        resolve(match);
      });
    });
  }

  generateToken(payload: TokenPayload): string {
    return jwt.sign(
      {
        id: payload.id,
        email: payload.email,
        role: payload.role || payload.roles?.[0] || 'student',
        roles: payload.roles || (payload.role ? [payload.role] : ['student']),
      },
      this.secret,
      { expiresIn: '7d' }
    );
  }

  verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, this.secret) as TokenPayload;
      return {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
        roles: decoded.roles,
      };
    } catch {
      throw new UnauthorizedError('Token de autenticación inválido o expirado');
    }
  }

  async login(
    email: string,
    password?: string
  ): Promise<{ token: string; userId: string; role?: string; email?: string }> {
    const normalizedEmail = email.toLowerCase().trim();

    if (password && password.length < 6) {
      throw new UnauthorizedError('Credenciales inválidas: contraseña demasiado corta');
    }

    const mockUsers: Record<string, { id: string; role: string }> = {
      'student@educonnect.com': { id: 'usr-student-1', role: 'student' },
      'tutor@educonnect.com': { id: 'usr-tutor-1', role: 'tutor' },
      'admin@educonnect.com': { id: 'usr-admin-1', role: 'admin' },
    };

    const user = mockUsers[normalizedEmail] || {
      id: `usr-${normalizedEmail.replace(/[^a-zA-Z0-9]/g, '-')}`,
      role: normalizedEmail.includes('tutor') ? 'tutor' : normalizedEmail.includes('admin') ? 'admin' : 'student',
    };

    const token = this.generateToken({
      id: user.id,
      email: normalizedEmail,
      role: user.role,
      roles: [user.role],
    });

    return {
      token,
      userId: user.id,
      role: user.role,
      email: normalizedEmail,
    };
  }
}

