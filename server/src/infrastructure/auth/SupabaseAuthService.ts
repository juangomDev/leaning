import jwt from 'jsonwebtoken';
import { IAuthService, TokenPayload } from '../../application/shared/ports/IAuthService.js';
import { supabase } from '../config/supabase.config.js';
import { config } from '../config/env.js';
import { InMemoryAuthService } from './InMemoryAuthService.js';
import { UnauthorizedError } from '../../application/shared/errors/UnauthorizedError.js';

export class SupabaseAuthService implements IAuthService {
  private readonly fallbackAuthService: InMemoryAuthService;
  private readonly secret: string;

  constructor(secret = config.jwtSecret) {
    this.secret = secret;
    this.fallbackAuthService = new InMemoryAuthService(secret);
  }

  async hashPassword(password: string): Promise<string> {
    // Supabase Auth maneja internamente bcrypt/scrypt al hacer signUp.
    // Para validaciones o hashes locales delegamos en la implementación criptográfica segura.
    return await this.fallbackAuthService.hashPassword(password);
  }

  async comparePassword(plain: string, hashed: string): Promise<boolean> {
    return await this.fallbackAuthService.comparePassword(plain, hashed);
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
      throw new UnauthorizedError('Token de Supabase inválido o expirado');
    }
  }

  async signInWithSupabase(email: string, password: string):Promise<{ token: string; user: any }> {
    if (!supabase) {
      throw new Error('Supabase no está configurado');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.session) {
      throw new UnauthorizedError(error?.message || 'Error en autenticación con Supabase');
    }

    return {
      token: data.session.access_token,
      user: data.user,
    };
  }
}
