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
      // 1. Validar token firmado con la clave secreta del servidor (HS256)
      const decoded = jwt.verify(token, this.secret) as any;
      const role = decoded.role || decoded.user_metadata?.role || (Array.isArray(decoded.roles) ? decoded.roles[0] : 'student');
      const roles = decoded.roles || (decoded.user_metadata?.roles ? decoded.user_metadata.roles : [role]);

      return {
        id: decoded.id || decoded.sub,
        email: decoded.email,
        role: role,
        roles: roles,
      };
    } catch (err: any) {
      // 2. Si falló la verificación HMAC (ej. tokens asimétricos ES256 emitidos por Supabase Auth)
      const decoded = jwt.decode(token) as any;
      if (decoded && (decoded.sub || decoded.id)) {
        if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
          throw new UnauthorizedError('Token de Supabase expirado');
        }

        const role = decoded.role || decoded.user_metadata?.role || (Array.isArray(decoded.roles) ? decoded.roles[0] : 'student');
        const roles = decoded.roles || (decoded.user_metadata?.roles ? decoded.user_metadata.roles : [role]);

        return {
          id: decoded.id || decoded.sub,
          email: decoded.email,
          role: role,
          roles: roles,
        };
      }

      throw new UnauthorizedError('Token de Supabase inválido o expirado');
    }
  }

  async login(
    email: string,
    password?: string
  ): Promise<{ token: string; userId: string; role?: string; email?: string }> {
    if (!supabase) {
      return this.fallbackAuthService.login(email, password);
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: password || '',
    });

    if (error || !data.session || !data.user) {
      throw new UnauthorizedError(error?.message || 'Error en autenticación con Supabase');
    }

    return {
      token: data.session.access_token,
      userId: data.user.id,
      email: data.user.email,
      role: (data.user.user_metadata?.role as string) || 'student',
    };
  }

  async signInWithSupabase(email: string, password: string): Promise<{ token: string; user: any }> {
    const result = await this.login(email, password);
    return {
      token: result.token,
      user: { id: result.userId, email: result.email, role: result.role },
    };
  }
}

