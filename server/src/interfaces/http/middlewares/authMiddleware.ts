import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../domain/shared/errors/DomainError.js';
import { container } from '../../../infrastructure/container.js';
import { config } from '../../../infrastructure/config/env.js';

export interface AuthenticatedUser {
  id: string;
  role: string;
  email?: string;
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

export const authMiddleware = async (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // 1. Extraer token de cookie HttpOnly o del header Authorization (fallback)
    const tokenFromCookie = req.cookies?.auth_token;
    const tokenFromHeader = req.headers.authorization?.startsWith('Bearer ')
      ? req.headers.authorization.split(' ')[1]
      : null;

    const token = tokenFromCookie || tokenFromHeader;

    if (!token) {
      // Cabeceras demo estrictamente bloqueadas en producción
      const isProduction = config.nodeEnv === 'production';
      const allowDemoHeaders = process.env.ALLOW_DEMO_HEADERS === 'true';

      if (!isProduction && allowDemoHeaders) {
        const demoUserId = req.headers['x-demo-user-id'] as string;
        if (demoUserId) {
          // Prevenir escalación de privilegios: nunca permitir admin por header no autenticado
          const requestedRole = (req.headers['x-demo-role'] as string) || 'student';
          const safeRole = requestedRole === 'admin' ? 'student' : requestedRole;

          req.user = {
            id: demoUserId,
            role: safeRole,
          };
          return next();
        }
      }

      throw new UnauthorizedError('Token de autenticación no proporcionado (cookie o header)');
    }

    // Validación desacoplada a través del puerto IAuthService
    const payload = container.authService.verifyToken(token);
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role || payload.roles?.[0] || 'student',
    };
    return next();
  } catch (err: any) {
    if (err instanceof UnauthorizedError) {
      return next(err);
    }
    return next(new UnauthorizedError(err.message || 'Token de autorización inválido o expirado'));
  }
};

