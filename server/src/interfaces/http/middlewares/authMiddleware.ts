import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError } from '../../../domain/shared/errors/DomainError.js';
import { container } from '../../../infrastructure/container.js';

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
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // Soporte para desarrollo / pruebas con header demo
      const demoUserId = req.headers['x-demo-user-id'] as string;
      if (demoUserId) {
        req.user = {
          id: demoUserId,
          role: (req.headers['x-demo-role'] as string) || 'student',
        };
        return next();
      }
      throw new UnauthorizedError('Token de autorización no proporcionado');
    }

    const token = authHeader.split(' ')[1];

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

