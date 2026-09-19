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
}
